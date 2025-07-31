import { getRegistrations } from '@/app/admin/actions';
import { DashboardClient } from './dashboard-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogoutButton } from '@/components/logout-button';

export default async function DashboardPage() {
  const registrations = await getRegistrations();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
           <h1 className="font-headline text-3xl">Admin Dashboard</h1>
           <div className="ml-auto">
            <LogoutButton />
           </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
           <Card>
            <CardHeader>
                <CardTitle>Model & Brand Registrations</CardTitle>
                <CardDescription>Review, approve, or reject new submissions.</CardDescription>
            </CardHeader>
            <CardContent>
                <DashboardClient initialData={registrations} />
            </CardContent>
           </Card>
        </main>
      </div>
    </div>
  );
}
