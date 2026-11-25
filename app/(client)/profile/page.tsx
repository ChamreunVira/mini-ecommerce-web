'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  CreditCard,
  ExternalLink,
  Home,
  LogOut,
  MapPin,
  Package,
  PackageCheck,
  Printer,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from 'lucide-react';

import { AccountSettings } from '@/components/AccountSettings';
import { AppContainer } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PrintInvoiceDialog } from '@/components/PrintInvoiceDialog';
import { OrderStatus } from '@/constant';
import { useAppContext } from '@/context/AppContextProvider';
import { getErrorMessage } from '@/lib/axios';
import { formatCurrency, formatOrderDate } from '@/lib/format';
import { addressService } from '@/services/address-service';
import { orderService } from '@/services/order-service';
import type { Address, Order, PaginationMeta } from '@/types';

type ProfileTab = 'orders' | 'addresses' | 'account';

const PROFILE_TABS = [
  { value: 'orders' as ProfileTab, label: 'Order History', icon: Clock3 },
  { value: 'addresses' as ProfileTab, label: 'Shipping Addresses', icon: MapPin },
  { value: 'account' as ProfileTab, label: 'Account Settings', icon: UserRound },
];

const TIMELINE_STEPS = [
  { status: OrderStatus.PENDING, label: 'Placed', icon: ReceiptText },
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
  return status.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
}

const statusBadgeClasses: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  confirmed: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  shipped: 'bg-orange-50 text-orange-700 border-orange-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const PAGE_SIZE = 5;

// ── Saved Addresses Sub-component ──
interface AddressListProps {
  addresses: Address[];
  isLoading: boolean;
}

function AddressList({ addresses, isLoading }: AddressListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-28 rounded-sm bg-slate-100 animate-pulse border border-slate-200" />
        <div className="h-28 rounded-sm bg-slate-100 animate-pulse border border-slate-200" />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-500">
        <Home className="mx-auto mb-2 size-6 text-slate-400" />
        <p className="font-medium text-slate-700">No saved addresses yet</p>
        <p className="text-xs text-slate-400 mt-0.5">Shipping addresses will be automatically saved during checkout.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="rounded-sm border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 shadow-none"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-sm bg-slate-100 text-slate-600">
                <MapPin className="size-3.5" />
              </div>
              <p className="text-sm font-semibold text-slate-900">{address.recipient_name}</p>
            </div>
            {address.is_default && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">
                Default
              </span>
            )}
          </div>
          <p className="mt-2.5 text-xs text-slate-600 leading-relaxed pl-9">
            {address.address_line}, <span className="font-medium text-slate-800">{address.city}</span>
          </p>
          <p className="mt-1 text-xs text-slate-400 pl-9 tabular-nums font-mono">{address.phone}</p>
        </div>
      ))}
    </div>
  );
}

// ── Collapsible Order Card ──
interface CollapsibleOrderCardProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  onPrint: (order: Order) => void;
}

