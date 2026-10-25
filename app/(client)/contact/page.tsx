import { Mail, MapPin, Phone } from 'lucide-react';
import { AppContainer } from '@/components/Container';
import { Button } from '@/components/ui/button';

const contactDetails = [
  { icon: Mail, label: 'Email', value: 'hello@vst4re.com' },
  { icon: Phone, label: 'Phone', value: '+855 12 345 678' },
  { icon: MapPin, label: 'Studio', value: 'Phnom Penh, Cambodia' },
];

export default function ContactPage() {
  return (
    <main>
      <AppContainer className="py-16 md:py-24">
        <section className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Get in touch</p>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl">We’re here to help.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-gray-600">
            Have a question about a product, an order, or what would work best for you? Send us a note and our team will
            get back to you soon.
          </p>
        </section>

        <section className="mt-12 grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div className="space-y-7">
            {contactDetails.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-950">{label}</p>
                  <p className="mt-1 text-sm text-gray-600">{value}</p>
                </div>
              </div>
            ))}
            <div className="border-t pt-7 text-sm leading-6 text-gray-600">
              <p className="font-medium text-gray-950">Customer care hours</p>
              <p className="mt-1">Monday to Friday, 9:00 AM to 6:00 PM</p>
            </div>
          </div>

          <form className="rounded-md border bg-white p-6 shadow-xs md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-gray-800">
                Name
                <input name="name" type="text" placeholder="Your name" required />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-800">
                Email
                <input name="email" type="email" placeholder="you@example.com" required />
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-medium text-gray-800">
              Subject
              <input name="subject" type="text" placeholder="How can we help?" required />
            </label>
            <label className="mt-5 grid gap-2 text-sm font-medium text-gray-800">
              Message
              <textarea
                name="message"
                placeholder="Tell us a little more..."
                className="min-h-32 resize-y rounded border border-input px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              />
            </label>
            <Button type="submit" className="mt-6 w-full sm:w-auto">
              Send message
            </Button>
          </form>
        </section>
      </AppContainer>
    </main>
  );
}
