import { AuthForm } from '@/components/auth-form';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-8">
      <AuthForm type="signup" />
    </div>
  );
}
