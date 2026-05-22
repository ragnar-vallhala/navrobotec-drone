---
slug: project-walkthrough
title: Project Walkthrough
order: 1
kicker: Tutorial 01
summary: Bootstrap, build, flash, and observe your first NavHAL project on an STM32 Nucleo-F401RE board — start to finish.
readingTime: 15 min
---

This walkthrough takes you from an empty directory to a blinking LED and a
live serial log on a real STM32 Nucleo-F401RE board. We use the
[`nav`](https://github.com/ragnar-vallhala/nav) CLI to scaffold the
project — it pulls NavHAL in as a dependency, generates a
cross-compile-ready CMake build, and gives you a starter `main.c` that's
already calling the HAL.

If you don't have the board, the file layout, build flow, and code are
identical for any Cortex-M4 STM32 target — just change the `board` line in
`nav.toml` and the `CONFIG_BOARD_*` flags in `.config`.

## Prerequisites

You need a Linux host (the auto-installer in `nav update` currently only
targets Debian-family distros) and an STM32 Nucleo-F401RE plugged in over
USB. The toolchain itself is:

- `cmake` ≥ 3.20
- `git`
- `arm-none-eabi-gcc` (the cross-compiler)
- `stlink-tools` (provides `st-flash`)
- `python3`

You don't have to install these by hand — `nav check` will tell you
what's missing and `nav update` will pull the rest in via `apt`. We'll
get to that in a moment.

## Step 1 — Install the nav CLI

Grab the latest `.deb` from the
[nav releases page](https://github.com/ragnar-vallhala/nav/releases) and
install it:

```bash
sudo dpkg -i nav-X.X.X-Linux.deb
```

Or build from source:

```bash
git clone https://github.com/ragnar-vallhala/nav.git
cd nav
mkdir build && cd build
cmake .. && make -j$(nproc)
sudo cp nav /usr/local/bin/
```

Sanity-check the install:

```bash
nav --help
```

You should see the eleven supported verbs: `create`, `build`, `upload`,
`monitor`, `clean`, `check`, `update`, `add`, `search`, `login`, `publish`.

## Step 2 — Audit the host with `nav check`

Before scaffolding anything, ask `nav` what your host is missing:

```bash
nav check
```

Output looks something like this:

```
✔ Build Orchestrator -> Detected.
✔ VCS Driver -> Detected.
✔ Host Pkg Manager (APT) -> Detected.
```

Items marked `CRITICAL` will block the build; optional items only block
specific commands (e.g. `st-flash` is optional until you actually try to
`upload`). If anything's missing, run:

```bash
nav update
```

`nav update` walks the missing list and runs
`sudo apt install -y …` for each tool it knows how to map (`cmake`,
`git`, `gcc-arm-none-eabi`, `stlink-tools`, `python3`). On non-Debian
hosts it bows out gracefully — you'll need to install manually.

## Step 3 — Scaffold the project with `nav create`

Pick a name and let `nav` do the rest:

```bash
nav create my-first-flight
cd my-first-flight
```

What just happened:

1. A folder tree was created — `extern/`, `include/`, `src/`, `lib/`,
   `tests/`.
2. Three configuration files dropped in at the root:
   - `nav.toml` — the project descriptor (`name`, `version`, `target`,
     `build`).
   - `.config` — Kconfig-style flags consumed by NavHAL itself
     (which drivers to compile in, which board, which toolchain).
   - `CMakeLists.txt` — the cross-compile root build, wired to use
     `arm-none-eabi-` and include `extern/NavHAL` as a subdirectory.
3. A starter `src/main.c` was written.
4. NavHAL was cloned into `extern/NavHAL` from
   `github.com/ragnar-vallhala/NavHAL` (branch `stable`, depth 1). The
   `samples/` folder is purged immediately to keep the workspace tidy.

Open `nav.toml` — it's three short tables:

```toml
[project]
name = "my-first-flight"
version = "0.1.0"

[target]
arch = "cortex-m4"
vendor = "stm32"
board = "nucleo_f401re"

[build]
backend = "cmake"
```

Most of the heavy lifting is in `.config`. The defaults turn on a sensible
set of drivers: GPIO, UART, I²C, SPI, PWM, timers, DMA, the FPU, the CRC
unit, the DWT cycle counter, and SDIO. The flasher is `st-flash`, and the
flash address is the STM32 default `0x08000000`.

If you want a leaner build, comment out the `CONFIG_DRV_*=y` lines for
peripherals you don't need — anything that's commented out won't be
compiled.

## Step 4 — Read the starter `main.c`

```c
#define CORTEX_M4
#include "navhal.h"

int main(void) {
    systick_init(1000);
    uart2_init(115200);

    uart2_write("System Up.\r\n");

    while (1) {
        // Main logic loop
    }

    return 0;
}
```

Three things to know:

- `#define CORTEX_M4` before the include selects the Cortex-M4 backend
  inside NavHAL. The header is otherwise architecture-agnostic.
- `systick_init(1000)` configures SysTick for a 1 ms tick (1000 Hz). Most
  HAL routines that count time — including `delay_ms` — depend on this.
- `uart2_init(115200)` sets up USART2 at 115 200 baud. On the
  Nucleo-F401RE, USART2 is wired through the ST-Link's virtual COM port,
  so it shows up on your host as `/dev/ttyACM0` over the same USB cable
  that powers the board.

## Step 5 — Build with `nav build`

```bash
nav build
```

Under the hood this is just two CMake calls:

```bash
cmake -S . -B build
cmake --build build --parallel
```

The first call configures using the toolchain file pinned by NavHAL
(`arm-none-eabi-gcc`, `-mcpu=cortex-m4 -mthumb -mfloat-abi=hard
-mfpu=fpv4-sp-d16`). The second compiles your `main.c`, links it against
NavHAL's whole-archive static lib, and drops `my-first-flight` (an ELF
binary) into `build/`.

If you ever want to start fresh:

```bash
nav clean   # rm -rf build/
```

## Step 6 — Flash with `nav upload`

Plug in the board if you haven't already, then:

```bash
nav upload
```

This runs `cmake --build build --target flash`, which objcopies the ELF
to a raw `.bin` and pipes it to `st-flash write … 0x08000000`. The board
auto-resets when the write completes.

Permission denied on `/dev/ttyACM0`? Either add yourself to the
`dialout` group (`sudo usermod -aG dialout $USER` and re-login) or
prepend `sudo`.

## Step 7 — Watch it run with `nav monitor`

```bash
nav monitor --baud 115200
```

`nav monitor` scans `/dev` for the first `ttyACM*` or `ttyUSB*` device,
opens it raw via termios, and streams to stdout. You should see:

```
System Up.
```

…and then nothing — because the `while (1)` loop is empty. Press
`Ctrl-C` to detach cleanly.

If you have more than one serial device plugged in, pin the port
explicitly:

```bash
nav monitor -p /dev/ttyACM0 -b 115200
```

Supported bauds are 9600, 19200, 38400, 57600, 115200 — anything else
silently falls back to 9600.

## Step 8 — Make the LED blink

The Nucleo-F401RE has an on-board user LED on `PA5`. Let's drive it from
the HAL. Replace `src/main.c` with:

```c
#define CORTEX_M4
#include "navhal.h"

int main(void) {
    systick_init(1000);
    uart2_init(115200);

    hal_gpio_setmode(GPIO_PA05, GPIO_OUTPUT, GPIO_PUPD_NONE);

    uart2_write("Blink loop armed.\r\n");

    while (1) {
        hal_gpio_digitalwrite(GPIO_PA05, GPIO_HIGH);
        delay_ms(250);
        hal_gpio_digitalwrite(GPIO_PA05, GPIO_LOW);
        delay_ms(250);
    }
}
```

Three HAL calls do the work:

- `hal_gpio_setmode(GPIO_PA05, GPIO_OUTPUT, GPIO_PUPD_NONE)` —
  put `PA5` in push-pull output mode with no pull resistor.
- `hal_gpio_digitalwrite(pin, level)` — drive the pin high or low.
- `delay_ms(N)` — a SysTick-backed busy-wait. This is *not* an RTOS
  delay; it blocks the CPU. For real applications you'd hand timing to
  VAIOS or a timer ISR.

Re-flash and re-attach:

```bash
nav build && nav upload
nav monitor -b 115200
```

You should see the LED blink at 2 Hz and `Blink loop armed.` appear once
on the serial output.

## What you've built

You now have a complete edit → build → flash → observe loop. Concretely:

- A NavHAL project laid out the way the rest of the stack expects.
- A working cross-compile pipeline pinned to Cortex-M4 with hard-float.
- A board-specific `.config` controlling which drivers ship in the
  binary.
- Two HAL surfaces in use — GPIO and UART — plus the SysTick timer.

## Where to go next

- Browse `extern/NavHAL/include/navhal.h` to see the full set of public
  headers (`hal_gpio`, `hal_uart`, `hal_timer`, `hal_pwm`, `hal_i2c`,
  `hal_spi`, `hal_dma`, `hal_crc`, …). Each one is a thin, architecture-
  agnostic interface backed by a Cortex-M4 implementation.
- Read the [NavHAL chapter](/docs/report/navhal) of the technical report
  for the design rationale behind the layering, the resource-management
  model, and the timing guarantees.
- The remaining tutorials in this guide *(coming soon)* will cover GPIO,
  UART RX/TX with DMA, I²C and SPI peripherals, and integration with
  the VAIOS scheduler.
