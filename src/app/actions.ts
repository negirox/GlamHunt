'use server';

import { suggestImageTags } from '@/ai/flows/suggest-image-tags';
import type { SuggestImageTagsOutput } from '@/ai/flows/suggest-image-tags';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { z, ZodError } from 'zod';
import papaparse from 'papaparse';
import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/welcome-email';
import { AdminReplyEmail } from '@/emails/admin-reply-email';

export async function handleSuggestTags(photoDataUri: string): Promise<SuggestImageTagsOutput> {
  // Basic validation for data URI
  if (!photoDataUri.startsWith('data:image/')) {
    console.error('Invalid data URI format');
    return { tags: [] };
  }

  try {
    const result = await suggestImageTags({ photoDataUri });
    return result;
  } catch (error) {
    console.error('Error suggesting image tags:', error);
    // Return a structured error or empty tags
    return { tags: [] };
  }
}

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email(),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

export async function handleContactForm(prevState: any, formData: FormData) {
  try {
    const validatedFields = contactFormSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
      return { status: 'error', message: 'Invalid form data.', errors: validatedFields.error.flatten().fieldErrors };
    }

    const submissionsPath = path.join(process.cwd(), 'contact-submissions.csv');
    const submissionData = {
      ...validatedFields.data,
      submittedAt: new Date().toISOString(),
      status: 'new', // new, replied
    };

    const csvData = [submissionData];
    let existingCsv = '';
    try {
        await fs.access(submissionsPath);
        existingCsv = await fs.readFile(submissionsPath, 'utf-8');
    } catch (e) {
        // File doesn't exist, will be created
    }

    const csvString = papaparse.unparse(csvData, {
        header: !existingCsv.trim(),
    });

    await fs.appendFile(submissionsPath, (existingCsv.trim() ? os.EOL : '') + csvString);
    
    return { status: 'success', message: 'Your message has been sent successfully!' };
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return { status: 'error', message: 'An unexpected error occurred.' };
  }
}

const replyFormSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  message: z.string(),
  original_email: z.string().email(),
});

export async function handleReplyForm(prevState: any, formData: FormData) {
   if (!process.env.RESEND_API_KEY) {
    console.error('Resend API key is not configured.');
    return { status: 'error', message: 'Email service is not configured.' };
  }
  
  try {
    const validatedFields = replyFormSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { status: 'error', message: 'Invalid reply data.', errors: validatedFields.error.flatten().fieldErrors };
    }
    const { to, subject, message, original_email } = validatedFields.data;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
        from: 'GlamHunt Admin <onboarding@resend.dev>',
        to: to,
        subject: `Re: ${subject}`,
        react: AdminReplyEmail({ replyMessage: message, originalSubject: subject }),
    });

    // Update the status in the CSV
    const submissionsPath = path.join(process.cwd(), 'contact-submissions.csv');
    const csvFile = await fs.readFile(submissionsPath, 'utf-8');
    const parsed = papaparse.parse(csvFile, { header: true, skipEmptyLines: true });
    
    let found = false;
    const updatedSubmissions = (parsed.data as any[]).map(row => {
        if (row.email === original_email && row.subject === subject) {
            found = true;
            return { ...row, status: 'replied' };
        }
        return row;
    });

    if(found) {
        const csvString = papaparse.unparse(updatedSubmissions, { header: true });
        await fs.writeFile(submissionsPath, csvString);
    }
    
    return { status: 'success', message: 'Your reply has been sent.' };

  } catch (error) {
    console.error('Failed to send reply:', error);
    return { status: 'error', message: 'An unexpected error occurred while sending the reply.' };
  }
}

export async function registerModelAction(prevState: any, formData: FormData) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const data: { [key: string]: any } = {};
    const filePaths: { [key: string]: string[] } = {
        profilePicture: [],
        portfolioGallery: [],
        portfolioVideo: [],
    };
    
    // Process form fields and files
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) {
            const buffer = Buffer.from(await value.arrayBuffer());
            const uniqueFilename = `${Date.now()}-${value.name}`;
            const filePath = path.join(uploadsDir, uniqueFilename);
            await fs.writeFile(filePath, buffer);
            
            const relativePath = `/uploads/${uniqueFilename}`;

            if(key in filePaths) {
                filePaths[key as keyof typeof filePaths].push(relativePath);
            }
        }
      } else {
         if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
         } else {
            data[key] = value;
         }
      }
    }
    
    // Add file paths to the main data object
    data.profilePictureUrl = filePaths.profilePicture[0] || '';
    data.portfolioGalleryUrls = filePaths.portfolioGallery.join(',');
    data.portfolioVideoUrl = filePaths.portfolioVideo[0] || '';


    // Save data to CSV
    const csvPath = path.join(process.cwd(), 'registrations.csv');
    const csvData = [data];

    let existingCsv = '';
    try {
        await fs.access(csvPath);
        existingCsv = await fs.readFile(csvPath, 'utf-8');
    } catch (e) {
        // File doesn't exist, will be created
    }

    const csvString = papaparse.unparse(csvData, {
        header: !existingCsv.trim(), // Add header only if file is new/empty
    });

    await fs.appendFile(csvPath, (existingCsv.trim() ? os.EOL : '') + csvString);

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'GlamHunt <onboarding@resend.dev>',
          to: data.email,
          subject: 'Welcome to GlamHunt! Your Profile is Live!',
          react: WelcomeEmail({ userFirstname: data.fullName }),
        });
      } catch (emailError) {
         console.error('Email sending failed:', emailError);
         // Don't block registration if email fails, just log it.
         // You might want more robust error handling here in a real app.
      }
    } else {
        console.log('RESEND_API_KEY is not set. Skipping email sending.');
    }
    
    return { status: 'success', message: 'Registration successful! Your data has been saved.' };

  } catch (error) {
    console.error('Registration failed:', error);

    if (error instanceof ZodError) {
        return {
            status: 'error',
            message: 'Invalid form data.',
            errors: error.flatten().fieldErrors,
        };
    }
    
    return { status: 'error', message: 'An unexpected error occurred. Please try again.' };
  }
}
