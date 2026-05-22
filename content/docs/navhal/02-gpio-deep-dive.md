---
slug: gpio-deep-dive
title: GPIO Deep Dive
order: 2
kicker: Tutorial 02
summary: Drive pins and read buttons the right way — push-pull vs open-drain, pull-ups, slew rate, the aggregate config struct, and clean software debounce.
readingTime: 12 min
---

[Tutorial 01](/docs/navhal/project-walkthrough) got an LED blinking by
calling three GPIO functions. That's enough to start, but it skips four
configuration knobs that matter the moment you wire up real hardware:
output type, output speed, alternate functions, and the pull resistor on
inputs. This tutorial covers all five, plus the canonical API surface
you'll see in every subsequent tutorial.

You don't need extra hardware — the on-board user LED (`PA5`) and user
button (`PC13`) on the Nucleo-F401RE are all this tutorial uses.

## Two API styles

NavHAL gives you two equivalent ways to configure a pin. Pick whichever
suits the call site.

**Discrete setters** — one knob at a time. Best when you're toggling a
single property at runtime.

```c
hal_gpio_set_mode(GPIO_PA05, HAL_GPIO_MODE_OUTPUT, HAL_GPIO_PULL_NONE);
hal_gpio_set_output_type(GPIO_PA05, HAL_GPIO_OTYPE_PUSH_PULL);
hal_gpio_set_output_speed(GPIO_PA05, HAL_GPIO_SPEED_LOW);
```

**Aggregate `hal_gpio_init`** — one struct, one call. Best for the
"configure once at boot" pattern.

```c
hal_gpio_config_t led_cfg = {
    .mode         = HAL_GPIO_MODE_OUTPUT,
    .pull         = HAL_GPIO_PULL_NONE,
    .output_type  = HAL_GPIO_OTYPE_PUSH_PULL,
    .output_speed = HAL_GPIO_SPEED_LOW,
};
hal_gpio_init(GPIO_PA05, &led_cfg);
```

Both routes go through the same underlying registers; `hal_gpio_init`
just bundles the four setters. Either returns an `hal_status_t` —
`HAL_OK` on success, `HAL_ERR_INVALID_ARG` if you pass a `NULL` config.

> **A note on the old API.** You'll see `hal_gpio_setmode(...)`,
> `hal_gpio_digitalwrite(...)`, `GPIO_OUTPUT`, `GPIO_PUPD_NONE` in older
> samples and in the `nav create` starter. These are deprecated compat
> shims — they still work, but the compiler will emit
> `[-Wdeprecated-declarations]` warnings, and they'll be removed in
> milestone M5. New code should use the `HAL_GPIO_*` constants and
> `hal_gpio_set_mode` / `hal_gpio_init` shown above.

## Anatomy of a pin

Every output pin has four configurable axes:

| Axis | Why it matters |
|---|---|
| **Mode** | Input, output, alternate-function (let a peripheral drive it), or analog. |
| **Output type** | Push-pull (drives both high and low) or open-drain (only pulls low). |
| **Output speed** | Slew rate. Fast edges → cleaner signals → more EMI. |
| **Pull resistor** | Pulls a floating pin to a known level when nothing is driving it. |

The mode determines which of the others apply: pull only matters for
inputs, output type and speed only for outputs and alternate-function
outputs.

### Push-pull vs open-drain

A push-pull output drives both rails — it can source current (high) and
sink current (low). It's the default for indicators, chip-selects, and
anything where you control the bus alone.

An open-drain output can only sink current — the high state is
"released," not "driven." You wire an external pull-up resistor (or
enable the internal one) and let it pull the line high. This is what
I²C, the 1-Wire bus, and shared-interrupt lines all use, because it
lets multiple devices share a single wire without contention.

```c
// I²C-style: open-drain with the internal pull-up enabled.
hal_gpio_config_t scl_cfg = {
    .mode         = HAL_GPIO_MODE_OUTPUT,
    .pull         = HAL_GPIO_PULL_UP,
    .output_type  = HAL_GPIO_OTYPE_OPEN_DRAIN,
    .output_speed = HAL_GPIO_SPEED_MEDIUM,
};
hal_gpio_init(GPIO_PB08, &scl_cfg);
```

When you get to Tutorial 06, this is the configuration the I²C driver
applies under the hood for `SCL` and `SDA`.

### Output speed — pick the slowest one that works

Faster edges produce more high-frequency content, which means more
radiated noise, more reflection on poorly-matched traces, and more
ground bounce. The available speeds are:

- `HAL_GPIO_SPEED_LOW` — LEDs, slow logic. Default choice.
- `HAL_GPIO_SPEED_MEDIUM` — UART up to a few Mbaud.
- `HAL_GPIO_SPEED_HIGH` — SPI at tens of MHz.
- `HAL_GPIO_SPEED_VERY_HIGH` — SDIO, parallel buses.

If you're not sure, start at `LOW` and bump it up only when a
peripheral driver tells you to.

## The hot-path inlines

Setting up the pin is the slow part. Driving it during your control loop
needs to be cheap. NavHAL exposes three inline functions on Cortex-M4
that compile to a single store instruction each:

```c
hal_gpio_digitalwrite(GPIO_PA05, HAL_GPIO_HIGH);
hal_gpio_digitalwrite(GPIO_PA05, HAL_GPIO_LOW);
hal_gpio_toggle(GPIO_PA05);
```

