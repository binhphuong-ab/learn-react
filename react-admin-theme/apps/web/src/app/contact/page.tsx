import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="gradient-bg py-16 md:py-20">
        <div className="container text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-slide-up">
            Contact Us
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Get in touch with our team for inquiries, quotes, or technical support
          </p>
        </div>
      </section>

      <div className="container section-padding">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl mb-2">
                  📧
                </div>
                <CardTitle className="text-lg">Sales Inquiries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Email:</span>
                  <a href="mailto:sales@vacuumpumps.vn" className="text-blue-600 hover:underline">
                    sales@vacuumpumps.vn
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Phone:</span>
                  <a href="tel:+842812345678" className="text-blue-600 hover:underline">
                    +84 28 1234 5678
                  </a>
                </p>
                <p className="text-muted-foreground">
                  Mon-Fri, 8:00 AM - 5:00 PM
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-100 bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl mb-2">
                  🔧
                </div>
                <CardTitle className="text-lg">Technical Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Email:</span>
                  <a href="mailto:support@vacuumpumps.vn" className="text-blue-600 hover:underline">
                    support@vacuumpumps.vn
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Phone:</span>
                  <a href="tel:+842812345679" className="text-blue-600 hover:underline">
                    +84 28 1234 5679
                  </a>
                </p>
                <p className="text-muted-foreground">
                  Mon-Sat, 8:00 AM - 6:00 PM
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-xl mb-2">
                  📍
                </div>
                <CardTitle className="text-lg">Office Address</CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic text-sm text-muted-foreground leading-relaxed">
                  123 Industrial Zone<br />
                  District 7, Ho Chi Minh City<br />
                  Vietnam
                </address>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-medium">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Your company"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="+84 xxx xxx xxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a subject</option>
                      <option value="quote">Request a Quote</option>
                      <option value="product">Product Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto px-8">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 rounded-2xl overflow-hidden border bg-gray-100 h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="font-medium">Map Location</p>
            <p className="text-sm">123 Industrial Zone, District 7, Ho Chi Minh City</p>
          </div>
        </div>

        {/* Quick Contact CTA */}
        <div className="mt-12 p-8 rounded-2xl gradient-bg text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Need Immediate Assistance?</h2>
          <p className="text-blue-100 mb-6">
            Call our hotline for urgent inquiries and support
          </p>
          <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
            <a href="tel:+842812345678">
              📞 +84 28 1234 5678
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
