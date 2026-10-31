'use client';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth-service';
import { AuthPaylaod } from '@/types';
import { setToken } from '@/utils/tokenManager';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

type LoginErrors = Partial<Record<'email' | 'password', string>>;

const LoginPage = () => {
  const [authData, setAuthData] = useState<AuthPaylaod>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const validate = (): LoginErrors => {
    const nextErrors: LoginErrors = {};
    if (!authData.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authData.email)) nextErrors.email = 'Enter a valid email address.';
    if (!authData.password) nextErrors.password = 'Password is required.';
    return nextErrors;
  };

  const handleSumit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      const response = await authService.login(authData);
      if (response.success) {
        setToken(response.data.token);
        toast.success('Login successful.');
        router.replace('/');
      }
    } catch {
      toast.error('Login failed. Check your email and password.');
    }
  };

  return (
    <div className="w-full h-screen flex items-center">
      <div className="min-w-md mx-auto">
        <div className="pb-4">
          <h1 className="text-3xl font-medium">
            <span className="text-indigo-600">v</span>St4re
          </h1>
          <p className="text-gray-600">login with your accout.</p>
        </div>
        {/* form */}
        <form method="POST" onSubmit={handleSumit} className="my-4 flex flex-col space-y-4">
          <div className="leading-loose">
            <label htmlFor="login-email">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="login-email"
              placeholder="virachamreun@gmail.com"
              onChange={handleChange}
              name="email"
              value={authData.email}
              type="text"
              className="block w-full"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-rose-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div className="leading-loose">
            <label htmlFor="login-password">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              id="login-password"
              onChange={handleChange}
              type="password"
              placeholder="example123"
              name="password"
              value={authData.password}
              className="block w-full"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-rose-600" role="alert">
                {errors.password}
              </p>
            )}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="cursor-pointer">
                <p className="underline text-gray-600">forgot password?</p>
              </Link>
            </div>
          </div>
          <Button type="submit" className="h-10 text-[18px]">
            Login
          </Button>
          <p className="text-gray-600">
            You dont have an account?{' '}
            <Link href="/register" className="underline cursor-pointer text-gray-900">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
