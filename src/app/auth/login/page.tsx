import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">
      <AuthForm type="login" />
    </div>
  );
}
