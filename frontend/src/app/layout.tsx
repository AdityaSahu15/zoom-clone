import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ZoomClone – Video Conferencing for Everyone',
  description:
    'A modern video conferencing platform. Start, join, and schedule meetings with ease.',
  keywords: 'video conferencing, meetings, zoom clone, online meetings',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            theme="dark"
            toastOptions={{
              style: {
                background: '#1C1C1E',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

