'use client';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth-service';
import { RegisterPayload } from '@/types';
import { setToken } from '@/utils/tokenManager';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

type RegisterErrors = Partial<Record<'name' | 'email' | 'password', string>>;

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const validate = (): RegisterErrors => {
    const nextErrors: RegisterErrors = {};
    if (registerData.name.trim().length < 3) nextErrors.name = 'Name must be at least 3 characters.';
    if (!registerData.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) nextErrors.email = 'Enter a valid email address.';
    if (registerData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    return nextErrors;
  };

  const handleSumit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      const response = await authService.register(registerData);
      if (response.success) {
        setToken(response.data.token);
        toast.success('Registration successful. You can now log in.');
        router.replace('/login');
      }
    } catch {
      toast.error('Registration failed. Please check your details.');
    }
  };

  return (
    <div className="w-full h-screen flex items-center">
      <div className="min-w-md mx-auto">
        <div className="pb-4">
          <h1 className="text-3xl font-medium">
            <span className="text-indigo-600">v</span>St4re
          </h1>
          <p className="text-gray-600">Register with your accout.</p>
        </div>
        {/* form */}
        <form onSubmit={handleSumit} className="my-4 flex flex-col space-y-4">
          <div className="leading-loose">
            <label htmlFor="register-name">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="register-name"
              placeholder="Chamreun Vira"
              onChange={handleChange}
              name="name"
              value={registerData.name}
              type="text"
              className="block w-full"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-rose-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>
          <div className="leading-loose">
            <label htmlFor="register-email">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="register-email"
              placeholder="virachamreun@gmail.com"
              onChange={handleChange}
              name="email"
              value={registerData.email}
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
            <label htmlFor="register-password">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              id="register-password"
              onChange={handleChange}
              type="password"
              placeholder="example123"
              name="password"
              value={registerData.password}
              className="block w-full"
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-rose-600" role="alert">
                {errors.password}
              </p>
            )}
          </div>
          <Button type="submit" className="h-10 text-[18px]">
            Login
          </Button>
          <p className="text-gray-600">
            Do you have an account?{' '}
            <Link href="/login" className="underline cursor-pointer text-gray-900">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
