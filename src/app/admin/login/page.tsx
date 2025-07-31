'use client';

import { useFormState } from 'react-dom';
import { login } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const initialState = {
  status: 'idle',
  message: '',
};

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(login, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.message,
      });
    }
  }, [state, toast]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" placeholder="admin" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
