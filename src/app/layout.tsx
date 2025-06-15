
import type { Metadata } from 'next';
import './globals.css';
import { PT_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { CartProvider } from '@/context/cart-context';
import { cn } from '@/lib/utils';
import AiChatAssistant from '@/components/layout/ai-chat-assistant'; // Added

const ptSans = PT_Sans({
  subsets: ['latin', 'cyrillic'], // Added cyrillic for PT Sans, Hebrew is generally well supported
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'SwiftServe - אפליקציית המשלוחים החכמה שלך', // Placeholder
  description: 'הזמינו משלוח ממסעדות, חנויות ובתי קפה עם SwiftServe.', // Placeholder
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col', ptSans.variable)}>
        <CartProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
          <AiChatAssistant /> {/* Added AI Chat Assistant FAB */}
        </CartProvider>
      </body>
    </html>
  );
}
