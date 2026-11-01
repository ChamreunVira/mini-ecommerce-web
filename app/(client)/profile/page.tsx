'use client';

import { useEffect, useState } from 'react';
import { Check, Clock3, CreditCard, Home, MapPin, PackageCheck, ReceiptText, Truck, UserRound } from 'lucide-react';

import { AccountSettings } from '@/components/AccountSettings';
import { AppContainer } from '@/components/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatus } from '@/constant';
import { useAppContext } from '@/context/AppContextProvider';
import { getErrorMessage } from '@/lib/axios';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import { addressService } from '@/services/address-service';
import { orderService } from '@/services/order-service';
import type { Address, Order } from '@/types';

const PROFILE_TABS = [
  { value: 'orders', label: 'Order history' },
  { value: 'addresses', label: 'Shipping addresses' },
  { value: 'account', label: 'Account settings' },
] as const;

const TIMELINE_STEPS = [
  { status: OrderStatus.PENDING, label: 'Order placed', icon: ReceiptText },
  { status: OrderStatus.PROCESSING, label: 'Processing', icon: PackageCheck },
  { status: OrderStatus.COMFIRMED, label: 'Confirmed', icon: Check },
  { status: OrderStatus.SHIPPED, label: 'Shipped', icon: Truck },
  { status: OrderStatus.PAID, label: 'Completed', icon: CreditCard },
];

const TIMELINE_STATUS_ORDER = TIMELINE_STEPS.map((step) => step.status);

function getTimelineIndex(status: OrderStatus) {
  if (status === OrderStatus.CANCELLED) return -1;
  return TIMELINE_STATUS_ORDER.indexOf(status);
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/^./, (character) => character.toUpperCase());
}

interface AddressListProps {
  addresses: Address[];
  isLoading: boolean;
}

function AddressList({ addresses, isLoading }: AddressListProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading addresses...</p>;
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded border border-dashed px-4 py-6 text-center text-sm text-slate-500">
        <Home className="mx-auto mb-2 size-5" />
        No shipping addresses saved yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {addresses.map((address) => (
        <div key={address.id} className="rounded border bg-slate-50/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-slate-900">{address.recipient_name}</p>
              <p className="mt-1 text-sm text-slate-600">{address.phone}</p>
            </div>
            {address.is_default && (
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700">
                Default
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {address.address_line}
            <br />
            {address.city}
          </p>
        </div>
      ))}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const currentStep = getTimelineIndex(order.status);
  const isCancelled = order.status === OrderStatus.CANCELLED;

  return (
    <article className="rounded border bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-slate-950">{order.order_number}</p>
          <p className="mt-1 text-xs text-slate-500">Placed {formatOrderDate(order.created_at)}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-semibold text-slate-950">{formatCurrency(order.total)}</p>
          <p className={`mt-1 text-xs font-medium ${isCancelled ? 'text-rose-600' : 'text-indigo-600'}`}>
            {formatStatus(order.status)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <p className="flex gap-2">
          <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <span>
            {order.address?.address_line ?? 'Shipping address unavailable'}
            {order.address?.city ? `, ${order.address.city}` : ''}
          </span>
        </p>
        <p className="flex gap-2">
          <ReceiptText size={16} className="mt-0.5 shrink-0 text-slate-400" />
          <span>
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </span>
        </p>
      </div>

      <div className="mt-6 grid grid-cols-5 gap-1">
        {TIMELINE_STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isComplete = !isCancelled && currentStep >= index;

          return (
            <div key={step.status} className="relative text-center">
              {index > 0 && (
                <span
                  className={`absolute left-[-50%] right-[50%] top-3 h-px ${
                    isComplete ? 'bg-indigo-500' : 'bg-slate-200'
                  }`}
                />
              )}
              <span
                className={`relative mx-auto flex size-6 items-center justify-center rounded-full border ${
                  isComplete ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-400'
                }`}
              >
                <StepIcon size={12} />
              </span>
              <span
                className={`mt-2 block text-[10px] leading-4 sm:text-xs ${
                  isComplete ? 'font-medium text-slate-800' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

interface OrderHistoryProps {
  orders: Order[];
  isLoading: boolean;
}

function OrderHistory({ orders, isLoading }: OrderHistoryProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading order history...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded border border-dashed px-4 py-10 text-center text-sm text-slate-500">
        Your order history will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAppContext();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [addressResult, orderResult] = await Promise.allSettled([
          addressService.getAll(),
          orderService.getUserOrder({ page: 1, limit: 50, sortBy: 'updated_at', direction: 'desc' }),
        ]);

        if (!isActive) return;

        const messages: string[] = [];

        if (addressResult.status === 'fulfilled') {
          setAddresses(Array.isArray(addressResult.value.data) ? addressResult.value.data : []);
        } else {
          messages.push(getErrorMessage(addressResult.reason, 'We could not load your addresses.'));
        }

        if (orderResult.status === 'fulfilled') {
          setOrders(Array.isArray(orderResult.value.data) ? orderResult.value.data : []);
        } else {
          setOrders([]);
          messages.push(getErrorMessage(orderResult.reason, 'We could not load your order history.'));
        }

        setErrorMessage(messages.length > 0 ? messages.join(' ') : null);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="min-h-[70vh] bg-slate-50/60 py-10 sm:py-14">
      <AppContainer>
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-600">Your account</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Profile</h1>
            <p className="mt-2 text-sm text-slate-500">Keep your delivery details close and follow every order.</p>
          </div>
          {user && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                <UserRound size={17} />
              </span>
              <span>
                <strong className="block font-medium text-slate-900">{user.name}</strong>
                {user.email}
              </span>
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="mb-6 rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </p>
        )}

        <Tabs defaultValue="orders" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <TabsList className="flex h-auto! w-full justify-start gap-1 overflow-x-auto rounded-lg border bg-white p-1 lg:sticky lg:top-20 lg:col-start-2 lg:row-start-1 lg:flex-col! lg:items-stretch lg:self-start lg:overflow-visible">
            {PROFILE_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="h-9 flex-1 px-3 text-sm text-slate-600 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none! lg:h-10 lg:flex-none lg:justify-start"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <TabsContent value="orders">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Clock3 size={18} className="text-indigo-600" /> Order history
                  </CardTitle>
                  <CardDescription>See when each order was placed and how it is progressing.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <OrderHistory orders={orders} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin size={18} className="text-indigo-600" /> Shipping addresses
                  </CardTitle>
                  <CardDescription>Saved addresses available at checkout.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <AddressList addresses={addresses} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <AccountSettings />
            </TabsContent>
          </div>
        </Tabs>
      </AppContainer>
    </main>
  );
}
