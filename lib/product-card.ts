import type { CardData } from "@/components/catalogue/ProductCard";
import { kindOf } from "./product-media";
import {
  availabilityOf,
  cardShot,
  categoryOf,
  oneLine,
  waitlistFor,
} from "./product-view";
import { INTEREST_BY_SLUG, type Product } from "./products";

/* The plain data a card draws from; everything is read from the product. */
export function cardOf(product: Product): CardData {
  return {
    slug: product.slug,
    name: product.name,
    category: categoryOf(product),
    availability: availabilityOf(product),
    summary: oneLine(product),
    shot: cardShot(product.slug),
    kind: kindOf(product.slug),
    interest: INTEREST_BY_SLUG[product.slug],
    waitlist: waitlistFor(product.slug),
  };
}
