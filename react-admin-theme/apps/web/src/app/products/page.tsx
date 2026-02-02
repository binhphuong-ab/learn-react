import { getProducts, getCategories } from "@/lib/data";
import { ProductsGrid } from "@/components/ProductsGrid";

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="gradient-bg py-16 md:py-20">
        <div className="container text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-slide-up">
            Our Products
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Browse our complete range of industrial vacuum pumps and equipment
          </p>
        </div>
      </section>

      <div className="container section-padding">
        <ProductsGrid products={products} categories={categories} />
      </div>
    </div>
  );
}
