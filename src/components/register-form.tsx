'use client';

import * as React from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { registerModelAction } from '@/app/actions';
import { useFormState } from 'react-dom';


const TAGS = [
  { value: 'runway', label: 'Runway' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'glamour', label: 'Glamour' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'promotional', label: 'Promotional' },
] as const;

const AVAILABLE_FOR_TAGS = [
    { value: 'fashion', label: 'Fashion' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'ecom', label: 'E-commerce' },
    { value: 'print', label: 'Print' },
    { value: 'runway', label: 'Runway' },
    { value: 'parts-modeling', label: 'Parts Modeling' },
] as const;

const LOCATIONS = [
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'dubai', label: 'Dubai' },
    { value: 'london', label: 'London' },
    { value: 'new-york', label: 'New York' },
] as const;

const LANGUAGES = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'marathi', label: 'Marathi' },
    { value: 'punjabi', label: 'Punjabi' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
] as const;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['model', 'brand'], { required_error: 'Please select a role.' }),
  fullName: z.string().min(2, 'Full name is required'),
  stageName: z.string().optional(),
  gender: z.enum(['male', 'female', 'non-binary'], { required_error: 'Please select a gender.' }),
  dob: z.date({ required_error: 'Date of birth is required.' }),
  nationality: z.string().optional(),
  location: z.string().min(2, 'Location is required'),

  // Physical Attributes
  height: z.string().min(1, 'Height is required.'),
  weight: z.string().optional(),
  chestBust: z.string().optional(),
  waist: z.string().optional(),
  hips: z.string().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
  skinTone: z.string().optional(),
  dressSize: z.string().optional(),
  shoeSize: z.string().optional(),

  // Portfolio Section
  profilePicture: z.any().refine((files) => files?.length >= 1, 'Profile picture is required.').optional(),
  portfolioGallery: z.any().refine((files) => files?.length >= 5 && files?.length <= 20, 'Upload between 5 and 20 photos.').optional(),
  portfolioVideo: z.any().optional(),
  tags: z.array(z.string()).min(1, 'Please select at least one tag.'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'pro']).optional(),
  bio: z.string().min(1, 'Bio is required.').max(500, 'Bio must be 250-500 characters.').min(250, 'Bio must be 250-500 characters.'),
  instagram: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
  tiktok: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),

  // Booking Preferences
  availableFor: z.array(z.string()).min(1, 'Please select at least one category.'),
  travelReady: z.boolean().optional(),
  preferredLocations: z.array(z.string()).optional(),
  languagesSpoken: z.array(z.string()).optional(),
  availability: z.string().optional(),
  contactEmail: z.string().email('Please enter a valid email for booking inquiries.'),
  contactPhone: z.string().optional(),
  bookingLink: z.string().url().optional().or(z.literal('')),

  consentBold: z.boolean().default(false),
  consentSemiNude: z.boolean().default(false),
  consentNude: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const initialState = {
  status: 'idle',
  message: '',
};

