import { parseTikz } from "./lib/docs-engine";

const ComplexTikz = `
    \\node[mcu_box] (soc) {};
    \\node[block, fill=primary!15] (cpu) at ([yshift=-1.2cm]soc.north) {Processor Core};
    \\node[block, left=of cpu] (nvic) {Interrupts};
    \\node[block, right=of cpu] (dma) {DMA Controller};
    \\node[draw, thick, rectangle, minimum width=8.5cm, minimum height=0.5cm, fill=secondary!10, below=0.4cm of cpu] (main_bus) {};
`;

const diagram = parseTikz(ComplexTikz);
console.log(JSON.stringify(diagram, null, 2));
