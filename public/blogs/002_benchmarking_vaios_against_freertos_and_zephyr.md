---
title: "Benchmarking VAIOS: An Honest Three-Way Test Against FreeRTOS and Zephyr"
date: "May 22, 2026"
author: "VAYU Team"
excerpt: "We put our in-house real-time operating system head-to-head with FreeRTOS and Zephyr on the same flight-controller hardware. Here is what we found — including where we lose."
coverImage: "/blogs/blog_2.png"
---

# Benchmarking VAIOS: An Honest Three-Way Test Against FreeRTOS and Zephyr

Building a real-time operating system is one thing. Knowing whether it is actually good is another. For a flight controller, "good" is not a feeling — it is a number, measured in CPU cycles, and it decides whether a drone holds steady in a gust or tumbles out of the sky.

VAIOS is the real-time operating system we are building from scratch as the core of our indigenous flight-control stack. From the start we knew that an in-house RTOS only earns its place if it can stand next to the two systems that already dominate embedded real-time software: **FreeRTOS** and **Zephyr**. So we built a benchmark suite to find out — and we committed, before seeing a single result, to publishing whatever it told us.

This is that report. VAIOS does well in places we are proud of. It also loses, clearly, in others. Both halves are here.

## A benchmark is only as good as its fairness

The hardest part of comparing three operating systems is not writing the tests. It is making sure the comparison is honest.

Every number below was measured on the **same physical board** — an ST Nucleo-F401RE carrying a real STM32F401RE microcontroller (a Cortex-M4F running at 84 MHz), the same class of chip that flies on a small drone. Not a simulator, not an emulator. Real silicon, with all the messy timing behaviour that real hardware brings.

But identical hardware is not enough. A benchmark can lie in a dozen quiet ways, and early on, ours did. An internal run once showed VAIOS trailing its rivals by margins of 8× to 100×. The cause was not the kernel. It was us: we had compiled VAIOS with optimisations switched off while the reference builds of FreeRTOS and Zephyr ran fully optimised. The comparison was meaningless. We threw away every number and started again.

The rebuilt suite locks down every variable that can skew a result:

- **Same compiler, same flags** — one version of `arm-none-eabi-gcc`, all three built at `-O2`.
- **Same clock** — 84 MHz, configured identically.
- **Same memory budget** — a 32 KB heap and a 1 ms kernel tick on every system.
- **Same priority model** — eight priority levels, strict preemption, no time-slicing.
- **No logging in the measurement window** — printing a single line over the serial port costs thousands of cycles and would swamp the very thing we are trying to measure.

If any one of those rules is broken, the run is a debugging exercise, not a benchmark. That distinction is the whole point.

## Measuring in cycles, not guesses

Our first attempt at timing used the millisecond system tick. That is far too coarse: a context switch takes a few microseconds, so a millisecond clock simply reports "zero" and tells you nothing.

The real instrument is the Cortex-M4's **cycle counter** (the DWT `CYCCNT` register). It ticks once per CPU cycle — about 12 nanoseconds at 84 MHz — and it is the only honest way to measure operations this small.

We also stopped reporting averages. An average hides the worst case, and in hard real-time the worst case is the only case that matters. A control loop that is usually fast but occasionally stalls will still crash a drone. So every latency test records its full distribution — thousands of individual samples — and we look at the median and the tail together. A system that is fast *and* consistent is the goal; a fast average with an ugly tail is a trap.

## The results

All figures below are median values from a real-hardware run. Lower is better for every cycle-count metric; higher is better for throughput. At 84 MHz, **84 cycles is roughly one microsecond**.

| Metric | Unit | VAIOS | FreeRTOS | Zephyr | Leader |
|--------|------|-------|----------|--------|--------|
| Context switch (yield) | cycles | 240 | **164** | 304 | FreeRTOS |
| Context switch (FPU task) | cycles | 311 | **236** | 379 | FreeRTOS |
| Task wake latency | cycles | **494** | 540 | 1,196 | VAIOS |
| Semaphore round-trip (2-task) | cycles | **1,284** | 2,829 | 4,446 | VAIOS |
| Mutex lock + unlock | cycles | 449 | 333 | **266** | Zephyr |
| Allocate 512 B | cycles | **241** | 271 | 369 | VAIOS |
| Allocate on a fragmented heap | cycles | **259** | 1,122 | 459 | VAIOS |
| Allocator throughput | ops/sec | **324k** | 265k | 207k | VAIOS |
| IMU → fusion → PID pipeline | cycles | 1,422 | **1,148** | 2,090 | FreeRTOS |
| Flash image size | KB | 56.5 | **24.7** | 41.1 | FreeRTOS |

