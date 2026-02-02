"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  summary?: string;
  price?: number;
  images?: string[];
  featured?: boolean;
}

interface ProductsGridProps {
  products: Product[];
  categories: string[];
}

export function ProductsGrid({ products, categories }: ProductsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <>
      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="mb-10 p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm font-medium text-slate-600 mr-1 flex-shrink-0">Filter by Category:</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Count */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
          {selectedCategory && (
            <span className="ml-1">
              in <span className="font-semibold text-blue-600">{selectedCategory}</span>
            </span>
          )}
        </p>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link key={product._id} href={`/products/${product.slug}`}>
              <Card className="h-full card-hover group overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      Featured
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardDescription className="text-blue-600 font-medium text-xs uppercase tracking-wider">
                    {product.category}
                  </CardDescription>
                  <CardTitle className="line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground mb-3">
                    {product.summary}
                  </p>
                  {product.price && (
                    <p className="text-xl font-bold text-blue-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              {selectedCategory
                ? `No products found in "${selectedCategory}" category.`
                : "Products will appear here once added via the admin panel."}
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:underline font-medium"
              >
                View all products
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