`hal_gpio_toggle` is meaningfully faster than read-modify-write —
it uses the BSRR register, which is atomic with respect to interrupts.
Prefer it for blink loops, scope-triggers, and anything in an ISR.

## Reading the user button

`PC13` on the Nucleo-F401RE is wired to the on-board push-button with an
external pull-up — it reads `HIGH` when released, `LOW` when pressed.
The simplest correct version:

```c
#define CORTEX_M4
#include "navhal.h"

int main(void) {
    systick_init(1000);

    hal_gpio_set_mode(GPIO_PA05, HAL_GPIO_MODE_OUTPUT, HAL_GPIO_PULL_NONE);
    hal_gpio_set_mode(GPIO_PC13, HAL_GPIO_MODE_INPUT,  HAL_GPIO_PULL_UP);

    while (1) {
        if (hal_gpio_digitalread(GPIO_PC13) == HAL_GPIO_LOW) {
            hal_gpio_digitalwrite(GPIO_PA05, HAL_GPIO_HIGH);
        } else {
            hal_gpio_digitalwrite(GPIO_PA05, HAL_GPIO_LOW);
        }
    }
}
```

Build, upload, monitor — the LED follows the button. So far so good. But
real buttons are mechanical, and they bounce.

## Software debounce

Press a real switch and the contacts will make-break-make-break for
1–10 ms before settling. A naïve "did the level change?" detector will
fire several times per press. The fix is to require the new level to
hold steady for a few milliseconds before you accept it.

NavHAL gives you a millisecond tick (`hal_get_tick`) once you've called
`systick_init(1000)`, which is all the bookkeeping a debouncer needs:

```c
#define CORTEX_M4
#include "navhal.h"

#define DEBOUNCE_MS 20

static hal_gpio_state_t debounced_read(hal_gpio_pin_t pin) {
    static hal_gpio_state_t stable = HAL_GPIO_HIGH;
    static hal_gpio_state_t candidate = HAL_GPIO_HIGH;
    static uint32_t candidate_since = 0;

    hal_gpio_state_t now = hal_gpio_digitalread(pin);

    if (now != candidate) {
        candidate = now;
        candidate_since = hal_get_tick();
    } else if (now != stable && (hal_get_tick() - candidate_since) >= DEBOUNCE_MS) {
        stable = now;
    }
    return stable;
}

int main(void) {
    systick_init(1000);
    hal_gpio_set_mode(GPIO_PA05, HAL_GPIO_MODE_OUTPUT, HAL_GPIO_PULL_NONE);
    hal_gpio_set_mode(GPIO_PC13, HAL_GPIO_MODE_INPUT,  HAL_GPIO_PULL_UP);

    hal_gpio_state_t last = HAL_GPIO_HIGH;
    while (1) {
        hal_gpio_state_t now = debounced_read(GPIO_PC13);
        if (last == HAL_GPIO_HIGH && now == HAL_GPIO_LOW) {
            // Falling edge — button just pressed. Toggle the LED.
            hal_gpio_toggle(GPIO_PA05);
        }
        last = now;
    }
}
```

Each press now flips the LED exactly once. The 20 ms window is generous
for a tactile switch; tune it down to 5 ms for high-quality buttons or
up to 50 ms for cheap panel switches.

The `hal_get_tick() - candidate_since` arithmetic is unsigned, so it's
correct across the tick wrap (~49 days at 1 ms) — *don't* be tempted to
store the comparison the other way around.

## Portable pin names

Hard-coding `GPIO_PA05` works on the Nucleo-F401RE, but if you ever port
your code to another board the LED might be on `PB13` or `PC0`. NavHAL's
board layer solves this with macro aliases. Each board ships a
`board.h` with names like `LED_BUILTIN`, `BUTTON_USER`, or
Arduino-style `D5` / `D13`. Same code, two boards:

```c
hal_gpio_set_mode(LED_BUILTIN,  HAL_GPIO_MODE_OUTPUT, HAL_GPIO_PULL_NONE);
hal_gpio_set_mode(BUTTON_USER,  HAL_GPIO_MODE_INPUT,  HAL_GPIO_PULL_UP);
```

The aliases are macros, not enum entries, so the compiler still
ultimately sees `GPIO_PA05` — there's no runtime cost. Use the
board-layer names in application code; use the core enum
(`GPIO_PA05`) only when you're writing a driver that's pinned to a
specific MCU package.

## Recap

You can now:

- Configure any pin's mode, pull, output type, and slew rate using
  either the discrete setters or the aggregate `hal_gpio_init`.
- Recognise the deprecated compat shims and translate them to the
  canonical `HAL_GPIO_*` API.
- Choose between push-pull and open-drain — and predict which one a
  peripheral like I²C will need.
- Read a debounced button input using SysTick.
- Write portable code with `LED_BUILTIN` / `BUTTON_USER` instead of
  raw pin numbers.

## What we didn't cover

GPIO interrupts (EXTI) are coming in a future NavHAL milestone — for
now, edge detection means polling at a fast-enough rate. We'll revisit
this in Tutorial 08 when DMA and ISRs land in the portable API.

## Next up

[Tutorial 03 — UART & Serial Logging](/docs/navhal/uart-serial-logging)
*(coming soon)*: full-duplex serial, the three transport modes (polling
/ interrupt / DMA), and the `log_printf` helper we'll reuse for the
rest of the guide.
