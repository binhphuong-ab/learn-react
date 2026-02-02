import type { Product } from "@repo/shared";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "../../data/products.json");

export async function getProducts(): Promise<Product[]> {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getAllSlugs(): Promise<string[]> {
  const products = await getProducts();
  return products.map((p) => p.slug);
}

export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  const categories = [...new Set(products.map((p) => p.category))];
  return categories.sort();
}
