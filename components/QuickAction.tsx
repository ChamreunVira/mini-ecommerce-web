import Link from 'next/link';
import { CreditCard, FolderPlus, PackagePlus, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const quickActions = [
  { label: 'Add Product', href: '/admin/products/new', icon: PackagePlus },
  { label: 'Add Category', href: '/admin/categories/new', icon: FolderPlus },
  { label: 'View Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'View Payments', href: '/admin/payments', icon: CreditCard },
];

export const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {quickActions.map(({ label, href, icon: Icon }) => (
        <Button key={href} variant="outline" className="h-auto justify-start gap-3 py-3 rounded" asChild>
          <Link href={href}>
            <Icon className="size-4" />
            {label}
          </Link>
        </Button>
      ))}
    </CardContent>
  </Card>
);
