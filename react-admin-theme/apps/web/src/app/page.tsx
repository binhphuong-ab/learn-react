import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/lib/data";

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.filter(p => p.featured).slice(0, 6);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section with Animated Gradient */}
      <section className="relative min-h-[90vh] flex items-center gradient-bg-animated overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl blob float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-blue-900/30"></div>

        {/* Floating Elements */}
        <div className="absolute top-32 right-20 w-20 h-20 border-2 border-white/20 rounded-xl rotate-12 float animate-spin-slow"></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 bg-white/10 rounded-full float-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-cyan-400/40 rounded-lg float rotate-45"></div>

        <div className="container relative z-10 flex flex-col items-center justify-center gap-8 py-24 md:py-32 text-center text-white">
          {/* Badge with Shimmer */}
          <div className="shimmer inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm backdrop-blur-sm animate-fade-in-down">
            <span className="mr-2 animate-bounce">🏭</span>
            Industrial Grade Equipment
          </div>

          {/* Main Title with Gradient Text */}
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up">
            <span className="block text-white drop-shadow-lg">Industrial Vacuum</span>
            <span className="block gradient-text bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-transparent neon-text">
              Solutions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-[700px] text-lg text-blue-100 md:text-xl animate-fade-in delay-300">
            Premium vacuum pumps engineered for reliability and performance.
            From rotary vane to screw compressors, we have the solution for your industry.
          </p>

          {/* CTA Buttons with Effects */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-up delay-500">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 shimmer btn-magnetic pulse-glow rounded-xl text-lg h-14">
              <Link href="/products">
                <span className="mr-2">🚀</span>
                Explore Products
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white/40 text-white hover:bg-white/20 px-8 glass rounded-xl text-lg h-14 transition-all duration-300 hover:scale-105">
              <Link href="/contact">
                <span className="mr-2">💬</span>
                Get a Quote
              </Link>
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/60 text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section with Stagger Animation */}
      <section className="container py-16 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger-children">
          {[
            { value: "25+", label: "Years Experience", icon: "📅", color: "from-blue-500 to-blue-600" },
            { value: "500+", label: "Products Delivered", icon: "📦", color: "from-purple-500 to-purple-600" },
            { value: "100+", label: "Happy Clients", icon: "😊", color: "from-cyan-500 to-cyan-600" },
            { value: "24/7", label: "Support Available", icon: "🛠️", color: "from-green-500 to-green-600" },
          ].map((stat, i) => (
            <div
              key={i}
              className="group text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 card-3d"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 rotate-hover`}>
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products with Card Effects */}
      <section className="container section-padding">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-medium mb-4 animate-fade-in">
            <span className="mr-2 animate-pulse">✨</span>
            Our Best Sellers
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in-up">
            Featured <span className="gradient-text">Products</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-200">
            Discover our most popular vacuum pumps, trusted by industries worldwide
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {displayProducts.length > 0 ? (
            displayProducts.map((product, index) => (
              <Link key={product._id} href={`/products/${product.slug}`}>
                <Card className="h-full group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white rounded-2xl">
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-50 relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl animate-pulse">
                          🔧
                        </div>
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shimmer">
                        ⭐ Featured
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white font-medium flex items-center gap-2">
                        View Details
                        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-blue-600 font-semibold text-xs uppercase tracking-widest">
                      {product.category}
                    </CardDescription>
                    <CardTitle className="line-clamp-1 text-xl group-hover:text-blue-600 transition-colors duration-300">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground mb-4">
                      {product.summary}
                    </p>
                    {product.price && (
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </p>
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                          <span className="text-blue-600 group-hover:text-white transition-colors duration-300">→</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-12">
              No products available yet.
            </p>
          )}
        </div>

        {products.length > 6 && (
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link href="/products">
                View All Products
                <span className="ml-2">→</span>
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* Why Choose Us - Interactive Cards */}
      <section className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 section-padding overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full bg-purple-100 text-purple-700 px-4 py-1.5 text-sm font-medium mb-4">
              <span className="mr-2">💎</span>
              Why Us
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Why Choose <span className="gradient-text">Our Company</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive vacuum solutions backed by expertise and dedication
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            {[
              {
                icon: "🏆",
                title: "Premium Quality",
                description: "All products meet international quality standards and certifications",
                color: "from-amber-400 to-orange-500",
                hoverColor: "group-hover:from-amber-500 group-hover:to-orange-600"
              },
              {
                icon: "🚀",
                title: "Fast Delivery",
                description: "Quick shipping and installation to minimize your downtime",
                color: "from-blue-400 to-blue-600",
                hoverColor: "group-hover:from-blue-500 group-hover:to-blue-700"
              },
              {
                icon: "🔧",
                title: "Expert Support",
                description: "Technical assistance from experienced vacuum engineers",
                color: "from-green-400 to-emerald-600",
                hoverColor: "group-hover:from-green-500 group-hover:to-emerald-700"
              },
              {
                icon: "💰",
                title: "Best Value",
                description: "Competitive pricing without compromising on quality",
                color: "from-purple-400 to-pink-600",
                hoverColor: "group-hover:from-purple-500 group-hover:to-pink-700"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group text-center p-8 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} ${feature.hoverColor} text-3xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${feature.color} group-hover:w-1/2 transition-all duration-500 rounded-full`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Trust Section */}
      <section className="container section-padding">
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white overflow-hidden">
          {/* Background effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full"></div>

          <div className="relative z-10 text-center">
            <div className="text-6xl mb-6 animate-bounce">🎯</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-cyan-300">100+</span> Companies
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
              From small businesses to large enterprises, our vacuum solutions power industries across Vietnam and Southeast Asia.
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              {["🏭", "🏢", "🏥", "🔬", "🍽️", "💊"].map((icon, i) => (
                <div key={i} className="text-4xl hover:scale-125 transition-transform duration-300 cursor-pointer">
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Glass Effect */}
      <section className="relative gradient-bg-animated section-padding overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rounded-2xl rotate-12 float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full float-delayed"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 border border-white/30 rounded-lg rotate-45 float"></div>

        <div className="container relative z-10 text-center text-white">
          <div className="animate-bounce-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
              Contact our team today for expert consultation and find the perfect vacuum solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 h-14 text-lg shimmer">
                <Link href="/contact">
                  <span className="mr-2">📞</span>
                  Contact Us Today
                </Link>
              </Button>
              <Button asChild size="lg" className="glass border-2 border-white/30 text-white hover:bg-white/20 px-10 rounded-xl h-14 text-lg transition-all duration-300 hover:scale-105">
                <Link href="/products">
                  <span className="mr-2">🔍</span>
                  Browse Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
