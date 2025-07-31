'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookingForm } from '@/components/booking-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Flag, Mail, User, Ruler, BarChart, Footprints, Eye, Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Model } from '@/lib/data';
import { useEffect, useState } from 'react';

// This is not ideal for production apps, but for this demo we'll fetch on the client.
// A better approach would be to use server components and fetch data on the server.
async function getModels(): Promise<Model[]> {
  const res = await fetch('/api/models');
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json();
}

export default function ModelProfilePage({ params }: { params: { id: string } }) {
  const [model, setModel] = useState<Model | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/models.json`)
      .then((res) => res.json())
      .then((models: Model[]) => {
        const foundModel = models.find((m) => m.id === params.id);
        setModel(foundModel);
        setLoading(false);
      });
  }, [params.id]);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!model) {
    notFound();
  }

  const handleReport = () => {
    toast({
      title: 'Content Reported',
      description: `Thank you for reporting ${model.name}'s profile. Our team will review it shortly.`,
    });
  };

  const statItems = [
    { icon: Ruler, label: 'Height', value: model.stats.height },
    { icon: BarChart, label: 'Bust', value: `${model.stats.bust}"` },
    { icon: BarChart, label: 'Waist', value: `${model.stats.waist}"` },
    { icon: BarChart, label: 'Hips', value: `${model.stats.hips}"` },
    { icon: Footprints, label: 'Shoe', value: model.stats.shoe },
    { icon: Eye, label: 'Eyes', value: model.stats.eyes },
    { icon: Scissors, label: 'Hair', value: model.stats.hair },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="flex flex-col items-center text-center p-6">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
                <AvatarImage src={model.profileImage} alt={model.name} data-ai-hint="fashion portrait" />
                <AvatarFallback>{model.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="font-headline text-4xl font-bold">{model.name}</h1>
              <p className="text-muted-foreground">{model.location}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {model.specialties.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-center mb-6">{model.bio}</p>
              <Separator className="my-6" />
              <h3 className="font-headline text-lg mb-4 text-center">Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {statItems.map(item => (
                   <div key={item.label} className="flex items-center gap-3 bg-background/50 p-2 rounded-md">
                     <item.icon className="h-5 w-5 text-primary" />
                     <div>
                       <p className="text-muted-foreground">{item.label}</p>
                       <p className="font-semibold">{item.value}</p>
                     </div>
                   </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 mt-8">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full"><Mail className="mr-2" />Book Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book {model.name}</DialogTitle>
                    </DialogHeader>
                    <BookingForm modelName={model.name} />
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="lg" className="w-full">
                      <Flag className="mr-2" /> Report Profile
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will flag the profile for review by our content moderation team. Please only report content that violates our community guidelines.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReport}>Confirm Report</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
           <h2 className="font-headline text-3xl font-bold mb-6">Portfolio</h2>
          <div className="columns-2 md:columns-3 gap-4">
            {model.images.map((image, index) => (
              <div key={index} className="mb-4 break-inside-avoid">
                <Image
                  src={image.url}
                  alt={`Portfolio image ${index + 1} for ${model.name}`}
                  width={800}
                  height={1200}
                  className="rounded-lg shadow-lg w-full h-auto object-cover transition-transform hover:scale-105"
                  data-ai-hint={image.hint}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const res = await fetch(new URL('/models.json', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002').href);
  const models: Model[] = await res.json();
 
  return models.map((model) => ({
    id: model.id,
  }))
}