## Reading the scoreboard

No single system wins everything, and the pattern in the table is more interesting than any one row.

**Where VAIOS leads — memory and IPC throughput.** Our dynamic memory allocator is the strongest result in the suite. It is faster than both rivals on plain allocations, and the gap widens dramatically once the heap is fragmented: VAIOS stays near 260 cycles while FreeRTOS climbs past 1,100. For a flight controller juggling telemetry buffers and transient state over a long flight, that consistency matters. VAIOS also moves data between tasks faster — its semaphore round-trip is more than twice as quick as FreeRTOS and over three times quicker than Zephyr — and it wakes a sleeping task sooner, which is the cycle that turns a fresh sensor reading into a control response.

**Where FreeRTOS leads — raw context switches and footprint.** FreeRTOS has had two decades of tuning on exactly this hardware, and it shows. Its bare context switch is the fastest of the three, and its compiled image is less than half the size of ours. That smaller footprint also flows into its end-to-end IMU-to-PID pipeline result.

**Where Zephyr leads — lock primitives.** Zephyr's mutex lock-and-unlock path is the leanest, a credit to its mature kernel.

We are not going to dress this up as a clean sweep. It isn't one. VAIOS is genuinely excellent at memory management and inter-task communication, competitive on wake latency, and behind on bare context-switch cost and code size. That is a precise, useful picture — and a precise picture is worth far more to us than a flattering one.

## What this means for a flight controller

A drone's control loop runs at 1 kHz: every millisecond, the system must read its sensors, fuse them into an attitude estimate, run the PID controllers, and update the motors. In our test all three operating systems hold that 1 kHz cadence at the median without breaking a sweat — the kernels are not the bottleneck for a basic loop.

The differences show up under pressure: when interrupts, memory churn, and competing tasks all land at once. That is where VAIOS's fast, fragmentation-resistant allocator and quick task wake-ups are real advantages, and where FreeRTOS's lean context switch keeps it strong. The honest summary is that VAIOS is already a viable flight-control kernel — not a prototype — with clear, named areas still to sharpen.

## Where we're still not satisfied

A benchmark you can trust has to be honest about its own limits, so here is what this run does **not** yet prove:

- **Priority inheritance is our weak spot.** VAIOS correctly handles the basic priority-inversion case, but its path for it is slower than both rivals. We have not yet added the harder test — inheritance across a chain of three nested locks — and that is exactly where we expect to find the next bug. We would rather tell you the test is missing than quietly leave it out.
- **The tails need more samples.** Our current sample counts are solid for medians but thin for the rare 1-in-1000 worst case. Raising the iteration counts is in progress.
- **The interrupt-to-task path is still a proxy.** True sensor latency starts at a hardware interrupt. We measure a close stand-in today; wiring in a real hardware-timer interrupt is the next addition.
- **Footprint is the whole image, not the kernel alone.** The flash figure includes our hardware abstraction layer and board setup. A kernel-only measurement will be a fairer comparison and is on the list.
- **Endurance.** A 24-hour soak run, checking for memory leaks and missed deadlines, comes before we call any of this final.

We are also going to publish the benchmark harness itself, so that anyone — including the FreeRTOS and Zephyr communities — can rerun these tests and check our work.

## Closing

It would have been easy to write a post that only showed the rows VAIOS wins. We chose not to, because the goal was never to win a blog post. It was to find out, truthfully, where an indigenous RTOS stands against the best in the world — and then to fix what the numbers expose.

By that measure the result is encouraging: a kernel built from scratch is already leading two industry-standard systems on memory and inter-task communication, holding its own on latency, and carrying a short, specific list of things to improve. We know exactly what to do next. That is the most useful thing a benchmark can give you.

We will report back when the next round of numbers is in.