export function RegisterForm() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(registerModelAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);


  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      location: '',
      terms: false,
      tags: [],
      bio: '',
      availableFor: [],
      contactEmail: '',
    },
  });

  React.useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: 'Registration Successful!',
        description: state.message,
      });
      form.reset();
      formRef.current?.reset();
    } else if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: state.message,
      });
    }
  }, [state, toast, form]);


  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Register as a Model or Brand</CardTitle>
        <CardDescription>Create your profile to get discovered or find amazing talent.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form ref={formRef} action={formAction} className="space-y-8">
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-medium">Account Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="model">Model</SelectItem>
                            <SelectItem value="brand">Brand</SelectItem>
                          </SelectContent>
                        </Select>
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
                 <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
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
                    name="stageName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage/Model Name (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. Ananya" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality (Optional)</FormLabel>
                        <FormControl><Input placeholder="Indian" {...field} /></FormControl>
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
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Physical Attributes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <FormField control={form.control} name="height" render={({ field }) => (<FormItem><FormLabel>Height</FormLabel><FormControl><Input placeholder="e.g. 170 cm" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="weight" render={({ field }) => (<FormItem><FormLabel>Weight (Optional)</FormLabel><FormControl><Input placeholder="e.g. 55 kg" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="chestBust" render={({ field }) => (<FormItem><FormLabel>Chest/Bust (Optional)</FormLabel><FormControl><Input placeholder="e.g. 34 inches" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="waist" render={({ field }) => (<FormItem><FormLabel>Waist (Optional)</FormLabel><FormControl><Input placeholder="e.g. 28 inches" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="hips" render={({ field }) => (<FormItem><FormLabel>Hips (Optional)</FormLabel><FormControl><Input placeholder="e.g. 36 inches" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="hairColor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hair Color (Optional)</FormLabel>
                      <Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="black">Black</SelectItem><SelectItem value="brown">Brown</SelectItem><SelectItem value="blonde">Blonde</SelectItem><SelectItem value="red">Red</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>)} />
                  <FormField control={form.control} name="eyeColor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eye Color (Optional)</FormLabel>
                      <Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select color" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="brown">Brown</SelectItem><SelectItem value="black">Black</SelectItem><SelectItem value="blue">Blue</SelectItem><SelectItem value="green">Green</SelectItem><SelectItem value="hazel">Hazel</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>)} />
                  <FormField control={form.control} name="skinTone" render={({ field }) => (
                     <FormItem>
                      <FormLabel>Skin Tone (Optional)</FormLabel>
                      <Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="fair">Fair</SelectItem><SelectItem value="wheatish">Wheatish</SelectItem><SelectItem value="olive">Olive</SelectItem><SelectItem value="brown">Brown</SelectItem><SelectItem value="dark">Dark</SelectItem></SelectContent>
                      </Select><FormMessage />
                    </FormItem>)} />
                  <FormField control={form.control} name="dressSize" render={({ field }) => (<FormItem><FormLabel>Dress Size (Optional)</FormLabel><FormControl><Input placeholder="e.g. S, M, L" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="shoeSize" render={({ field }) => (<FormItem><FormLabel>Shoe Size (Optional)</FormLabel><FormControl><Input placeholder="e.g. US 8" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
            </div>

            <div className="space-y-6 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Portfolio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" {...form.register("profilePicture")} />
                        </FormControl>
                        <FormDescription>This will be your main photo on the site.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="portfolioGallery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio Gallery</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" multiple {...form.register("portfolioGallery")} />
                        </FormControl>
                        <FormDescription>Upload between 5 and 20 of your best photos.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="portfolioVideo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio Video (optional)</FormLabel>
                        <FormControl>
                          <Input type="file" accept="video/*" {...form.register("portfolioVideo")} />
                        </FormControl>
                        <FormDescription>Upload an intro or runway show reel.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level (Optional)</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select your experience" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                          <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                          <SelectItem value="pro">Professional (3+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags/Genres</FormLabel>
                        <MultiSelect
                          options={TAGS}
                          selected={field.value}
                          onChange={(value) => field.onChange(value)}
                          className="w-full"
                          placeholder="Select tags..."
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bio / About Me</FormLabel>
                        <FormControl><Textarea placeholder="Tell us about yourself (250-500 characters)" {...field} rows={5} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div>
                  <h4 className="text-md font-medium mb-2">Social Media (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="https://instagram.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="facebook" render={({ field }) => (<FormItem><FormLabel>Facebook</FormLabel><FormControl><Input placeholder="https://facebook.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="tiktok" render={({ field }) => (<FormItem><FormLabel>TikTok</FormLabel><FormControl><Input placeholder="https://tiktok.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </div>
                 <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Website/Portfolio URL (Optional)</FormLabel>
                        <FormControl><Input type="url" placeholder="https://yourportfolio.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="space-y-6 rounded-lg border p-4">
              <h3 className="text-lg font-medium">Booking Preferences</h3>
               <FormField
                  control={form.control}
                  name="availableFor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available For</FormLabel>
                      <MultiSelect
                        options={AVAILABLE_FOR_TAGS}
                        selected={field.value}
                        onChange={(value) => field.onChange(value)}
                        className="w-full"
                        placeholder="Select categories..."
                      />
                       <FormDescription>What kind of work are you looking for?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormField
                      control={form.control}
                      name="travelReady"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Willing to Travel?</FormLabel>
                            <FormDescription>
                              Are you available for out-of-town gigs?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              name={field.name}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredLocations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Locations (Optional)</FormLabel>
                          <MultiSelect
                            options={LOCATIONS}
                            selected={field.value || []}
                            onChange={(value) => field.onChange(value)}
                            className="w-full"
                            placeholder="Select locations..."
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="languagesSpoken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language(s) Spoken (Optional)</FormLabel>
                          <MultiSelect
                            options={LANGUAGES}
                            selected={field.value || []}
                            onChange={(value) => field.onChange(value)}
                            className="w-full"
                            placeholder="Select languages..."
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email for Bookings</FormLabel>
                          <FormControl><Input type="email" placeholder="bookings@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone (Optional, Hidden)</FormLabel>
                          <FormControl><Input type="tel" placeholder="+91..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bookingLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Link (Optional)</FormLabel>
                          <FormControl><Input type="url" placeholder="https://calendly.com/..." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Available on weekends, Mon-Wed after 5 PM." {...field} />
                        </FormControl>
                        <FormDescription>Let brands know your general availability.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
            </div>
            
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} name={field.name} />
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} name={field.name} />
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} name={field.name} />
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
                      name={field.name}
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


interface MultiSelectProps {
  options: readonly { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
  placeholder?: string;
}

function MultiSelect({ options, selected, onChange, className, placeholder }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };
  
  const name = "tags";

  return (
    <>
    <input type="hidden" name={name} value={selected.join(',')} />
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              selected
                .map((value) => options.find((option) => option.value === value))
                .filter(Boolean)
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option!.value}
                    className="mr-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option!.value)
                    }}
                  >
                    {option!.label}
                  </Badge>
                ))
            ) : (
              placeholder || 'Select...'
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
    </>
  );
}