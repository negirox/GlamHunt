'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  location: z.string().min(2, 'Location is required'),
  bio: z.string().min(20, 'Please provide a brief bio of at least 20 characters.'),
  consentBold: z.boolean().default(false),
  consentSemiNude: z.boolean().default(false),
  consentNude: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

export function RegisterForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      location: '',
      bio: '',
      consentBold: false,
      consentNude: false,
      consentSemiNude: false,
      terms: false,
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    console.log(values);
    toast({
      title: 'Registration Successful!',
      description: "Thank you for registering. You can now build your portfolio.",
    });
    form.reset();
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Register as a Model</CardTitle>
        <CardDescription>Create your profile to get discovered by top brands and photographers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Aarav Sharma" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="Mumbai, India" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="you@glamhunt.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Bio</FormLabel>
                    <FormControl><Textarea placeholder="Tell us about your modeling experience, specialties, and what makes you unique..." {...field} rows={4} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-base font-medium">Photoshoot Consent</h3>
              <p className="text-sm text-muted-foreground">
                Please specify the types of photoshoots you are comfortable with. This helps us match you with the right opportunities.
              </p>
               <FormField
                control={form.control}
                name="consentBold"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I consent to participating in **bold** photoshoots.
                      </FormLabel>
                      <FormDescription>
                        This may include high-fashion concepts with edgy or provocative themes, fully clothed.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="consentSemiNude"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I consent to participating in **semi-nude** photoshoots.
                      </FormLabel>
                       <FormDescription>
                        This may include lingerie, swimwear, or artistic concepts where parts of the body are bare.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="consentNude"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I consent to participating in **nude** photoshoots.
                      </FormLabel>
                       <FormDescription>
                        This includes artistic and implied nudity where no private parts are explicitly shown.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

             <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the <Link href="/terms" className="text-primary underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Create My Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
