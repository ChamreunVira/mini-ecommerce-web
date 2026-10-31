'use client';
import { AppContainer } from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContextProvider';
import { addressService } from '@/services/address-service';
import { orderService } from '@/services/order-service';
import { Address, AddressPayload, CreatedPayment } from '@/types';
import { calculate } from '@/utils/calculate';
import BAKONG_LOGO from '@/public/assets/bakong.png';
import COD_LOGO from '@/public/assets/cod_icon.png';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import QrCodeModel from '@/components/QrCodeModel';
import { paymentService } from '@/services/payment-service';
import { PaymentMethod, PaymentStatus } from '@/constant';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.KHQR);
  const [payment, SetPayment] = useState<CreatedPayment | null>(null);
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

  const router = useRouter();

  const { cart } = useAppContext();

  const fee = 0.0;
  const discount = 0.0;
  const subtotal = calculate(cart?.items || []);
  const total = subtotal + fee - discount;

  const handleCheckTransction = () => {
    const id = setInterval(async () => {
      try {
        const response = await paymentService.check(payment!.transaction_id);
        if (response.success && response.data.status === PaymentStatus.PAID) {
          clearInterval(id);
          setIsOpenQrModel(false);
          router.push(`/${response.data.transaction_id}`);
        }
      } catch {
        console.log('Failed to pooling check transaction.');
      }
    }, 5000);
  };

  const handleSubmitShippingAddress = async (e: React.SubmitEvent) => {
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
    setShippingAddress((prev) => {
      return { ...prev, [name]: value };
    });
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
    if (!addressId) {
      toast.error('Please select or create a delivery address.', { position: 'bottom-right' });
      return;
    }

    const response = await orderService.create({ address_id: Number(addressId) });
    if (response.success) {
      handleCheckout(response.data.id);
      toast.success('Order created successfully', {
        position: 'bottom-right',
      });
    }
    try {
    } catch {}
  };

  const handleCheckout = async (orderId: number) => {
    try {
      const response = await paymentService.create({ order_id: orderId, method: paymentMethod });
      if (response.success) {
        SetPayment(response.data);
        handleCheckTransction();
        setIsOpenQrModel(true);
      }
    } catch {}
  };

  useEffect(() => {
    void fetchAddress();
  }, []);

  return (
    <AppContainer className="my-6 w-full pb-12 sm:my-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-indigo-600">Order checkout</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">Complete your order</h1>
        </div>
        <Button type="button" variant="ghost" onClick={() => router.back()} className="shrink-0">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to cart</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* select shipping address */}
          <div className="rounded-md border bg-white px-4 py-5 sm:px-8">
            <SectionHeading title="Dilivery Address">
              {addresses.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddressFormOpen((isOpen) => !isOpen)}
                >
                  {isAddressFormOpen ? <X size={15} /> : <Plus size={15} />}
                  {isAddressFormOpen ? 'Cancel' : 'Add address'}
                </Button>
              )}
            </SectionHeading>
            <div className="mt-4">
              {addresses.length > 0 && !isAddressFormOpen ? (
                <Select value={addressId} onValueChange={setAddressId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Dilevery Address" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {addresses.map((addr) => (
                        <SelectItem key={addr.id} value={String(addr.id)}>
                          {addr.address_line}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <form onSubmit={handleSubmitShippingAddress}>
                  <div className="mt-4 grid items-center gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="recipient_name">
                        Recipient Name <span className="text-rose-500 font-semibold">*</span>
                      </label>
                      <input
                        name="recipient_name"
                        id="recipient_name"
                        value={shippingAddress.recipient_name}
                        onChange={onAddressChange}
                        type="text"
                        className="w-full"
                        placeholder="Chamreun Vira"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone">
                        Phone
                        <span className="text-rose-500 font-semibold">*</span>
                      </label>
                      <input
                        name="phone"
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={onAddressChange}
                        type="text"
                        className="w-full"
                        placeholder="0973056747"
                      />
                    </div>

                    <div>
                      <label htmlFor="address_line">
                        Address Line <span className="text-rose-500 font-semibold">*</span>
                      </label>
                      <input
                        name="address_line"
                        id="address_line"
                        value={shippingAddress.address_line}
                        onChange={onAddressChange}
                        type="text"
                        className="w-full"
                        placeholder="#261, Bueng Salange, Toul Kouk, Phnom Penh"
                      />
                    </div>

                    <div>
                      <label htmlFor="city">
                        City
                        <span className="text-rose-500 font-semibold">*</span>
                      </label>
                      <input
                        name="city"
                        id="city"
                        value={shippingAddress.city}
                        onChange={onAddressChange}
                        type="text"
                        className="w-full"
                        placeholder="Phnom Penh"
                      />
                    </div>

                    <div>
                      <Button type="submit" className="px-8 mt-4">
                        Create
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          {/* list of cart items */}
          <div className="rounded border bg-white px-4 py-5 sm:px-8">
            <div className="flex items-center gap-2">
              <SectionHeading title="Your Items" />
              <h1 className="text-[16px]">({cart?.items.length || 0})</h1>
            </div>
            <div className="mt-4 flex max-h-80 flex-col gap-2 overflow-y-auto scrollbar-thumb-transparent">
              {cart &&
                cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded border px-3 py-2">
                    <Image
                      width={50}
                      height={50}
                      src={`http://localhost:8000/storage/${item.product.image}`}
                      alt={item.product.name}
                      unoptimized
                    />
                    <div>
                      <h2 className="font-medium">{item.product.name}</h2>
                      <p className="text-[16px] font-medium text-rose-500">${item.product.price}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex h-fit flex-col gap-6 lg:sticky lg:top-24 [&>div]:rounded-md [&>div]:border [&>div]:bg-white [&>div]:px-4 [&>div]:py-5 sm:[&>div]:px-8">
          {/* payment method */}
          <div className="w-full">
            <SectionHeading title="Payment Method" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setPaymentMethod(PaymentMethod.KHQR)}
                className={`flex items-center gap-3 rounded border px-3 py-3 text-left font-medium ${paymentMethod === PaymentMethod.KHQR ? 'border-indigo-500 text-indigo-500' : 'border-slate-200'}`}
              >
                <Image className="w-10" src={BAKONG_LOGO} alt="khqr_bakong_logo" />
                KHQR
              </button>
              <button
                onClick={() => setPaymentMethod(PaymentMethod.COD)}
                className={`flex items-center gap-3 rounded border px-3 py-3 text-left font-medium ${paymentMethod === PaymentMethod.COD ? 'border-indigo-500 text-indigo-500' : 'border-slate-200'}`}
              >
                <Image className="w-10" src={COD_LOGO} alt="khqr_bakong_logo" />
                COD
              </button>
            </div>
          </div>
          {/* promote code */}
          <div>
            <SectionHeading title="Coupon Code" />
            <div className="mt-4">
              <p>Comming Soon!</p>
            </div>
          </div>
          {/* order summary */}
          <div className="mt-4">
            <SectionHeading title="Order Summary" />
            <div className="mt-4 flex flex-col space-y-1 *:flex *:justify-between *:items-center">
              <div>
                <h2>Subtotal</h2>
                <h2>${subtotal.toFixed(2)}</h2>
              </div>
              <div>
                <h2>Shipping Fee</h2>
                <h2>-${fee}</h2>
              </div>
              <div className="*:text-emerald-600">
                <h2>Coupon Applied</h2>
                <h2>${discount}</h2>
              </div>
              <hr className="my-2" />
              <div className="*:font-medium">
                <h2 className="font-medium">Total</h2>
                <h2 className="font-medium text-black">${total.toFixed(2)}</h2>
              </div>
            </div>
            <Button onClick={handleSubmitOrder} className="mt-4 h-11 w-full font-medium text-[16px]">
              <p>Checkout</p>
            </Button>
          </div>
        </div>
      </div>
      {isOpenQrModel && (
        <QrCodeModel
          qrString={payment!.qr_string}
          qrExpry={payment!.qr_expiry}
          amount={total}
          currency="USD"
          onClose={() => setIsOpenQrModel(false)}
        />
      )}
    </AppContainer>
  );
};

export default CheckoutPage;
