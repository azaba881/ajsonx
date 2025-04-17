import type { Metadata } from 'next';

import './globals.css'
import { ThemeProvider } from 'next-themes';
import ConditionalLayout from '@/components/ConditionalLayout';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'AjsonX | Generate your API',
  description: 'Platform for generating a useful API in order to test your work quickly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ConditionalLayout>{children}</ConditionalLayout>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