function CollapsibleOrderCard({ order, isExpanded, onToggle, onPrint }: CollapsibleOrderCardProps) {
  const currentStep = getTimelineIndex(order.status);
  const isCancelled = order.status === OrderStatus.CANCELLED;
  const badgeClass = statusBadgeClasses[order.status.toLowerCase()] ?? 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <article className="rounded-sm border border-slate-200 bg-white shadow-none transition-all">
      {/* ── Collapsed Header (Clickable) ── */}
      <div
        onClick={onToggle}
        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-slate-50/70 transition-colors select-none"
      >
        {/* Left: Order # & Date */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-slate-100 text-slate-600">
            <Package className="size-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Order</span>
              <span className="font-bold text-slate-950 text-sm tabular-nums hover:text-[#C8102E] transition-colors">
                {order.order_number}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Placed on {formatOrderDate(order.created_at)}</p>
          </div>
        </div>

        {/* Middle: Quick Preview info */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="size-3.5 text-slate-400" />
            <span>
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </span>
          </span>
          {order.address?.city && (
            <span className="flex items-center gap-1.5 truncate max-w-[150px]">
              <MapPin className="size-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{order.address.city}</span>
            </span>
          )}
        </div>

        {/* Right: Total, Status Badge & Collapse Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <p className="text-sm font-extrabold text-slate-950 tabular-nums">{formatCurrency(order.total)}</p>
            <span
              className={`inline-block mt-0.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold capitalize ${badgeClass}`}
            >
              {formatStatus(order.status)}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-label={isExpanded ? `Collapse order ${order.order_number}` : `Expand order ${order.order_number}`}
            className="rounded-sm shadow-none h-8 px-2.5 gap-1 text-xs text-slate-700 hover:text-[#C8102E] transition-colors"
          >
            <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'Details'}</span>
            {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </Button>
        </div>
      </div>

      {/* ── Expanded Content Panel ── */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50/40 p-4 sm:p-5 space-y-5 animate-in fade-in-50 duration-200">
          {/* Progress Timeline */}
          {!isCancelled && (
            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-none">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Delivery Tracking</p>
              <div className="relative flex items-start justify-between">
                <div className="absolute top-3.5 left-4 right-4 h-px bg-slate-200 z-0" />
                {TIMELINE_STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isPast = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.status} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`flex size-7 items-center justify-center rounded-full border transition-colors ${
                          isCurrent
                            ? 'border-[#C8102E] bg-[#C8102E] text-white ring-2 ring-[#C8102E]/20'
                            : isPast
                              ? 'border-[#C8102E]/40 bg-red-50 text-[#C8102E]'
                              : 'border-slate-200 bg-white text-slate-300'
                        }`}
                      >
                        <Icon className="size-3.5" />
                      </div>
                      <span
                        className={`mt-1.5 text-[10px] sm:text-[11px] text-center ${
                          isCurrent
                            ? 'font-bold text-[#C8102E]'
                            : isPast
                              ? 'font-medium text-slate-700'
                              : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="rounded-sm border border-slate-200 bg-white overflow-hidden shadow-none">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Items in Order ({order.items.length})
              </span>
              <span className="text-xs text-slate-400">Unit Price &bull; Subtotal</span>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3.5 gap-3 hover:bg-slate-50/50">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.product_id}`}
                      className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#C8102E] transition-colors flex items-center gap-1.5 truncate"
                    >
                      <span className="truncate">{item.product_name}</span>
                      <ExternalLink className="size-3 shrink-0 text-slate-400" />
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Quantity: <span className="font-semibold text-slate-800">{item.quantity}</span> &times;{' '}
                      {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details 2-Column: Delivery Address & Summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Delivery Destination */}
            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-none">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                <MapPin className="size-3.5 text-[#C8102E]" />
                Shipping Destination
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                {order.address?.recipient_name ?? 'Recipient unavailable'}
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {order.address?.address_line ?? 'Address not recorded'}
                {order.address?.city ? `, ${order.address.city}` : ''}
              </p>
              <p className="text-xs text-slate-400 mt-1 tabular-nums font-mono">
                Phone: {order.address?.phone ?? 'N/A'}
              </p>
            </div>

            {/* Payment & Price Summary */}
            <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-none flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  <CreditCard className="size-3.5 text-[#C8102E]" />
                  Payment & Charges
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Method</span>
                    <span className="font-semibold uppercase text-slate-800">{order.payment?.method ?? 'Pending'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-medium">Free</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2.5 mt-2.5 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">Total Paid</span>
                <span className="text-sm sm:text-base font-extrabold text-[#C8102E] tabular-nums">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPrint(order)}
              className="rounded-sm shadow-none text-xs gap-1.5 text-slate-700 hover:text-[#C8102E]"
            >
              <Printer className="size-3.5" />
              Print Invoice
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="rounded-sm text-xs text-slate-500 hover:text-slate-800 gap-1 ml-auto"
            >
              <span>Collapse Order</span>
              <ChevronUp className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}

// ── Profile Page Main Component ──
export default function ProfilePage() {
  const { user, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pagination state for orders
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    limit: PAGE_SIZE,
    total: 0,
    last_page: 1,
    has_more_pages: false,
  });

  // Collapsible state (Set of expanded order IDs)
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<number>>(new Set());

  // Invoice modal state
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);

  // Load addresses once
  useEffect(() => {
    let isActive = true;
    addressService
      .getAll()
      .then((res) => {
        if (isActive && res && res.success) {
          setAddresses(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, []);

  // Load orders when page changes
  const fetchOrders = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await orderService.getUserOrder({
        page: targetPage,
        limit: PAGE_SIZE,
        sortBy: 'created_at',
        direction: 'desc',
      });

      if (response && response.success) {
        const orderData = Array.isArray(response.data) ? response.data : [];
        setOrders(orderData);

        if (response.meta) {
          setPagination(response.meta);
        } else {
          // Fallback pagination if API returns unpaginated payload
          setPagination({
            current_page: targetPage,
            limit: PAGE_SIZE,
            total: orderData.length,
            last_page: Math.max(1, Math.ceil(orderData.length / PAGE_SIZE)),
            has_more_pages: targetPage < Math.ceil(orderData.length / PAGE_SIZE),
          });
        }
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
      setErrorMessage(getErrorMessage(error, 'Could not load your orders.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders(page);
  }, [fetchOrders, page]);

  // Toggle order expanded
  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  // Toggle all expand/collapse
  const allExpanded = orders.length > 0 && orders.every((o) => expandedOrderIds.has(o.id));
  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedOrderIds(new Set());
    } else {
      setExpandedOrderIds(new Set(orders.map((o) => o.id)));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.last_page || newPage === page) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const initials =
    user?.name
      ?.split(' ')
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join('') ?? '?';

  const totalSpent = useMemo(() => {
    return orders.filter((o) => o.status === OrderStatus.PAID).reduce((sum, o) => sum + Number(o.total || 0), 0);
  }, [orders]);

  return (
    <main className="min-h-[80vh] bg-slate-50/60 py-8 sm:py-12">
      <AppContainer>
        {/* Breadcrumb / Top Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/" className="hover:text-[#C8102E] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-slate-900">Account Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl mt-1">Customer Portal</h1>
          </div>

          {/* Quick Account Badge */}
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-sm">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Verified Account</span>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-none"
          >
            {errorMessage}
          </div>
        )}

        {/* ── Traditional Dashboard Layout: Left Sidebar + Right Content Workspace ── */}
        <div className="grid gap-6 lg:grid-cols-[17rem_1fr] items-start">
          {/* ── LEFT SIDEBAR: User Profile Card & Navigation Menu ── */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            {/* User Profile Card */}
            <div className="rounded-sm border border-slate-200 bg-white p-5 shadow-none text-center">
              <div className="relative mx-auto size-16 flex items-center justify-center rounded-sm bg-[#C8102E] text-white text-xl font-extrabold select-none mb-3">
                {initials}
                <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                  <Check className="size-2.5 text-white" strokeWidth={3} />
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 truncate">{user?.name ?? 'Customer'}</h2>
              <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>

              {/* Quick Summary Pill Bar */}
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-center">
                <div className="rounded-sm bg-slate-50 p-2 border border-slate-100">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Total Orders</span>
                  <p className="text-base font-extrabold text-slate-900 tabular-nums">{pagination.total}</p>
                </div>
                <div className="rounded-sm bg-slate-50 p-2 border border-slate-100">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Addresses</span>
                  <p className="text-base font-extrabold text-slate-900 tabular-nums">{addresses.length}</p>
                </div>
              </div>
            </div>

            {/* Traditional Vertical Navigation Menu */}
            <nav className="rounded-sm border border-slate-200 bg-white p-2 shadow-none space-y-1">
              {PROFILE_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#C8102E] text-white shadow-none'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.value === 'orders' && (
                      <span
                        className={`text-[11px] px-2 py-0.2 rounded-sm font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {pagination.total}
                      </span>
                    )}
                    {tab.value === 'addresses' && (
                      <span
                        className={`text-[11px] px-2 py-0.2 rounded-sm font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {addresses.length}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs sm:text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="size-4 shrink-0" />
                  <span>Log Out</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* ── RIGHT MAIN WORKSPACE: Tab Content Panels ── */}
          <section className="min-w-0 space-y-6">
            {/* Tab 1: Orders with Collapsible Cards & Pagination */}
            {activeTab === 'orders' && (
              <Card className="rounded-sm border-slate-200 bg-white shadow-none">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Clock3 className="size-4.5 text-[#C8102E]" />
                        Order History
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 mt-0.5">
                        Expand any order to track delivery status, view ordered items, and review totals.
                      </CardDescription>
                    </div>

                    {orders.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={toggleExpandAll}
                          className="rounded-sm shadow-none text-xs gap-1.5 h-8 text-slate-700"
                        >
                          {allExpanded ? (
                            <>
                              <ChevronUp className="size-3.5" /> Collapse All
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-3.5" /> Expand All
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-5 space-y-4">
                  {/* Order Cards List */}
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-sm bg-slate-100 animate-pulse border border-slate-200" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="rounded-sm border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center text-sm text-slate-500">
                      <ReceiptText className="mx-auto mb-2 size-8 text-slate-300" />
                      <p className="font-semibold text-slate-800">You haven&apos;t placed any orders yet</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        Explore our catalog of gadgets, upgrade essentials, and tech accessories.
                      </p>
                      <Button asChild size="sm" className="mt-4 rounded-sm shadow-none">
                        <Link href="/products">Browse Catalog</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <CollapsibleOrderCard
                          key={order.id}
                          order={order}
                          isExpanded={expandedOrderIds.has(order.id)}
                          onToggle={() => toggleOrderExpand(order.id)}
                          onPrint={(o) => setOrderToPrint(o)}
                        />
                      ))}
                    </div>
                  )}

                  {/* ── Pagination Controls Bar ── */}
                  {!isLoading && pagination.total > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs text-slate-500">
                      <div>
                        Showing{' '}
                        <span className="font-semibold text-slate-800">{(page - 1) * pagination.limit + 1}</span> to{' '}
                        <span className="font-semibold text-slate-800">
                          {Math.min(page * pagination.limit, pagination.total)}
                        </span>{' '}
                        of <span className="font-semibold text-slate-800">{pagination.total}</span> orders
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page <= 1}
                          onClick={() => handlePageChange(page - 1)}
                          className="rounded-sm shadow-none h-8 px-3 text-xs"
                        >
                          Previous
                        </Button>

                        {/* Page Numbers */}
                        {Array.from({ length: pagination.last_page }).map((_, i) => {
                          const pageNum = i + 1;
                          const isCurrent = pageNum === page;

                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => handlePageChange(pageNum)}
                              className={`size-8 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
                                isCurrent
                                  ? 'bg-[#C8102E] text-white shadow-none'
                                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page >= pagination.last_page}
                          onClick={() => handlePageChange(page + 1)}
                          className="rounded-sm shadow-none h-8 px-3 text-xs"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tab 2: Saved Shipping Addresses */}
            {activeTab === 'addresses' && (
              <Card className="rounded-sm border-slate-200 bg-white shadow-none">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="size-4.5 text-[#C8102E]" />
                    Saved Shipping Addresses
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Your saved delivery locations available for single-click checkout.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-5">
                  <AddressList addresses={addresses} isLoading={false} />
                </CardContent>
              </Card>
            )}

            {/* Tab 3: Account & Password Settings */}
            {activeTab === 'account' && (
              <Card className="rounded-sm border-slate-200 bg-white shadow-none">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <UserRound className="size-4.5 text-[#C8102E]" />
                    Account Settings
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Update your account username and security credentials.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-5">
                  <AccountSettings />
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </AppContainer>

      {/* Invoice Print Dialog */}
      <PrintInvoiceDialog order={orderToPrint} onClose={() => setOrderToPrint(null)} />
    </main>
  );
}
