import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import type { Model } from '@/lib/data';
import fs from 'fs/promises';
import path from 'path';
import { ModelCard } from '@/components/model-card';

async function getModels(): Promise<Model[]> {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'models.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}


export default async function Home() {
    const models = await getModels();
    const featuredModels = models.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section with Carousel */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {models.slice(0, 5).map((model, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[60vh] min-h-[400px] overflow-hidden rounded-xl">
                      <Image
                        src={model.images[0].url}
                        alt={`Image of ${model.name}`}
                        fill
                        className="object-cover"
                        data-ai-hint="fashion runway"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-8 text-white">
                        <h1 className="font-headline text-5xl md:text-7xl font-bold drop-shadow-lg">
                          {model.name}
                        </h1>
                        <p className="mt-2 text-lg md:text-xl text-white/90 drop-shadow-md">
                          {model.specialties.join(' | ')}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About GlamHunt</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                GlamHunt is the premier destination for professional models, photographers, and brands to connect. Our platform is designed to showcase top talent and streamline the booking process for photoshoots, campaigns, and more.
              </p>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Whether you're a model looking to build your portfolio or a brand searching for the perfect face, GlamHunt provides the tools and community to bring your creative vision to life.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="About GlamHunt"
                className="overflow-hidden rounded-xl object-cover"
                data-ai-hint="behind the scenes fashion photoshoot"
              />
            </div>
          </div>
        </section>

         {/* Featured Models Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
             <div className="container px-4 md:px-6">
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Featured Models</h2>
                    <Button asChild variant="outline">
                        <Link href="/discover">
                            Discover All <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 xl:gap-8">
                  {featuredModels.map((model) => (
                    <div key={model.id} className="mb-6 break-inside-avoid">
                      <ModelCard model={model} />
                    </div>
                  ))}
                </div>
             </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container flex flex-col items-center gap-4 px-4 text-center md:px-6">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Join our community today. Register as a model to get discovered or sign up as a brand to find your next star.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/auth/register">Register as a Model</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/auth/register">Sign Up as a Brand</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
