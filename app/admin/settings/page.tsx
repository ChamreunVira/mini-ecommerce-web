import { AccountSettings } from '@/components/AccountSettings';

const page = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your admin account.</p>
      </div>
      <AccountSettings />
    </div>
  );
};

export default page;
