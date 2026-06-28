"use client";

import { useEffect } from 'react';

/**
 * Renders any `<pre class="mermaid">` blocks emitted by the markdown pipeline
 * (see app/blogs/[slug]/page.tsx) into SVG on the client. Mermaid is a large,
 * browser-only library, so it is dynamically imported here and only loaded on
 * blog pages that actually contain diagrams. Themed to the site palette so the
 * diagrams read as part of the article rather than a default mermaid drop-in.
 *
 * Idempotent by design: already-rendered blocks carry data-processed and are
 * skipped, so React StrictMode's double-invoke (or a re-render) can't lose or
 * duplicate diagrams.
 */
export default function Mermaid({ container }: { container: string }) {
    useEffect(() => {
        let cancelled = false;

        (async () => {
            const root = document.querySelector<HTMLElement>(container);
            if (!root) return;
            const blocks = Array.from(
                root.querySelectorAll<HTMLElement>('pre.mermaid'),
            ).filter((el) => el.getAttribute('data-processed') !== 'true');
            if (blocks.length === 0) return;

            const mermaid = (await import('mermaid')).default;
            if (cancelled) return;

            mermaid.initialize({
                startOnLoad: false,
                securityLevel: 'loose',
                // A concrete font stack (not a CSS var) so mermaid's label-width
                // measurement matches what it actually draws — otherwise node
                // boxes are sized wrong and the text clips.
                fontFamily: 'Arial, Helvetica, system-ui, sans-serif',
                // SVG <text> labels (not foreignObject HTML): they measure and
                // scale reliably when the diagram is fit to the container, so
                // wide flowcharts don't clip their node text. <br/> still breaks
                // lines. htmlLabels must be set both top-level and per-diagram.
                htmlLabels: false,
                flowchart: { htmlLabels: false, useMaxWidth: true },
                theme: 'base',
                themeVariables: {
                    background: '#f9f9f9',
                    primaryColor: '#ffffff',
                    secondaryColor: '#f9f9f9',
                    tertiaryColor: '#f9f9f9',
                    primaryBorderColor: 'rgba(0,0,0,0.15)',
                    lineColor: '#e94560',
                    primaryTextColor: '#1a1a2e',
                    secondaryTextColor: '#1a1a2e',
                    textColor: '#1a1a2e',
                    titleColor: '#1a1a2e',
                },
            });

            for (let i = 0; i < blocks.length; i++) {
                const el = blocks[i];
                if (el.getAttribute('data-processed') === 'true') continue;
                const source = el.textContent ?? '';
                try {
                    const { svg } = await mermaid.render(`mermaid-svg-${i}`, source);
                    if (cancelled) return;
                    el.innerHTML = svg;
                    el.setAttribute('data-processed', 'true');
                } catch (err) {
                    // Leave the raw source visible and log so a bad diagram is debuggable.
                    console.error('[mermaid] failed to render diagram', i, err);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [container]);

    return null;
}
