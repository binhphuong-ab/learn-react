import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductBySlug, getAllSlugs } from "@/lib/data";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const specs = Object.entries(product.specs || {});

  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/products" className="text-muted-foreground hover:text-blue-600 transition-colors">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container section-padding">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-50 to-white shadow-sm">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className={`aspect-square overflow-hidden rounded-xl border-2 cursor-pointer transition-all ${i === 0 ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-blue-300'}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Badge & Title */}
            <div>
              <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
                {product.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
            </div>

            {/* Price */}
            {product.price && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">(VAT included)</span>
              </div>
            )}

            {/* Summary */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-gray-700 leading-relaxed">{product.summary}</p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                Description
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {product.description.split("\n").map((p, i) => (
                  <p key={i} className="mb-2">{p}</p>
                ))}
              </div>
            </div>

            {/* Specifications */}
            {specs.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                  Specifications
                </h2>
                <dl className="divide-y rounded-xl border overflow-hidden">
                  {specs.map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <dt className="font-medium text-gray-700">{key}</dt>
                      <dd className="text-gray-600">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Link href="/contact">
                  <span className="mr-2">📞</span>
                  Contact for Quote
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href="/products">
                  ← Browse More Products
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-green-500">✓</span>
                Quality Guaranteed
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-green-500">✓</span>
                Technical Support
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-green-500">✓</span>
                Fast Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
