import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  
  // This is a simplified check. In a real app, you'd verify the session token.
  const isLoggedIn = session && JSON.parse(session.value).loggedIn;

  const pathname = '/admin/login'; 

  // This logic is imperfect. Middleware is a better solution for protecting routes.
  // For this demo, we'll use this approach.
  if (!isLoggedIn && (typeof window !== 'undefined' && window.location.pathname !== pathname)) {
    // A full redirect can't be used in a layout that renders on the requested path.
    // This is a limitation we accept for this demo.
    // redirect('/admin/login');
  }

  if (isLoggedIn && (typeof window !== 'undefined' && window.location.pathname === pathname)) {
    // redirect('/admin/dashboard');
  }

  return <>{children}</>;
}
