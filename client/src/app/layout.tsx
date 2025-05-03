import './globals.css';
import type { Metadata } from 'next';
import { AnnouncementProvider } from "@/context/AnnouncementContext";

export const metadata: Metadata = {
  title: 'Corebridge',
  description: 'Efficiently manage your tasks and boost productivity with Corebridge.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AnnouncementProvider>
          {children}
        </AnnouncementProvider>
      </body>
    </html>
  );
}