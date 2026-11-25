'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth-service';
import { RegisterPayload } from '@/types';
import { setToken } from '@/utils/tokenManager';

type RegisterErrors = Partial<Record<'name' | 'email' | 'password', string>>;

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const validate = (): RegisterErrors => {
    const nextErrors: RegisterErrors = {};
    if (registerData.name.trim().length < 3)
      nextErrors.name = 'Name must be at least 3 characters.';
    if (!registerData.email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email))
      nextErrors.email = 'Enter a valid email address.';
    if (registerData.password.length < 6)
      nextErrors.password = 'Password must be at least 6 characters.';
    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await authService.register(registerData);
      if (response.success) {
        setToken(response.data.token);
        toast.success('Registration successful. You can now log in.');
        router.replace('/login');
      }
    } catch {
      toast.error('Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50/60 p-4 sm:p-6">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-96 rounded-full bg-orange-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 sm:p-10 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center pb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-extrabold text-lg shadow-md">
              v
            </span>
            <span className="text-2xl font-bold tracking-tight text-slate-900">vStore</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Create Your Account</h1>
          <p className="mt-1 text-xs text-slate-500">Join vStore for fast checkout and order tracking.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="register-name" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                id="register-name"
                placeholder="e.g. Chamreun Vira"
                onChange={handleChange}
                name="name"
                value={registerData.name}
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                aria-invalid={Boolean(errors.name)}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs font-medium text-rose-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="register-email" className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                id="register-email"
                placeholder="virachamreun@gmail.com"
                onChange={handleChange}
                name="email"
                value={registerData.email}
                type="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                aria-invalid={Boolean(errors.email)}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs font-medium text-rose-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="register-password"
              className="text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                id="register-password"
                onChange={handleChange}
                type="password"
                placeholder="At least 6 characters"
                name="password"
                value={registerData.password}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                aria-invalid={Boolean(errors.password)}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-rose-600" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full rounded-xl font-semibold shadow-md hover:shadow-lg mt-2 cursor-pointer gap-2"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="size-4" />
          </Button>

          <p className="pt-2 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-orange-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
