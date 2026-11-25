'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft, Check, CreditCard, MapPin, Plus, ShieldCheck, ShoppingBag, X } from 'lucide-react';

import { AppContainer } from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContextProvider';
import { addressService } from '@/services/address-service';
import { orderService } from '@/services/order-service';
import { paymentService } from '@/services/payment-service';
import { Address, AddressPayload, CreatedPayment } from '@/types';
import { calculate } from '@/utils/calculate';
import { PaymentMethod, PaymentStatus } from '@/constant';
import { getProductImageUrl } from '@/lib/product';
import QrCodeModel from '@/components/QrCodeModel';
import BAKONG_LOGO from '@/public/assets/bakong.png';
import COD_LOGO from '@/public/assets/cod_icon.png';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.KHQR);
  const [payment, setPayment] = useState<CreatedPayment | null>(null);
  const [shippingAddress, setShippingAddress] = useState<AddressPayload>({
    recipient_name: '',
    phone: '',
    address_line: '',
    city: 'Phnom Penh',
    is_default: false,
  });
  const [isOpenQrModel, setIsOpenQrModel] = useState<boolean>(false);
  const [addressId, setAddressId] = useState<string>('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const router = useRouter();
  const { cart } = useAppContext();

  const fee = 0.0;
  const discount = 0.0;
  const subtotal = calculate(cart?.items || []);
  const total = subtotal + fee - discount;

  const stopTransactionPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleCheckTransction = (orderId: number, transactionId: string) => {
    stopTransactionPolling();
    const id = setInterval(async () => {
      try {
        const response = await paymentService.check(transactionId);
        if (response.success && response.data.status === PaymentStatus.PAID) {
          clearInterval(id);
          pollingRef.current = null;
          setIsOpenQrModel(false);
          router.push(`/checkout/${orderId}/success`);
        }
      } catch {
        console.log('Failed to poll check transaction.');
      }
    }, 5000);
    pollingRef.current = id;
  };

  const handleSubmitShippingAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await addressService.create(shippingAddress);
      if (response.success) {
        setAddressId(String(response.data.id));
        setIsAddressFormOpen(false);
        setShippingAddress({
          recipient_name: '',
          phone: '',
          address_line: '',
          city: 'Phnom Penh',
          is_default: false,
        });
        await fetchAddress();
        toast.success('Shipping address added.', { position: 'bottom-right' });
      }
    } catch {}
  };

  const onAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const fetchAddress = async () => {
    try {
      const response = await addressService.getAll();
      if (response.success) {
        setAddresses(response.data);
        setAddressId((current) => current || (response.data[0] ? String(response.data[0].id) : ''));
      }
    } catch {}
  };

  const handleSubmitOrder = async () => {
    if (!cart?.items.length) {
      toast.error('Your cart is empty. Add an item before checkout.', { position: 'bottom-right' });
      router.replace('/products');
      return;
    }

    if (!addressId) {
      toast.error('Please select or create a delivery address.', { position: 'bottom-right' });
      return;
    }

    try {
      const response = await orderService.create({ address_id: Number(addressId) });
      if (!response.success) return;

      toast.success('Order created successfully', { position: 'bottom-right' });

      if (paymentMethod === PaymentMethod.COD) {
        router.push(`/checkout/${response.data.id}/success`);
        return;
      }

      await handleCheckoutPayment(response.data.id);
    } catch {
      toast.error('Failed to create order. Please try again.');
    }
  };

  const handleCheckoutPayment = async (orderId: number) => {
    try {
      const response = await paymentService.create({
        order_id: orderId,
        method: PaymentMethod.KHQR,
      });

      if (response.success) {
        setPayment(response.data);
        setIsOpenQrModel(true);
        handleCheckTransction(orderId, response.data.transaction_id);
      }
    } catch {
      toast.error('Failed to generate payment QR. Please try again.');
    }
  };

  const handleCloseQrModel = () => {
    stopTransactionPolling();
    setIsOpenQrModel(false);
  };

  useEffect(() => {
    void fetchAddress();
    return () => {
      stopTransactionPolling();
    };
  }, []);

  return (
    <AppContainer className="my-8 sm:my-14">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#C8102E] transition-colors mb-2 cursor-pointer"
        >
          <ArrowLeft className="size-3.5" /> Back
        </button>
        <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#C8102E]">
          Order Checkout
        </span>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Complete Your Purchase
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Delivery Address & Cart Items */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          {/* Shipping Address Card */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-md space-y-5 transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-[#C8102E]">
                  <MapPin className="size-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Shipping Address</h2>
              </div>

              {!isAddressFormOpen && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddressFormOpen(true)}
                  className="rounded-lg text-xs gap-1.5 cursor-pointer transition-all duration-200 active:scale-95"
                >
                  <Plus className="size-3.5" /> New Address
                </Button>
              )}
            </div>

            {/* Address selector */}
            {!isAddressFormOpen ? (
              addresses.length > 0 ? (
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Select delivery destination:
                  </label>
                  <Select value={addressId} onValueChange={(val) => setAddressId(val)}>
                    <SelectTrigger className="w-full rounded-lg border-slate-200 py-3 text-sm focus:ring-[#C8102E]/20 transition-all">
                      <SelectValue placeholder="Choose an address" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      <SelectGroup>
                        {addresses.map((addr) => (
                          <SelectItem key={addr.id} value={String(addr.id)}>
                            <span className="font-medium text-slate-900">{addr.recipient_name}</span> &bull;{' '}
                            <span className="text-slate-500">{addr.address_line}, {addr.city}</span> ({addr.phone})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
                  <p className="text-sm text-slate-600">No saved address yet.</p>
                  <Button
                    size="sm"
                    onClick={() => setIsAddressFormOpen(true)}
                    className="mt-3 rounded-lg text-xs transition-all duration-200 active:scale-95"
                  >
                    Add Shipping Address
                  </Button>
                </div>
              )
            ) : (
              <form onSubmit={handleSubmitShippingAddress} className="rounded-lg border border-slate-100 bg-slate-50/50 p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <h3 className="text-sm font-bold text-slate-800">Add New Address</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddressFormOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Recipient Name *</label>
                    <input
                      name="recipient_name"
                      value={shippingAddress.recipient_name}
                      onChange={onAddressChange}
                      required
                      placeholder="e.g. Sok San"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#C8102E] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                    <input
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={onAddressChange}
                      required
                      placeholder="e.g. 012 345 678"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#C8102E] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Street Address *</label>
                  <input
                    name="address_line"
                    value={shippingAddress.address_line}
                    onChange={onAddressChange}
                    required
                    placeholder="e.g. St. 2004, Sangkat Teuk Thla"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#C8102E] focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">City / Province *</label>
                  <input
                    name="city"
                    value={shippingAddress.city}
                    onChange={onAddressChange}
                    required
                    placeholder="Phnom Penh"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#C8102E] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddressFormOpen(false)}
                    className="rounded-lg transition-all duration-200 active:scale-95"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="rounded-lg transition-all duration-200 active:scale-95">
                    Save Address
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Cart Items Review Card */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-md space-y-4 transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-[#C8102E]" />
                <h2 className="text-base font-bold text-slate-900">Review Items ({cart?.items.length || 0})</h2>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto no-scrollbar">
              {cart?.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-slate-50 p-1 flex items-center justify-center border border-slate-100">
                    <Image
                      width={56}
                      height={56}
                      src={getProductImageUrl(item.product.image)}
                      alt={item.product.name}
                      className="size-full object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-sm font-semibold text-slate-900">{item.product.name}</h4>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity} &times; ${Number(item.product.price).toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Method & Order Summary */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Payment Method Card */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-md space-y-4 transition-shadow hover:shadow-lg">
            <h2 className="text-base font-bold text-slate-900">Choose Payment Method</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.KHQR)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] ${
                  paymentMethod === PaymentMethod.KHQR
                    ? 'border-[#C8102E] bg-red-50/60 text-[#C8102E] ring-2 ring-[#C8102E]/20 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <Image className="w-9 h-auto object-contain" src={BAKONG_LOGO} alt="Bakong KHQR" />
                <div>
                  <span className="block text-sm">Bakong KHQR</span>
                  <span className="text-[11px] font-normal text-slate-500">Scan & pay instantly</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod(PaymentMethod.COD)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left font-semibold transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] ${
                  paymentMethod === PaymentMethod.COD
                    ? 'border-[#C8102E] bg-red-50/60 text-[#C8102E] ring-2 ring-[#C8102E]/20 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <Image className="w-9 h-auto object-contain" src={COD_LOGO} alt="Cash on Delivery" />
                <div>
                  <span className="block text-sm">Cash on Delivery</span>
                  <span className="text-[11px] font-normal text-slate-500">Pay at your door</span>
                </div>
              </button>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-md space-y-4 transition-shadow hover:shadow-lg">
            <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Delivery</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-extrabold text-slate-950">
                <span>Total</span>
                <span className="text-[#C8102E] text-xl">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleSubmitOrder}
              disabled={!cart?.items.length}
              size="lg"
              className="w-full rounded-lg py-3 font-semibold shadow-lg shadow-[#C8102E]/25 hover:shadow-[#C8102E]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 text-base"
            >
              Place Order &bull; ${total.toFixed(2)}
            </Button>

            <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>256-bit encrypted secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Bakong KHQR */}
      {isOpenQrModel && payment && (
        <QrCodeModel
          qrString={payment.qr_string}
          qrExpry={payment.qr_expiry}
          amount={total}
          currency="USD"
          onClose={handleCloseQrModel}
        />
      )}
    </AppContainer>
  );
};

export default CheckoutPage;
