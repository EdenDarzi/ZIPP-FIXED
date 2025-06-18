
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
import React, { useEffect, useState } from 'react';

const ptSans = PT_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [timeBasedTheme, setTimeBasedTheme] = useState('theme-day');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      setTimeBasedTheme('theme-day');
    } else if (hour >= 18 && hour < 21) {
      setTimeBasedTheme('theme-evening');
    } else {
      setTimeBasedTheme('theme-night');
    }

    if (document) {
        document.title = 'LivePick - פלטפורמת המשלוחים החכמה שלך';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'הזמינו משלוח ממסעדות, חנויות ובתי קפה עם LivePick. גלו טרנדים, שתפו וזכו בפרסים!');
        }
    }

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }, []);

  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#29ABE2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LivePick" />
        {/* Add Apple touch icons later if specific ones are needed */}
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
