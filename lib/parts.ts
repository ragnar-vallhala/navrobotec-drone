/* The parts of the stack, as documented on /docs.
 *
 * Each entry is written from the notes its part's owner made from the part's
 * own repository: nothing here is invented, and where a repository is stale
 * or silent the entry says what it lacks rather than filling the gap. Paths
 * under `read` are paths inside that part's repository, given as plain text.
 * They are not links, because not every repository is public.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "code"; lines: string[] }
  | { kind: "list"; items: string[] };

export type PartSection = { heading: string; blocks: Block[] };

export type Part = {
  slug: string;
  title: string;
  kicker: string;
  /* One or two sentences, for the hub card and the meta description. */
  summary: string;
  /* The lead paragraph on the part's own page. */
  overview: string;
  audience: string;
  version: { label: string; value: string }[];
  sections: PartSection[];
  read: string[];
  /* What the documentation does not cover yet. Shown on the page. */
  lacks: string[];
  href: string;
};

const p = (text: string): Block => ({ kind: "p", text });
const code = (...lines: string[]): Block => ({ kind: "code", lines });
const list = (...items: string[]): Block => ({ kind: "list", items });

export const PARTS: Part[] = [
  {
    slug: "navhal",
    title: "NavHAL",
    kicker: "Hardware abstraction",
    href: "/docs/navhal",
    summary:
      "The C hardware abstraction layer under the stack: one frozen hal_* API over layered arch, vendor, family and board sources.",
    overview:
      "NavHAL is NAVRobotec's C hardware abstraction layer for embedded targets. It exposes one frozen hal_* C API (HAL_API_VERSION 1) over layered arch, vendor, family and board sources, and is built with a Kconfig-driven build.",
    audience:
      "Firmware authors, and the layers above it: VaiOS, Vayu and nav applications.",
    version: [
      { label: "Version", value: "0.4.2 (release v0.4.2)" },
      { label: "HAL API", value: "HAL_API_VERSION 1" },
      { label: "License", value: "Apache-2.0" },
    ],
    sections: [
      {
        heading: "Targets",
        blocks: [
          p("The per-MCU capability pages cover these targets:"),
          list(
            "stm32f401re",
            "navixsmf401re",
            "navixdev",
            "stm32f767zi",
            "atmega328p",
            "x86_64_qemu",
          ),
          p(
            "Each release is tested on real boards: the STM32F767, the STM32F401 and the ATmega328P.",
          ),
        ],
      },
      {
        heading: "Using it",
        blocks: [
          p(
            "NavHAL is consumed as a CMake subdirectory. Add it with add_subdirectory and link the target named hal. Three things have to be in place:",
          ),
          list(
            "srctree is set.",
            "A .config is seeded from NAVHAL_DEFCONFIG.",
            "Optionally, -DNAVHAL_CONFIG_FILE=path points at your own configuration.",
          ),
          p(
            "Boards live in the tree, or out of tree with -DNAVHAL_BOARD_DIR. One Kconfig option worth knowing is NAVHAL_MEM_FUNCS.",
          ),
        ],
      },
      {
        heading: "Interface",
        blocks: [
          p(
            "include/navhal.h includes the headers under include/common/. Peripherals covered include:",
          ),
          list(
            "gpio, uart, i2c, spi, adc, pwm, timer",
            "clock, interrupt, dma, flash, crc, rtc, watchdog",
            "usb_cdc, sdio, eth, boot, console, and more",
          ),
          p(
            "The contract is written down in docs/api_standardization.md and docs/naming_conventions.md. What each MCU implements is listed in docs/capabilities/README.md.",
          ),
        ],
      },
      {
        heading: "Planned, not built",
        blocks: [
          p(
            "The roadmap under docs/roadmap/ lists two milestones that are plans only: port-as-package (M10) and HAL API v2 (M11). Neither exists yet.",
          ),
        ],
      },
    ],
    read: [
      "docs/capabilities/ (per-MCU, the current source for what is implemented)",
      "docs/consuming.md",
      "docs/boards.md",
      "docs/api_standardization.md",
      "docs/naming_conventions.md",
      "docs/testing/",
      "docs/MODULE_ABI.md",
      "docs/roadmap/",
      "Doxyfile and mainpage.md for the generated API reference",
    ],
    lacks: [
      "The repository's top-level README overview is out of date, so this page follows docs/capabilities/ instead.",
    ],
  },
  {
    slug: "vaios",
    title: "VaiOS",
    kicker: "Real-time kernel",
    href: "/docs/vaios",
    summary:
      "A small preemptive RTOS for ARM Cortex-M, for hard-real-time work such as a 1 kHz flight controller. It sits on NavHAL.",
    overview:
      "VaiOS is a small preemptive RTOS for ARM Cortex-M (ARMv7E-M), for hard-real-time work such as a 1 kHz flight controller. It sits on NavHAL, and Vayu's firmware runs on it.",
    audience: "Firmware developers.",
    version: [
      { label: "Version", value: "0.2.3 (tag v0.2.3)" },
      { label: "License", value: "Apache-2.0" },
    ],
    sections: [
      {
        heading: "Boards",
        blocks: [
          p(
            "The bench board is the NAVIXSM-F401RE (Cortex-M4). The same port builds for Cortex-M7 parts such as the Nucleo-F767ZI. The README states it is verified on the STM32F401RE. There is also a host (Linux) port, used for tests.",
          ),
        ],
      },
      {
        heading: "Features",
        blocks: [
          list(
            "8-level O(1) priority scheduler with priority inheritance",
            "BASEPRI critical sections",
            "O(1) heap allocator",
            "Semaphores, mutexes, and SPSC and MPMC queues",
            "Buffered DMA logging",
            "Optional modules: shell, vfs over FatFs and SDIO, semihosting, fifo",
            "Unprivileged tasks with MPU fault recovery",
            "Message bus, bus managers (I2C, SPI, UART, USB CDC) and a user-space shell",
          ),
        ],
      },
      {
        heading: "Installing and using",
        blocks: [
          p("As a library in a nav firmware project, either:"),
          list(
            "list vaios under [dependencies] in nav.toml with git ref v0.2.3, with options such as VAIOS_MODULE_VFS; or",
            "call add_subdirectory(vaios) after NavHAL and link the target vaios.",
          ),
          p("To build the standalone examples:"),
          code(
            "git clone --recurse-submodules <repository>",
            "cmake -DNAVHAL=ON -DEXAMPLES=ON -DVAIOS_EXAMPLE=FIFO_TEST ...",
            "# build, then flash with openocd",
          ),
        ],
      },
      {
        heading: "Interface",
        blocks: [
          p("The public headers are under include/:"),
          list(
            "vaios.h: v_init()",
            "task.h: v_task_spawn, v_task_kill, v_task_info",
            "memory.h: v_malloc, v_free, v_memalign",
            "ipc.h, structure.h, bus.h, upipe.h, stream.h, periph_bus.h, vfs.h, perf.h, shell.h",
          ),
          p(
            "Build options include NAVHAL, EXAMPLES, VAIOS_FPU, VAIOS_MODULE_*, VAIOS_KERNEL_LOG_LEVEL and MAX_PI_DEPTH.",
          ),
        ],
      },
      {
        heading: "Performance",
        blocks: [
          p(
            "Measured results are in the technical report's VaiOS performance section, and the repository's docs/changelog/README.md tells the benchmark story. This page quotes no numbers of its own.",
          ),
        ],
      },
    ],
    read: [
      "README.md",
      "docs/consumer-interface.md ('Using it')",
      "docs/user-space.md",
      "docs/plans/bus-subsystem.md",
      "docs/changelog/README.md",
    ],
    lacks: [
      "The latest development branch adds a linker fix and a NavHAL v0.4.2 pin that are not in a tagged release yet.",
      "Comparisons with other kernels are not made here. Use the repository's docs/changelog for the benchmark story.",
    ],
  },
  {
    slug: "vayu",
    title: "Vayu",
    kicker: "Flight controller",
    href: "/docs/vayu",
    summary:
      "A flight controller for a small multirotor, written from the ground up: the firmware, a simulator built from the same code, and tooling.",
    overview:
      "Vayu is a flight controller for a small multirotor, written from the ground up. The repository holds the firmware that flies the aircraft, the simulator (the same firmware compiled for a host, known as SITL) and tooling. It is also the entry point to the rest of the stack.",
    audience:
      "People building and flying the flight controller, and ground control stations that need a simulator.",
    version: [
      { label: "Latest published release", value: "v0.2.1 (2026-11-10)" },
      { label: "Pinned dependencies", value: "NavHAL v0.4.2, VaiOS v0.2.3, NavLink v2.4.0" },
      { label: "Simulator ABI", value: "Main has SITL ABI 6; no release carries it yet" },
    ],
    sections: [
      {
        heading: "What is in the repository",
        blocks: [
          list(
            "firmware/: estimation, control, mixing, failsafes and drivers, for the STM32F401RE",
            "sim/host/: SITL, which runs the real scheduler and control code against simulated physics",
            "sim/vsim/: rigid-body physics and sensor models",
            "tools/",
            "navlink/ and extern/vaios/, as submodules",
          ),
          p(
            "The repository is private, so the paths on this page are for orientation rather than links.",
          ),
        ],
      },
      {
        heading: "Simulating without a firmware build",
        blocks: [
          p(
            "No firmware build is needed to simulate. Each release ships a SITL SDK tarball, vayu-sitl-sdk-TAG-linux-x86_64.tar.gz. It contains the engine as a loadable libvayu_sitl.so, the same engine as a headless binary, and the headers. Downloading it needs authenticated access to the private repository.",
          ),
        ],
      },
      {
        heading: "Building the firmware",
        blocks: [
          p(
            "The firmware is a nav app: from the firmware directory, run nav build and nav upload, configured by firmware/nav.toml. The repository's build.md and its tools/scripts/vayu.sh helper cover building the firmware, building SITL and running tests.",
          ),
        ],
      },
      {
        heading: "Simulator interface",
        blocks: [
          p(
            "A host program talks to the simulator through sim/host/sdk/vayu_sitl_abi.h. It exports one symbol, vayu_sitl_get_api(abi_version), which returns a call table:",
          ),
          list(
            "boot, shutdown, stop_and_join (call before unloading or exiting)",
            "run_step, set_telemetry_sink",
            "get_pose, set_geometry, set_atmos",
            "uart2_rx",
          ),
          p(
            "The loader accepts a single ABI version. Companion headers are vsim_proto.h and vsim_math.h. The wire to the flight controller is NavLink over UART2.",
          ),
        ],
      },
    ],
    read: [
      "README.md",
      "ARCHITECTURE.md",
      "build.md",
      "sim/host/sdk/vayu_sitl_abi.h",
      "firmware/nav.toml",
    ],
    lacks: [
      "The project version in firmware/nav.toml is 0.1.0 and is not the release number.",
      "No public download: releases are in a private repository.",
    ],
  },
  {
    slug: "navlink",
    title: "NavLink",
    kicker: "Link protocol",
    href: "/docs/navlink",
    summary:
      "The single source of truth for the Vayu link protocol, NavLink v2: one dialect file and a generator that emits matching codecs.",
    overview:
      "NavLink is the single source of truth for the Vayu link protocol, NavLink v2. A file, dialect.json, defines every message, and generate.py emits matching codecs for firmware (C), ground control (C and C++) and tools (Python).",
    audience: "Firmware developers, ground control developers and tool authors.",
    version: [
      { label: "Version", value: "v2.4.0" },
      { label: "Dialect", value: "vayu-core, version 2, 57 messages" },
    ],
    sections: [
      {
        heading: "Using the generator",
        blocks: [
          code(
            "python3 generate.py            # C and Python, into ./generated",
            "python3 generate.py --lang c --out DIR",
          ),
          p(
            "It uses the Python standard library only. It validates the dialect and self-checks the CRC-16 of the string 123456789 against 0x6F91. For every message it generates enums, packed wire and aligned structs, pack and unpack, converters, a CRC_EXTRA table, a frame encoder, and an incremental parser with a handler table.",
          ),
          p(
            "Tests are in tests/run_tests.py. A link emulator is in sim/ (live.py).",
          ),
        ],
      },
      {
        heading: "The wire format",
        blocks: [
          p("The contract is ABI.md. In summary:"),
          list(
            "10-byte frame header: sync 0x56, version 2, len, incompat_flags, seq, sysid, compid, msgid (24-bit)",
            "CRC-16/MCRF4XX, seeded with a per-message CRC_EXTRA",
            "Maximum frame size 267 bytes",
            "faults.json is the shared table behind the FAULT_STATUS ids",
          ),
        ],
      },
    ],
    read: [
      "README.md",
      "ABI.md (the contract, and the how-to)",
      "docs/reference/navlink-v2-spec.md (normative spec)",
      "dialect.json",
      "faults.json",
      "generated/html",
    ],
    lacks: [
      "The version written inside the spec file lags the releases, so this page does not quote it.",
      "INTEGRATION.md is a historical migration plan from the old v1 frame; it is not a how-to.",
      "Ground-station side usage is covered under Navigator.",
    ],
  },
  {
    slug: "navigator",
    title: "Navigator",
    kicker: "Ground control station",
    href: "/docs/navigator",
    summary:
      "The Vayu ground control station: a Qt6 desktop application with live views, calibration, and an in-app simulator. No packaged release yet.",
    overview:
      "Navigator is the Vayu ground control station, a Qt6 desktop application. It connects over serial or network and has attitude, IMU, RC, motor, control-loop, packet and log views, calibration and settings, and an in-app simulator (SITL) with a 3D world. The same repository holds a headless Python SDK, vayu_headless, and a PID autotuner.",
    audience: "Pilots and developers tuning and testing Vayu flight controllers.",
    version: [
      { label: "Navigator", value: "1.0.0 in CMake, not tagged or released" },
      { label: "NavLink submodule", value: "v2.4.0" },
      { label: "Simulator SDK", value: "Vayu v0.2.1" },
      { label: "vayu_headless", value: "0.0.1" },
    ],
    sections: [
      {
        heading: "Installing",
        blocks: [
          p(
            "There is no packaged release yet: no tags and no download page. Navigator is built from source.",
          ),
          code(
            "git submodule update --init --recursive",
            "cmake -S navigator -B build",
            "cmake --build build -j",
          ),
          p(
            "It needs Qt6 (Core, Widgets, SerialPort, Network), assimp and libpulse. Pass -DNAVIGATOR_SITL=OFF to build without the simulator. Tests run with ctest --test-dir build; the headless SDK has its own tests, run with python3 -m pytest tests in navigator/headless-sdk.",
          ),
          p(
            "The simulator needs the Vayu SITL SDK release. Without it the station still runs and the simulator reports itself unavailable. On Windows there is a ground-station-only CI build, without the simulator. The dockable layout is experimental (Window, Dockable layout, or NAVIGATOR_DOCKING=1).",
          ),
        ],
      },
      {
        heading: "Interfaces",
        blocks: [
          p(
            "Navigator is an application and has no public API. Three things are meant for other code:",
          ),
          list(
            "The NavLink v2 wire protocol. Receiving is in navigator/src/protocol/NavlinkRouter; sending is in CommandCodec and DroneProtocol. The dialect and generator come from the navlink submodule.",
            "The simulator module interface in navigator/src/vsim/SitlModule.cpp, which loads libvayu_sitl and refuses a different ABI version.",
            "The Python headless SDK in navigator/headless-sdk/vayu_headless.",
          ),
        ],
      },
    ],
    read: [
      "README.md",
      "navigator/docs/reference/ (README, gcs-architecture, feature-matrix, requirements)",
      "navigator/CMakeLists.txt",
      "navigator/headless-sdk/README.md",
      "navigator/src/ (protocol, comm, vsim, ui, core, autotune, replay)",
      "tools/autotune/",
    ],
    lacks: [
      "No packaged release, installer or download page.",
      "No user manual and no screenshots page.",
      "Tested here with Qt 6.4.2; continuous integration uses a newer Qt.",
    ],
  },
  {
    slug: "nav",
    title: "nav",
    kicker: "Build tool",
    href: "/docs/nav",
    summary:
      "The command-line build tool for NavHAL-based Cortex-M firmware: scaffold, build, flash and monitor, with dependencies pulled from git.",
    overview:
      "nav is a command-line build tool for NavHAL-based Cortex-M firmware. It scaffolds a project, pulls NavHAL and libraries from git (there is no package registry), cross-compiles with arm-none-eabi-gcc, flashes the board and opens a serial monitor. A project is one of two types: an app (an executable) or a library (a static archive).",
    audience: "Firmware developers.",
    version: [
      { label: "Version", value: "1.3.1 (tag v1.3.1)" },
      {
        label: "Release assets",
        value: "Linux .deb and Windows exe or zip, on GitHub Releases",
      },
    ],
    sections: [
      {
        heading: "Installing",
        blocks: [
          p(
            "The README documents one install route: download the .deb from the Releases page and install it with dpkg -i, or build from source with CMake. Windows release assets exist, but the README gives no Windows install steps, so none are given here.",
          ),
        ],
      },
      {
        heading: "Quick start",
        blocks: [
          code(
            "nav create <name> --board <id>",
            "nav build",
            "nav upload",
            "nav monitor",
          ),
        ],
      },
      {
        heading: "Commands",
        blocks: [
          p(
            "create, build, config, upload, board, lib (add, remove, list, tree), check, update, regen and clean.",
          ),
          p(
            "A project is configured in nav.toml. The README documents the [build] section, build variants, flash runners, probe selection and pinning NavHAL. The contract for libraries is docs/LIBRARY_ABI.md (version 1, draft).",
          ),
        ],
      },
    ],
    read: [
      "README.md",
      "docs/LIBRARY_ABI.md",
      "data/boards.json and data/toolchain.json",
      "templates/",
    ],
    lacks: [
      "The README covers only the .deb install; there is no Windows install documentation.",
      "The library ABI is a version 1 draft.",
    ],
  },
];

export function getPart(slug: string): Part | undefined {
  return PARTS.find((part) => part.slug === slug);
}
