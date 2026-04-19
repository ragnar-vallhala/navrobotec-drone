"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./DocsSidebar.module.css";
import { DocSection } from "@/lib/docs-engine";

interface DocsSidebarProps {
    tree: DocSection[];
}

export default function DocsSidebar({ tree }: { tree: DocSection[] }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <button
                className={`${styles.leftToggle} ${isSidebarOpen ? styles.toggleOpen : ""}`}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle Documentation Navigation"
            >
                {isSidebarOpen ? '❮' : '❯'}
            </button>
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
                <div className={styles.sidebarContent}>
                    <h3 className={styles.sidebarTitle}>Vayu Technical Guide</h3>
                    <nav className={styles.nav}>
                        <Link
                            href="/docs"
                            className={`${styles.navLink} ${pathname === '/docs' ? styles.active : ""}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <div className={styles.dot}></div>
                            Latest Reports
                        </Link>
                        {tree.map((section) => (
                            <NavItem
                                key={section.slug}
                                section={section}
                                pathname={pathname}
                                depth={0}
                                onItemClick={() => setIsSidebarOpen(false)}
                            />
                        ))}
                    </nav>
                </div>
                {/* Backdrop for mobile */}
                {isSidebarOpen && <div className={styles.backdrop} onClick={() => setIsSidebarOpen(false)} />}
            </aside>
        </>
    );
}

function NavItem({
    section,
    pathname,
    depth,
    onItemClick
}: {
    section: DocSection;
    pathname: string;
    depth: number;
    onItemClick: () => void;
}) {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = section.subsections && section.subsections.length > 0;
    const href = `/docs/${section.slug}`;
    const isActive = pathname === href;

    return (
        <div className={styles.navItemWrapper}>
            <div className={styles.linkRow}>
                <Link
                    href={href}
                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                    style={{ paddingLeft: `${depth * 1 + 1}rem` }}
                    onClick={onItemClick}
                >
                    <div className={styles.dot}></div>
                    {section.title}
                </Link>
                {hasChildren && (
                    <button
                        className={`${styles.toggle} ${isOpen ? styles.open : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                        }}
                    >
                        ▾
                    </button>
                )}
            </div>

            {hasChildren && isOpen && (
                <div className={styles.children}>
                    {section.subsections.map((child) => (
                        <NavItem
                            key={child.slug}
                            section={child}
                            pathname={pathname}
                            depth={depth + 1}
                            onItemClick={onItemClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
