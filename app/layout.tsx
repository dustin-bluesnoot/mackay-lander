import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MacKay CEO Forums — Member Survey',
  description: 'MacKay CEO Forums Member Survey — Connect with Trusted Resource Partners',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
