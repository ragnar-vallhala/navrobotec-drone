"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { TikzDiagram } from "@/lib/docs-engine";

interface TikZRendererProps {
    diagram: TikzDiagram;
}

export const TikZRenderer: React.FC<TikZRendererProps> = ({ diagram }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [resolved, setResolved] = React.useState<{ nodes: any[], SCALE: number } | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // 0. Preparation & Measurement
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        const SCALE = 60;

        const nodes = diagram.nodes.map(n => {
            const isMcu = n.style.includes("mcu") || n.id === "soc";
            let width = (n.width || 1.8) * SCALE;
            let height = (n.height || 0.8) * SCALE;

            if (tempCtx) {
                tempCtx.font = `600 ${isMcu ? '14' : '12'}px sans-serif`;
                const lines = n.label.split("\n");
                const metrics = lines.map(line => tempCtx.measureText(line));
                const maxW = Math.max(...metrics.map(m => m.width));
                width = Math.max(width, maxW + 30); // 15px padding each side
                height = Math.max(height, lines.length * 18 + 20);
            }

            return {
                ...n,
                pxWidth: width,
                pxHeight: height,
                x: n.x || 0,
                y: n.y || 0
            };
        });

        const nodeMap = new Map(nodes.map((n) => [n.id, n]));

        // 1. Initial Position Assignment
        for (let pass = 0; pass < 3; pass++) {
            nodes.forEach((node) => {
                const nodeW = node.pxWidth / SCALE;
                const nodeH = node.pxHeight / SCALE;

                if (node.anchorNode) {
                    const target = nodeMap.get(node.anchorNode);
                    if (target) {
                        const tW = target.pxWidth / SCALE;
                        const tH = target.pxHeight / SCALE;
                        let dx = 0, dy = 0;
                        const ap = node.anchorPoint || 'center';
                        if (ap.includes('north')) dy = -tH / 2;
                        if (ap.includes('south')) dy = tH / 2;
                        if (ap.includes('west')) dx = -tW / 2;
                        if (ap.includes('east')) dx = tW / 2;
                        node.x = target.x + dx;
                        node.y = target.y + dy;
                    }
                }

                // 2. Relative positioning [right=of...]
                const relMatch = node.style.toLowerCase().match(/(?:(above|below)\s*)?(?:(left|right)\s*)?=\s*(?:([\d.-]+)cm)?(?:\s*and\s*([\d.-]+)cm)?\s*of\s*([^,\]\s]+)/);
                if (relMatch) {
                    const [_, dirV, dirH, d1, d2, targetId] = relMatch;
                    const target = nodeMap.get(targetId?.trim());
                    const defDistY = diagram.globalOptions?.nodeDistanceY || 0.8;
                    const defDistX = diagram.globalOptions?.nodeDistanceX || 1.4;

                    if (target) {
                        const tW = target.pxWidth / SCALE;
                        const tH = target.pxHeight / SCALE;

                        node.x = target.x;
                        node.y = target.y;

                        if (dirV === 'above') node.y = target.y - (tH / 2 + nodeH / 2 + (d1 ? parseFloat(d1) : defDistY));
                        if (dirV === 'below') node.y = target.y + (tH / 2 + nodeH / 2 + (d1 ? parseFloat(d1) : defDistY));

                        if (dirH === 'left') node.x = target.x - (tW / 2 + nodeW / 2 + (d2 ? parseFloat(d2) : (dirV ? 0 : (d1 ? parseFloat(d1) : defDistX))));
                        if (dirH === 'right') node.x = target.x + (tW / 2 + nodeW / 2 + (d2 ? parseFloat(d2) : (dirV ? 0 : (d1 ? parseFloat(d1) : defDistX))));

                        // Special case: "below left=0.4cm and -1.5cm of main_bus"
                        if (dirV && dirH && d1 && d2) {
                            node.y = target.y + (dirV === 'above' ? -parseFloat(d1) : parseFloat(d1)) + (dirV === 'above' ? -nodeH / 2 - tH / 2 : nodeH / 2 + tH / 2);
                            node.x = target.x + (dirH === 'left' ? -parseFloat(d2) : parseFloat(d2)) + (dirH === 'left' ? -nodeW / 2 - tW / 2 : nodeW / 2 + tW / 2);
                        }
                    }
                }
                if (node.xshift) node.x += node.xshift;
                if (node.yshift) node.y -= node.yshift;
            });
        }

        // 2. Collision Resolution
        let pixelNodes = nodes.map(n => ({
            ...n,
            pxX: n.x * SCALE,
            pxY: n.y * SCALE
        }));

        const nodeRefMap = new Map(pixelNodes.map(n => [n.id, n]));

        const isDescendant = (child: any, ancestorId: string): boolean => {
            let current = child;
            while (current && (current.anchorNode || current.layoutParent)) {
                const parentId = current.anchorNode || current.layoutParent;
                if (parentId === ancestorId) return true;
                current = nodeRefMap.get(parentId);
            }
            return false;
        };

        const hasShiftInPath = (child: any, ancestorId: string): boolean => {
            let current = child;
            if (current.xshift || current.yshift) return true;
            while (current && (current.anchorNode || current.layoutParent)) {
                const parentId = current.anchorNode || current.layoutParent;
                const parent = nodeRefMap.get(parentId);
                if (parent && (parent.xshift || parent.yshift)) return true;
                if (parentId === ancestorId) break;
                current = parent;
            }
            return false;
        };

        for (let i = 0; i < 20; i++) {
            let changed = false;
            for (let j = 0; j < pixelNodes.length; j++) {
                for (let k = j + 1; k < pixelNodes.length; k++) {
                    const n1 = pixelNodes[j];
                    const n2 = pixelNodes[k];

                    // Layout Tree Rule: If related and any shift exists in the branch, skip collision
                    const n1DescOfn2 = isDescendant(n1, n2.id);
                    const n2DescOfn1 = isDescendant(n2, n1.id);

                    if (n1DescOfn2 || n2DescOfn1) {
                        const desc = n1DescOfn2 ? n1 : n2;
                        const ancId = n1DescOfn2 ? n2.id : n1.id;
                        if (hasShiftInPath(desc, ancId)) continue;

                        // Also skip if the ancestor itself is a container (implied by large size)
                        const anc = nodeRefMap.get(ancId);
                        if (anc && ((anc.width || 0) > 5 || (anc.height || 0) > 5)) continue;
                    }

                    const b1 = { x1: n1.pxX - n1.pxWidth / 2 - 5, y1: n1.pxY - n1.pxHeight / 2 - 5, x2: n1.pxX + n1.pxWidth / 2 + 5, y2: n1.pxY + n1.pxHeight / 2 + 5 };
                    const b2 = { x1: n2.pxX - n2.pxWidth / 2 - 5, y1: n2.pxY - n2.pxHeight / 2 - 5, x2: n2.pxX + n2.pxWidth / 2 + 5, y2: n2.pxY + n2.pxHeight / 2 + 5 };

                    const overlapX = Math.min(b1.x2, b2.x2) - Math.max(b1.x1, b2.x1);
                    const overlapY = Math.min(b1.y2, b2.y2) - Math.max(b1.y1, b2.y1);

                    if (overlapX > 0 && overlapY > 0) {
                        changed = true;
                        if (overlapX < overlapY) {
                            const push = overlapX / 2;
                            if (n1.pxX < n2.pxX) { n1.pxX -= push; n2.pxX += push; }
                            else { n1.pxX += push; n2.pxX -= push; }
                        } else {
                            const push = overlapY / 2;
                            if (n1.pxY < n2.pxY) { n1.pxY -= push; n2.pxY += push; }
                            else { n1.pxY += push; n2.pxY -= push; }
                        }
                    }
                }
            }
            if (!changed) break;
        }

        setResolved({ nodes: pixelNodes, SCALE });
    }, [diagram]);

    useEffect(() => {
        if (!resolved) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { nodes, SCALE } = resolved;

        // Bounds calculation for viewport
        const b = nodes.reduce((acc, n) => ({
            minX: Math.min(acc.minX, n.pxX - n.pxWidth / 2),
            maxX: Math.max(acc.maxX, n.pxX + n.pxWidth / 2),
            minY: Math.min(acc.minY, n.pxY - n.pxHeight / 2),
            maxY: Math.max(acc.maxY, n.pxY + n.pxHeight / 2)
        }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

        const padding = 40;
        const width = (b.maxX - b.minX) + padding * 2;
        const height = (b.maxY - b.minY) + padding * 2;

        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);

        // Translation to center everything
        const offsetX = -b.minX + padding;
        const offsetY = -b.minY + padding;

        // Color Resolver
        const resolveColor = (spec: string | undefined, defaultColor: string, defaultAlpha: number = 1) => {
            if (!spec) return defaultColor;
            const [name, alphaStr] = spec.split('!');
            const alpha = alphaStr ? parseFloat(alphaStr) / 100 : defaultAlpha;

            const colors: Record<string, string> = {
                'primary': `rgba(192, 38, 211, ${alpha})`,
                'secondary': `rgba(59, 130, 246, ${alpha})`,
                'white': `rgba(255, 255, 255, ${alpha})`,
                'black': `rgba(0, 0, 0, ${alpha})`,
                'gray': `rgba(156, 163, 175, ${alpha})`
            };
            return colors[name.trim()] || defaultColor;
        };

        // 1. Draw Node Backgrounds & Borders
        nodes.forEach(node => {
            const w = node.pxWidth;
            const h = node.pxHeight;
            const x = (node.pxX + offsetX) - w / 2;
            const y = (node.pxY + offsetY) - h / 2;

            const isDashed = node.style.includes("dashed");
            if (isDashed) ctx.setLineDash([6, 4]);
            else ctx.setLineDash([]);

            ctx.beginPath();
            if (node.style.includes("rounded corners")) {
                const radius = 12;
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + w - radius, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
                ctx.lineTo(x + w, y + h - radius);
                ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
                ctx.lineTo(x + radius, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
            } else {
                ctx.rect(x, y, w, h);
            }

            const isSoc = node.id === "soc";
            const isMcu = node.style.includes("mcu") || isSoc;
            ctx.fillStyle = resolveColor(node.fill, isMcu ? "rgba(192, 38, 211, 0.05)" : "#fff");
            ctx.fill();

            ctx.shadowColor = "rgba(0,0,0,0.03)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 4;
            ctx.strokeStyle = resolveColor(node.color, isMcu ? "rgba(192, 38, 211, 0.3)" : "rgba(0,0,0,0.1)", 0.3);
            ctx.lineWidth = isMcu ? 1.5 : 2;
            ctx.stroke();

            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            ctx.setLineDash([]);

            // Text
            ctx.fillStyle = isMcu ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.85)";
            ctx.font = isMcu ? "bold 15px Inter" : "11px Inter";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let lx = x + w / 2;
            let ly = y + h / 2;

            if (node.labelAnchor) {
                const a = node.labelAnchor.toLowerCase().trim();
                if (a === "above") { ly = y; ctx.textBaseline = "bottom"; }
                else if (a === "below") { ly = y + h; ctx.textBaseline = "top"; }
                else if (a === "west" || a === "left") { lx = x; ctx.textAlign = "right"; }
                else if (a === "east" || a === "right") { lx = x + w; ctx.textAlign = "left"; }
            }

            if (node.labelXShift) lx += node.labelXShift * SCALE;
            if (node.labelYShift) ly -= node.labelYShift * SCALE; // TikZ y-up

            if (isSoc) {
                // Main Header
                ctx.fillText(node.label || "Microcontroller Unit", lx, ly);
                // Legend at bottom
                ctx.font = "14px Inter";
                ctx.textBaseline = "top";
                ctx.fillText("VCC / GND (System Power)", x + w / 2, y + h + 25);
            } else if (node.label && node.label.trim().length > 0) {
                const lines = node.label.split("\n");
                const lineHeight = 13;
                lines.forEach((line: string, i: number) => {
                    ctx.fillText(line, lx, ly + (i - (lines.length - 1) / 2) * lineHeight);
                });
            }
        });

        // 2. Draw Lines & Arrows
        console.group("TikZ Drawing Pass");
        console.log("Debug Info:", diagram.debug);
        console.log("Raw TikZ snippet:", diagram.raw);
        console.log("Nodes available:", nodes.map(n => n.id));

        diagram.draws.forEach((draw, idx) => {
            const getPoint = (nodeId: string, anchor: string | undefined, shiftStr?: string, perpNodeId?: string, perpAnchor?: string, perpType?: string): any => {
                // Handle Relative Point ++(x,y)
                if (nodeId.startsWith("+")) {
                    const xy = nodeId.match(/\(([^)]+)\)/)?.[1];
                    if (xy) {
                        const [dx, dy] = xy.split(",").map(v => {
                            const val = parseFloat(v);
                            return isNaN(val) ? 0 : val * SCALE;
                        });
                        return { x: dx, y: dy, isRel: true };
                    }
                }

                const node = nodes.find(n => n.id === nodeId.trim());
                if (!node) return null;

                let x = node.pxX + offsetX;
                let y = node.pxY + offsetY;
                if (anchor) {
                    const a = anchor.toLowerCase().trim();
                    if (a === "north") y -= node.pxHeight / 2;
                    if (a === "south") y += node.pxHeight / 2;
                    if (a === "west") x -= node.pxWidth / 2;
                    if (a === "east") x += node.pxWidth / 2;
                }

                // Handle shift in draw.label (e.g. shift={(x,y)})
                if (shiftStr) {
                    const sMatch = shiftStr.match(/shift=\{?\(([^)]+)\)\}?/);
                    if (sMatch) {
                        const [sx, sy] = sMatch[1].split(",").map(v => {
                            const val = parseFloat(v);
                            return isNaN(val) ? 0 : val * SCALE;
                        });
                        x += sx;
                        y -= sy; // TikZ y-up
                    }
                }

                let p1 = { x, y, isRel: false };
                if (!perpNodeId) return p1;

                // Intersection Logic
                const p2 = getPoint(perpNodeId, perpAnchor, undefined);
                if (!p2) return p1;

                if (perpType === "|-") return { x: p1.x, y: p2.y, isRel: false };
                if (perpType === "-|") return { x: p2.x, y: p1.y, isRel: false };

                return p1;
            };

            const start = getPoint(draw.from, draw.fromAnchor, draw.fromShift, draw.fromPerpNode, draw.fromPerpAnchor, draw.fromPerpType);
            const target = getPoint(draw.to, draw.toAnchor, draw.toShift, draw.toPerpNode, draw.toPerpAnchor, draw.toPerpType);

            if (!start || !target) {
                console.warn(`Draw ${idx} skipped: missing points. start=${!!start}, end=${!!target} (from: ${draw.from}, to: ${draw.to})`);
                return;
            }

            // Resolve end if it's relative
            const end = { ...target };
            if (end.isRel) {
                end.x = start.x + end.x;
                end.y = start.y - end.y; // TikZ y-up
            }

            console.log(`Draw ${idx}:`, { from: draw.from, to: draw.to, start, end, isPerp: draw.isPerpendicular, isPerpH: draw.isPerpendicularH });

            const isBus = draw.style.toLowerCase().includes("bus") || draw.style.includes("line width");
            const hasStartArrow = (draw.style.includes("<-") || draw.style.includes("<->")) && (draw.isFirst !== false);
            const hasEndArrow = (draw.style.includes("->") || draw.style.includes("<->") || isBus) && (draw.isLast !== false);

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);

            if (draw.isPerpendicular) {
                // (A |- B) -> Vertical first to y of B, then Horizontal to x of B
                ctx.lineTo(start.x, end.y);
            } else if (draw.isPerpendicularH) {
                // (A -| B) -> Horizontal first to x of B, then Vertical to y of B
                ctx.lineTo(end.x, start.y);
            }
            ctx.lineTo(end.x, end.y);

            const edgeColor = draw.style.match(/color=([\w!]+)/)?.[1];
            ctx.strokeStyle = resolveColor(edgeColor, isBus ? "rgba(59, 130, 246, 0.9)" : "rgba(0,0,0,0.8)", 0.8);
            ctx.lineWidth = isBus ? 4 : 2;
            if (draw.style.includes("dashed")) ctx.setLineDash([4, 4]);
            else ctx.setLineDash([]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Calculate angle based on LAST SEGMENT
            let lastX = start.x;
            let lastY = start.y;
            if (draw.isPerpendicular) lastY = end.y;
            else if (draw.isPerpendicularH) lastX = end.x;

            const angle = Math.atan2(end.y - lastY, end.x - lastX);
            if (!isNaN(angle)) {
                const drawArrow = (tx: number, ty: number, ang: number) => {
                    ctx.beginPath();
                    ctx.moveTo(tx, ty);
                    ctx.lineTo(tx - 10 * Math.cos(ang - Math.PI / 8), ty - 10 * Math.sin(ang - Math.PI / 8));
                    ctx.lineTo(tx - 10 * Math.cos(ang + Math.PI / 8), ty - 10 * Math.sin(ang + Math.PI / 8));
                    ctx.closePath();
                    // Solid Fill
                    let col = ctx.strokeStyle.toString();
                    if (col.startsWith("rgba")) ctx.fillStyle = col.replace(/0\.\d+\)/, "1)");
                    else ctx.fillStyle = col;
                    ctx.fill();
                };
                if (hasEndArrow) drawArrow(end.x, end.y, angle);
                if (hasStartArrow) drawArrow(start.x, start.y, angle + Math.PI);
            }
        });
        console.groupEnd();

        // 3. Draw Labels & Text
        nodes.forEach(node => {
            const h = node.pxHeight;
            const w = node.pxWidth;

            // Container Labels
            const labelMatch = node.style.match(/label=\{?(\[shift=\{([^}]+)\}\])?(\w+):([\s\S]+?)\}?($|,)/) ||
                node.style.match(/label=\{?([\s\S]+?)\}?($|,)/);

            if (labelMatch) {
                const shift = labelMatch[2];
                const pos = labelMatch[3] !== undefined ? labelMatch[3] : "above";
                const text = labelMatch[4] !== undefined ? labelMatch[4] : labelMatch[1];
                if (text && !text.includes("=")) {
                    ctx.fillStyle = "#334155";
                    ctx.font = "bold 13px var(--font-poppins), sans-serif";
                    ctx.textAlign = "center";
                    let lx = node.pxX + offsetX, ly = node.pxY + offsetY - h / 2 - 15;
                    if (pos === "below") ly = node.pxY + offsetY + h / 2 + 15;
                    if (pos === "left") { lx = node.pxX + offsetX - w / 2 - 20; ly = node.pxY + offsetY; }
                    if (pos === "right") { lx = node.pxX + offsetX + w / 2 + 20; ly = node.pxY + offsetY; }
                    if (shift) {
                        const [sx, sy] = shift.replace(/[()]/g, "").split(",").map((v: string) => parseFloat(v) * 28.34 || 0);
                        lx += sx; ly += sy;
                    }
                    const cleanText = text.replace(/\\textbf\{([^}]+)\}/, "$1").replace(/[{}]/g, "").trim();
                    ctx.fillText(cleanText, lx, ly);
                }
            }

            // Main Text
            const isMcu = node.style.includes("mcu") || node.id === "soc";
            const isBold = node.style.includes("bfseries");
            const isSmall = node.style.includes("small");
            ctx.fillStyle = resolveColor(node.color, isMcu ? "#c026d3" : "#334155");
            ctx.font = `${isBold ? 'bold' : '600'} ${isSmall ? '12px' : '14px'} var(--font-poppins), sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const lines = node.label.split("\n");
            lines.forEach((line: string, i: number) => {
                ctx.fillText(line, node.pxX + offsetX, node.pxY + offsetY + (i - (lines.length - 1) / 2) * 18);
            });
        });

    }, [resolved, diagram]);

    return (
        <div
            className="tikz-canvas-container"
            style={{
                margin: "3rem 0",
                padding: "2rem",
                background: "rgba(0,0,0,0.01)",
                borderRadius: "24px",
                border: "1px solid rgba(0,0,0,0.05)",
                overflow: "auto",
                display: "flex",
                justifyContent: "center"
            }}
        >
            <canvas
                ref={canvasRef}
                style={{ maxWidth: "100%", height: "auto" }}
                data-draw-count={diagram.draws.length}
                data-node-count={diagram.nodes.length}
            />
        </div>
    );
};
