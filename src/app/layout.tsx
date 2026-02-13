import type {Metadata} from 'next';
import './globals.css';
import AmplifyProvider from '@/components/AmplifyProvider';

export const metadata: Metadata = {
  title: 'Lab Inventory Tracker',
  description: 'Precision material management and audit logging system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  );
}