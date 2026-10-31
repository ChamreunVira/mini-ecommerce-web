import { AppContainer } from './Container';

const storeInfoItems = [
  { label: 'Payment', detail: 'KHQR or cash on delivery.' },
  { label: 'Availability', detail: 'Live stock status on every product.' },
  { label: 'Details', detail: 'Descriptions and prices before you add to cart.' },
];

export const StoreInfo = () => (
  <AppContainer>
    <dl className="grid gap-6 border-t border-line py-10 sm:grid-cols-3">
      {storeInfoItems.map(({ label, detail }) => (
        <div key={label}>
          <dt className="text-sm font-medium text-ink">{label}</dt>
          <dd className="mt-1 text-sm text-ink-soft">{detail}</dd>
        </div>
      ))}
    </dl>
  </AppContainer>
);
