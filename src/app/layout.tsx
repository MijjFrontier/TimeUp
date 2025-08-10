import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import { AppShell } from "@/components/app-shell";
import './globals.css';

export const metadata: Metadata = {
  title: 'TimeUp',
  description: 'Organiza tu vida académica sin problemas.',
  icons: {
    icon: '/icon.svg',
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#F0F4F8" />
      </head>
      <body className="font-body antialiased">
        <AppShell>
          {children}
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
