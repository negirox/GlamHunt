'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import papaparse from 'papaparse';
import { revalidatePath } from 'next/cache';

const SESSION_COOKIE_NAME = 'admin_session';
const credentialsPath = path.join(process.cwd(), 'admin-credentials.json');
const registrationsPath = path.join(process.cwd(), 'registrations.csv');

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const credentialsData = await fs.readFile(credentialsPath, 'utf-8');
    const credentials = JSON.parse(credentialsData);

    if (username === credentials.username && password === credentials.password) {
      const sessionData = { loggedIn: true, user: username };
      cookies().set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
    } else {
      return { status: 'error', message: 'Invalid username or password.' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { status: 'error', message: 'An unexpected error occurred.' };
  }

  redirect('/admin/dashboard');
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}

export async function getRegistrations() {
  try {
    const csvFile = await fs.readFile(registrationsPath, 'utf-8');
    const parsed = papaparse.parse(csvFile, { header: true, skipEmptyLines: true });
    // Convert boolean-like strings to actual booleans
    const data = parsed.data.map((row: any) => ({
      ...row,
      verified: row.verified === 'true' || row.verified === true,
      featured: row.featured === 'true' || row.featured === true,
    }));
    return data;
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Failed to read registrations:', error);
    return [];
  }
}

const updateSchema = z.object({
    email: z.string().email(),
    status: z.enum(['active', 'inactive', 'blocked', 'pending']),
    verified: z.boolean(),
    featured: z.boolean(),
});

export async function updateRegistration(formData: FormData) {
  try {
    const validatedFields = updateSchema.safeParse({
      email: formData.get('email'),
      status: formData.get('status'),
      verified: formData.get('verified') === 'true',
      featured: formData.get('featured') === 'true',
    });

    if (!validatedFields.success) {
        return { status: 'error', message: 'Invalid data provided.', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { email, status, verified, featured } = validatedFields.data;

    const registrations = await getRegistrations();
    let found = false;
    const updatedRegistrations = registrations.map((reg: any) => {
      if (reg.email === email) {
        found = true;
        return { ...reg, status, verified, featured };
      }
      return reg;
    });

    if (!found) {
        return { status: 'error', message: 'Registration not found.' };
    }

    const csvString = papaparse.unparse(updatedRegistrations, { header: true });
    await fs.writeFile(registrationsPath, csvString);

    revalidatePath('/admin/dashboard');
    revalidatePath('/profile');

    return { status: 'success', message: `Registration has been updated.` };

  } catch (error) {
    console.error('Failed to update status:', error);
    return { status: 'error', message: 'Failed to update registration status.' };
  }
}

export async function updateRegistrationStatus(email: string, status: 'approved' | 'rejected') {
    const newStatus = status === 'approved' ? 'active' : 'blocked';
    
    try {
        const registrations = await getRegistrations();
        let found = false;
        const updatedRegistrations = registrations.map((reg: any) => {
        if (reg.email === email) {
            found = true;
            // When using the old approve/reject, set verified/featured to false by default.
            return { ...reg, status: newStatus, verified: reg.verified || false, featured: reg.featured || false };
        }
        return reg;
        });

        if (!found) {
            return { status: 'error', message: 'Registration not found.' };
        }

        const csvString = papaparse.unparse(updatedRegistrations, { header: true });
        await fs.writeFile(registrationsPath, csvString);
        
        revalidatePath('/admin/dashboard');
        revalidatePath('/profile');

        return { status: 'success', message: `Registration has been ${status}.` };

    } catch (error) {
        console.error('Failed to update status:', error);
        return { status: 'error', message: 'Failed to update registration status.' };
    }
}