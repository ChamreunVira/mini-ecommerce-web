'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { AppContainer } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CONTACT_CHANNELS = [
  { icon: Mail, label: 'Email', value: 'hello@vstore.com', subtext: 'We reply within 24 hours' },
  { icon: Phone, label: 'Phone', value: '+855 12 345 678', subtext: 'Mon–Fri from 9am to 6pm' },
  { icon: MapPin, label: 'Showroom', value: 'Phnom Penh, Cambodia', subtext: 'Open for appointments' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Thank you! Your message has been sent to our support desk.');
  };

  return (
    <main className="min-h-[75vh] py-12 sm:py-16">
      <AppContainer>
        {/* Header */}
        <section className="max-w-2xl border-b border-slate-200/80 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8102E]">Contact</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">We’re here to help.</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
            Have questions about products, delivery timelines, or orders? Send us a message and our team will get back
            to you.
          </p>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Contact Information & Channels */}
          <div className="space-y-4 lg:col-span-5">
            {CONTACT_CHANNELS.map(({ icon: Icon, label, value, subtext }) => (
              <div key={label} className="flex items-start gap-3.5 rounded-sm border border-slate-200/80 bg-white p-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-red-50 text-[#C8102E]">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{subtext}</p>
                </div>
              </div>
            ))}

            <div className="rounded-sm border border-slate-200/80 bg-slate-50/80 p-4 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <Clock className="size-4 text-[#C8102E]" />
                <span>Customer Care Hours</span>
              </div>
              <p className="leading-relaxed text-slate-500">
                Monday – Friday: 9:00 AM – 6:00 PM (ICT)
                <br />
                Saturday – Sunday: Order support via Telegram or hotline.
              </p>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="rounded-sm border border-slate-200/80 bg-white p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900">Send a message</h2>
              <p className="mt-1 text-xs text-slate-500">Fill out the form below and we will reply to your email.</p>

              {submitted ? (
                <div className="mt-6 rounded-sm border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                  <p className="text-sm font-semibold">Message sent</p>
                  <p className="mt-1 text-xs text-emerald-800">
                    We received your message and will respond to your email address shortly.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 rounded-sm cursor-pointer"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="text-xs font-semibold text-slate-700">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        placeholder="e.g. Chamreun Vira"
                        required
                        className="w-full rounded-sm border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="text-xs font-semibold text-slate-700">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        placeholder="you@domain.com"
                        required
                        className="w-full rounded-sm border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700">
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      placeholder="Order inquiry or product question"
                      required
                      className="w-full rounded-sm border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-xs font-semibold text-slate-700">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder="Write your question or request here..."
                      required
                      className="w-full rounded-sm border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="rounded-sm bg-[#C8102E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#a50d26] gap-2 cursor-pointer"
                  >
                    <span>Send Message</span>
                    <Send className="size-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </AppContainer>
    </main>
  );
}
