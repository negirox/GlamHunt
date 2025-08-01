import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[300px] flex items-center justify-center text-center bg-cover bg-center" style={{backgroundImage: "url('/assets/m18.jpeg')"}} data-ai-hint="team of photographers">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"></div>
          <div className="relative z-10 container mx-auto px-4 text-white">
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-white drop-shadow-lg">Our Mission</h1>
            <p className="text-lg md:text-xl text-white/90 mt-4 drop-shadow-md">Connecting talent with opportunity, seamlessly.</p>
          </div>
        </section>
        
        {/* About Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-primary">About GlamHunt</h2>
                <p className="text-lg text-muted-foreground">
                  GlamHunt was founded with a simple yet powerful vision: to create a centralized, elegant, and efficient platform where the fashion and modeling industry can connect and collaborate. We saw the challenges that models, brands, and photographers faced in finding each other and managing their professional engagements.
                </p>
                <p className="text-muted-foreground">
                  Our platform is more than just a marketplace; it's a community built on trust, professionalism, and a shared passion for creativity. We leverage technology to break down barriers, making it easier than ever for talent to be discovered and for brands to find the perfect face for their campaigns.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-primary/20 p-1 rounded-full mr-4 mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">For Models</h4>
                      <p className="text-muted-foreground">We provide a beautiful space to build a professional portfolio, gain visibility, and connect directly with brands for paid opportunities.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/20 p-1 rounded-full mr-4 mt-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">For Brands & Photographers</h4>
                      <p className="text-muted-foreground">Access a diverse pool of vetted talent. Use our powerful search and filter tools to find the exact look you need and manage bookings with ease.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <Image 
                  src="/assets/M16.jpg"
                  alt="Fashion model posing"
                  width={800}
                  height={1000}
                  className="rounded-lg shadow-xl"
                  data-ai-hint="fashion studio"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/40 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl font-bold mb-4">Join the GlamHunt Community</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Whether you're starting your journey or are an established professional, GlamHunt is your partner in success. Create your profile today and unlock a world of opportunities.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/register">Register as a Model</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
