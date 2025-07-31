import { models } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/image-uploader';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

export default function ProfilePage() {
  // We'll use the first model as the "logged in" user for this demo.
  const user = models[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Manage Your Profile</h1>
        <p className="text-muted-foreground">Keep your portfolio and information up to date.</p>
      </header>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>This information will be displayed on your public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue={user.location} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" defaultValue={user.bio} rows={5} />
              </div>
              
              <h3 className="font-headline text-lg pt-4">Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {Object.entries(user.stats).map(([key, value]) => (
                     <div key={key} className="space-y-2">
                         <Label htmlFor={`stat-${key}`} className="capitalize">{key}</Label>
                         <Input id={`stat-${key}`} defaultValue={value} />
                     </div>
                 ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Upload New Image</CardTitle>
                  <CardDescription>Add a new photo to your portfolio. Our AI will help you with tags.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                 <CardHeader>
                  <CardTitle>Manage Your Images</CardTitle>
                  <CardDescription>Review and remove existing photos from your portfolio.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {user.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={image.url}
                              alt={`Portfolio image ${index + 1}`}
                              width={400}
                              height={400}
                              className="rounded-lg object-cover aspect-square"
                              data-ai-hint={image.hint}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button variant="destructive" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
