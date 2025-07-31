'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/image-uploader';
import Image from 'next/image';
import { Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { getRegistrations } from '../admin/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


type Registration = {
  [key: string]: any;
};

export default function ProfilePage() {
  const [user, setUser] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const registrations = await getRegistrations();
        // We'll use the first registration as the "logged in" user for this demo.
        if (registrations.length > 0) {
          setUser(registrations[0]);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-500/50 text-lg"><CheckCircle2 className="mr-2" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="text-lg"><XCircle className="mr-2" /> Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-lg"><Clock className="mr-2" /> Pending Review</Badge>;
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading profile...</div>;
  }

  if (!user) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>No Profile Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You haven't registered yet. Please create a profile to view your details and status.</p>
                    <Button asChild className="mt-4">
                        <a href="/auth/register">Register Now</a>
                    </Button>
                </CardContent>
            </Card>
      </div>
    );
  }

  const portfolioImages = user.portfolioGalleryUrls ? user.portfolioGalleryUrls.split(',') : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Manage Your Profile</h1>
        <p className="text-muted-foreground">Keep your portfolio and information up to date.</p>
      </header>
      
      <Card className="mb-8">
        <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>This is the current status of your registration application.</CardDescription>
        </CardHeader>
        <CardContent>
            {getStatusBadge(user.status)}
            {user.status === 'approved' && <p className="text-sm text-green-400 mt-2">Congratulations! Your profile is live and visible to brands.</p>}
            {user.status === 'rejected' && <p className="text-sm text-red-400 mt-2">We're sorry, your application was not approved at this time. You may update your profile and contact support for a re-review.</p>}
            {user.status !== 'approved' && user.status !== 'rejected' && <p className="text-sm text-muted-foreground mt-2">Your profile is currently under review by our team. We'll notify you via email once a decision has been made.</p>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
             <Card className="sticky top-24">
                <CardHeader className="flex flex-col items-center text-center p-6">
                  <Avatar className="w-32 h-32 mb-4 border-4 border-primary">
                    <AvatarImage src={user.profilePictureUrl} alt={user.fullName} data-ai-hint="fashion portrait" />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="font-headline text-3xl font-bold">{user.fullName}</h2>
                  <p className="text-muted-foreground">{user.location}</p>
                </CardHeader>
                <CardContent>
                  <Textarea id="bio" defaultValue={user.bio} rows={5} readOnly className="bg-muted" />
                  <Separator className="my-4" />
                   <div className="space-y-2">
                     <h3 className="font-headline text-lg">Details</h3>
                     <div className="grid grid-cols-2 gap-2 text-sm">
                        <p><strong className="text-muted-foreground">Height:</strong> {user.height}</p>
                        <p><strong className="text-muted-foreground">Weight:</strong> {user.weight}</p>
                        <p><strong className="text-muted-foreground">Chest/Bust:</strong> {user.chestBust}</p>
                        <p><strong className="text-muted-foreground">Waist:</strong> {user.waist}</p>
                     </div>
                   </div>
                </CardContent>
             </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                 <CardHeader>
                  <CardTitle>Your Portfolio</CardTitle>
                  <CardDescription>These are the images you submitted. To make changes, please re-upload your portfolio.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {portfolioImages.map((image: string, index: number) => (
                          <div key={index} className="relative group">
                            <Image
                              src={image}
                              alt={`Portfolio image ${index + 1}`}
                              width={400}
                              height={400}
                              className="rounded-lg object-cover aspect-square"
                            />
                          </div>
                        ))}
                    </div>
                </CardContent>
              </Card>
        </div>
      </div>
    </div>
  );
}
