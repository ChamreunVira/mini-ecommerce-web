'use client';

import { useAppContext } from '@/context/AppContextProvider';
import { getErrorMessage } from '@/lib/axios';
import { authService } from '@/services/auth-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';

export function AccountSettings() {
  const { user, updateUser } = useAppContext();
  const [name, setName] = useState(user?.name ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setProfileMessage(null);
    setIsSavingProfile(true);
    try {
      const response = await authService.updateProfile({ name: name.trim() });
      if (response.success) {
        updateUser(response.data);
        setProfileMessage('Username updated successfully.');
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to update your username.'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setPasswordMessage(null);
    if (password !== passwordConfirmation) {
      setErrorMessage('New passwords do not match.');
      return;
    }
    setIsSavingPassword(true);
    try {
      const response = await authService.updatePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      if (response.success) {
        setCurrentPassword('');
        setPassword('');
        setPasswordConfirmation('');
        setPasswordMessage('Password updated successfully.');
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to update your password.'));
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {/* Username Card */}
      <Card className="rounded-md border-0">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-50 text-[#C8102E]">
              <UserRound size={14} />
            </span>
            Username
          </CardTitle>
          <CardDescription>Update the name shown on your account.</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="account-name" className="text-xs font-semibold text-slate-700">
                Full Name
              </Label>
              <Input
                id="account-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={3}
                className="rounded-md border-slate-200 focus-visible:ring-[#C8102E]/20 focus-visible:border-[#C8102E]"
              />
            </div>
            <p className="text-xs text-slate-400">
              Email: <span className="font-medium text-slate-600">{user?.email}</span>
            </p>
            <Button type="submit" disabled={isSavingProfile} className="rounded-md">
              {isSavingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
            {profileMessage && <p className="text-xs text-emerald-600 font-medium">{profileMessage}</p>}
          </form>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card className="rounded-md">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-50 text-[#C8102E]">
              <KeyRound size={14} />
            </span>
            Password
          </CardTitle>
          <CardDescription>Use your current password to set a new one.</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password" className="text-xs font-semibold text-slate-700">
                Current Password
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                className="rounded-md border-slate-200 focus-visible:ring-[#C8102E]/20 focus-visible:border-[#C8102E]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-xs font-semibold text-slate-700">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
                className="rounded-md border-slate-200 focus-visible:ring-[#C8102E]/20 focus-visible:border-[#C8102E]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-xs font-semibold text-slate-700">
                Confirm New Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
                minLength={6}
                required
                className="rounded-md border-slate-200 focus-visible:ring-[#C8102E]/20 focus-visible:border-[#C8102E]"
              />
            </div>
            <Button type="submit" disabled={isSavingPassword} className="rounded-md">
              {isSavingPassword ? 'Saving...' : 'Change Password'}
            </Button>
            {passwordMessage && <p className="text-xs text-emerald-600 font-medium">{passwordMessage}</p>}
          </form>
        </CardContent>
      </Card>

      {errorMessage && (
        <p
          className="text-sm text-rose-600 lg:col-span-2 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </section>
  );
}
