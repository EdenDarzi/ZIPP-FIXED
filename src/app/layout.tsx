
'use client'; // Required for useEffect

import type { Metadata } from 'next';
import './globals.css';
import { PT_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { CartProvider } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import AiChatAssistant from '@/components/layout/ai-chat-assistant';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState

const ptSans = PT_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

// Metadata can remain static if not dynamically changed by language
// export const metadata: Metadata = { // This is static metadata, no problem
//   title: 'LivePick - פלטפורמת המשלוחים החכמה שלך',
//   description: 'הזמינו משלוח ממסעדות, חנויות ובתי קפה עם LivePick. גלו טרנדים, שתפו וזכו בפרסים!',
//   icons: {
//     icon: '/favicon.ico',
//   }
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [timeBasedTheme, setTimeBasedTheme] = useState('theme-day');

  useEffect(() => {
    // This effect runs only on the client
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) { // Day
      setTimeBasedTheme('theme-day');
    } else if (hour >= 18 && hour < 21) { // Evening
      setTimeBasedTheme('theme-evening');
    } else { // Night
      setTimeBasedTheme('theme-night');
    }

    // Set metadata dynamically on client - useful if title/desc need to change
    if (document) {
        document.title = 'LivePick - פלטפורמת המשלוחים החכמה שלך';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'הזמינו משלוח ממסעדות, חנויות ובתי קפה עם LivePick. גלו טרנדים, שתפו וזכו בפרסים!');
        }
    }

  }, []);

  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Static metadata elements can remain in head if not using the metadata object above for client components */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col bg-background text-foreground', ptSans.variable, timeBasedTheme)}>
        <CartProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
          <AiChatAssistant />
        </CartProvider>
      </body>
    </html>
  );
}
