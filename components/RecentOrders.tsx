import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import type { Order } from '@/types';

const statusBadgeVariants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'outline',
  paid: 'secondary',
  shipped: 'secondary',
  delivered: 'default',
  cancelled: 'destructive',
};

interface RecentOrdersProps {
  orders: Order[];
  isLoading: boolean;
  errorMessage: string | null;
}

const TableMessage = ({ message }: { message: string }) => (
  <TableRow>
    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
      {message}
    </TableCell>
  </TableRow>
);

export const RecentOrders = ({ orders, isLoading, errorMessage }: RecentOrdersProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="space-y-1.5">
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Latest orders placed in your store</CardDescription>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/dashboard/orders">View all</Link>
      </Button>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Items</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Payment</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableMessage message="Loading orders..." />}
          {!isLoading && errorMessage && <TableMessage message={errorMessage} />}
          {!isLoading && !errorMessage && orders.length === 0 && <TableMessage message="No orders yet." />}
          {!isLoading &&
            !errorMessage &&
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                    {order.order_number}
                  </Link>
                </TableCell>
                <TableCell>{order.address?.recipient_name ?? 'Guest'}</TableCell>
                <TableCell className="hidden md:table-cell">{order.items.length}</TableCell>
                <TableCell className="hidden md:table-cell">{formatOrderDate(order.created_at)}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariants[order.status] ?? 'outline'} className="capitalize">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden capitalize lg:table-cell">{order.payment?.status ?? 'Unpaid'}</TableCell>
                <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);
