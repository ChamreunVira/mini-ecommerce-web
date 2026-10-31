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
    <section className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound size={18} /> Username
          </CardTitle>
          <CardDescription>Update the name shown on your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account-name">Name</Label>
              <Input
                id="account-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={3}
              />
            </div>
            <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
            <Button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving...' : 'Save name'}
            </Button>
            {profileMessage && <p className="text-sm text-emerald-600">{profileMessage}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound size={18} /> Password
          </CardTitle>
          <CardDescription>Use your current password to set a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
                minLength={6}
                required
              />
            </div>
            <Button type="submit" disabled={isSavingPassword}>
              {isSavingPassword ? 'Saving...' : 'Change password'}
            </Button>
            {passwordMessage && <p className="text-sm text-emerald-600">{passwordMessage}</p>}
          </form>
        </CardContent>
      </Card>
      {errorMessage && (
        <p className="text-sm text-rose-600 lg:col-span-2" role="alert">
          {errorMessage}
        </p>
      )}
    </section>
  );
}
