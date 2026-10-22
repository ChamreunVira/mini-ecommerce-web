'use client';
import { AppContainer } from '@/components/Container';
import SectionHeading from '@/components/SectionHeading';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContextProvider';
import { addressService } from '@/services/address-service';
import { Address, AddressPayload } from '@/types';
import { calculate } from '@/utils/calculate';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type PaymentMethodType = 'khqr' | 'cod';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('khqr');
  const [shippingAddress, setShippingAddress] = useState<AddressPayload>({
    recipient_name: '',
    phone: '',
    address_line: '',
    city: 'Phnom Penh',
    is_default: false,
  });
  const [addresses, setAddresses] = useState<Address[]>([]);

  const { cart } = useAppContext();

  const fee = 0.0;
  const discount = 0.0;
  const subtotal = calculate(cart?.items || []);
  const total = subtotal + fee - discount;

  const handleSubmitShippingAddress = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const response = await addressService.create(shippingAddress);
      if (response.success) {
        fetchAddress();
      }
    } catch (error: any) {}
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
      }
    } catch (error: any) {}
  };

  useEffect(() => {
    void fetchAddress();
  }, []);

  return (
    <AppContainer className="w-full h-[70vh] my-14">
      <div className="grid grid-cols-[2fr_1fr] space-x-8">
        <div className="flex flex-col space-y-8">
          {/* select shipping address */}
          <div className="rounded-md border px-8 py-4">
            <SectionHeading title="Dilivery Address" />
            <div className="mt-4">
              {addresses.length > 0 ? (
                <div>
                  <select>
                    {addresses.map((addr) => (
                      <option key={addr.id}>{addr.address_line}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <form onSubmit={handleSubmitShippingAddress}>
                  <div className="grid gap-4 items-center grid-cols-2 mt-4">
                    <div>
                      <label htmlFor="">
                        Recipient Name <span className="text-rose-500 font-semibold">*</span>
                      </label>
                      <input
                        name="recipient_name"
                        value={shippingAddress.recipient_name}
                        onChange={onAddressChange}
                        type="text"
                        className="w-full"
                        placeholder="Chamreun Vira"
                      />
                    </div>

                    <div>
                      <label htmlFor="">
                        Phone
                        <span className="text-rose-500 font-semibold">*</span>
                      </label>
                      <input
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={onAddressChange}
                        type="text"
                        className="w-full"
                        placeholder="0973056747"
                      />
                    </div>

                    <div>
                      <label htmlFor="">
                        Address Line <span className="text-rose-500 font-semibold">*</span>
                      </label>
                      <input
                        name="address_line"
                        value={shippingAddress.address_line}
                        onChange={onAddressChange}
                        type="text"
                        className="w-full"
                        placeholder="#261, Bueng Salange, Toul Kouk, Phnom Penh"
                      />
                    </div>

                    <div>
                      <label htmlFor="">
                        City
                        <span className="text-rose-500 font-semibold">*</span>
                      </label>
                      <input
                        name="city"
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
          <div className="px-8 py-4 border rounded">
            <div className="flex items-center space-x-2">
              <SectionHeading title="Your Items" />
              <h1 className="text-[16px]">({cart?.items.length || 0})</h1>
            </div>
            <div className="flex flex-col gap-2 mt-4 max-h-80 overflow-y-scroll scrollbar-thumb-transparent">
              {cart &&
                cart.items.map((item) => (
                  <div key={item.id} className="px-3 py-2 flex space-x-2 border rounded">
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
        <div className="h-fit flex flex-col space-y-8 *:border *:px-8 *:py-4">
          {/* payment method */}
          <div className="w-full">
            <SectionHeading title="Payment Method" />
            <div className="mt-4 flex space-x-4 *:px-8 *:py-3 *:border *:cursor-pointer">
              <button
                onClick={() => setPaymentMethod('khqr')}
                className={`font-medium text-xl ${paymentMethod === 'khqr' && 'border-indigo-500 text-indigo-500'}`}
              >
                ABA
              </button>
              <button
                onClick={() => setPaymentMethod('cod')}
                className={`font-medium text-xl ${paymentMethod === 'cod' && 'border-indigo-500 text-indigo-500'}`}
              >
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
            <Button className="w-full mt-4 font-medium text-[16px] h-10">
              <p>Checkout</p>
            </Button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
};

export default CheckoutPage;
