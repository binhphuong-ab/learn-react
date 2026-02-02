import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="gradient-bg py-16 md:py-20">
        <div className="container text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-slide-up">
            About Us
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Your trusted partner for industrial vacuum solutions since 1999
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container section-padding">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4">
              Our Story
            </div>
            <h2 className="text-3xl font-bold mb-6">
              Leading Vacuum Technology Provider in Vietnam
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Vacuum Pumps Co. is a leading supplier of industrial vacuum
                equipment in Vietnam. We specialize in providing high-quality vacuum
                pumps and related equipment for various industries including
                manufacturing, food processing, pharmaceutical, and electronics.
              </p>
              <p>
                With over 25 years of experience in the industry, we have served
                hundreds of satisfied customers across Vietnam and Southeast Asia.
                Our team of engineers and technicians are trained to provide
                professional consultation and support for all your vacuum needs.
              </p>
            </div>
            <Button asChild size="lg" className="mt-6">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🏭</div>
                <p className="text-lg font-semibold text-blue-700">Industrial Excellence</p>
                <p className="text-sm text-blue-600">Since 1999</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold">25+</div>
                <div className="text-xs">Years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl mb-6">
                🎯
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide reliable, efficient, and cost-effective vacuum solutions
                that help our customers optimize their production processes and
                achieve their business goals. We are committed to delivering
                exceptional value through quality products and outstanding service.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl mb-6">
                🔭
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted and preferred vacuum technology partner
                in Southeast Asia, known for our technical expertise, product
                quality, and customer-centric approach. We aim to lead the industry
                in innovation and sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container section-padding">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "🏆",
              title: "Quality",
              description: "We only offer products that meet international standards and certifications"
            },
            {
              icon: "🤝",
              title: "Reliability",
              description: "Our equipment is built to last and perform consistently under demanding conditions"
            },
            {
              icon: "💡",
              title: "Innovation",
              description: "We continuously update our product range with the latest vacuum technology"
            },
            {
              icon: "❤️",
              title: "Service",
              description: "We provide expert technical support before, during, and after sales"
            }
          ].map((value, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl mx-auto mb-4">
                {value.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="gradient-bg section-padding">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "500+", label: "Products Delivered" },
              { value: "100+", label: "Happy Clients" },
              { value: "25+", label: "Years Experience" },
              { value: "15+", label: "Industry Awards" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container section-padding text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Work Together?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Let us help you find the perfect vacuum solution for your business needs.
          Our team of experts is ready to assist you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="px-8">
            <Link href="/contact">Get in Touch</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link href="/products">View Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
