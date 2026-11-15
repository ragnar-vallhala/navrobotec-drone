"use client";

import { useId, useMemo, useState } from "react";
import ProductCard, { type CardData } from "./ProductCard";
import styles from "./catalogue.module.css";

type Sort = "featured" | "name-asc" | "name-desc";

/* Filter and sort bar over the grid. State is in the component, and the
   unfiltered list is what the server renders, so the first paint and
   no-JavaScript visitors see every product. */
export default function ProductGrid({
  cards,
  options,
}: {
  cards: CardData[];
  options: string[];
}) {
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const id = useId();

  const categories = useMemo(
    () => Array.from(new Set(cards.map((c) => c.category))),
    [cards],
  );
  const availabilities = useMemo(
    () => Array.from(new Set(cards.map((c) => c.availability))),
    [cards],
  );

  const shown = useMemo(() => {
    const list = cards.filter(
      (c) =>
        (!category || c.category === category) &&
        (!availability || c.availability === availability),
    );
    if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [cards, category, availability, sort]);

  const filtered = category !== "" || availability !== "";

  return (
    <>
      <div className={styles.bar} role="group" aria-label="Filter and sort products">
        <label className={styles.field} htmlFor={`${id}-cat`}>
          <span className="label">Category</span>
          <select id={`${id}-cat`} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field} htmlFor={`${id}-av`}>
          <span className="label">Availability</span>
          <select id={`${id}-av`} value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="">Any</option>
            {availabilities.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field} htmlFor={`${id}-sort`}>
          <span className="label">Sort by</span>
          <select id={`${id}-sort`} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">Featured</option>
            <option value="name-asc">Name, A to Z</option>
            <option value="name-desc">Name, Z to A</option>
          </select>
        </label>
        <p className={`data ${styles.count}`} aria-live="polite">
          {shown.length} of {cards.length} products
        </p>
        {filtered ? (
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              setCategory("");
              setAvailability("");
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {shown.length === 0 ? (
        <p className={styles.empty}>No products match those filters.</p>
      ) : (
        <ul className={styles.grid}>
          {shown.map((card) => (
            <li key={card.slug} className={styles.cell}>
              <ProductCard card={card} options={options} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
