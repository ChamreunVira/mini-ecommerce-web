'use client';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth-service';
import { AuthPaylaod } from '@/types';
import { setToken } from '@/utils/tokenManager';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginPage = () => {
  const [authData, setAuthData] = useState<AuthPaylaod>({
    email: '',
    password: '',
  });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSumit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(authData);
      if (response.success) {
        setToken(response.data.token);
        console.log('[Auth]: Login successfully.');
        router.replace('/');
      }
    } catch (error: unknown) {
      console.log('Failed to login.', error);
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
            <label htmlFor="">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              placeholder="virachamreun@gmail.com"
              onChange={handleChange}
              name="email"
              value={authData.email}
              type="text"
              className="block w-full"
            />
          </div>
          <div className="leading-loose">
            <label htmlFor="">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              onChange={handleChange}
              type="password"
              placeholder="example123"
              name="password"
              value={authData.password}
              className="block w-full"
            />
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
