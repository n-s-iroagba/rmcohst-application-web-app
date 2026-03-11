import { Providers } from '@/components/Providers'
import type { Metadata } from 'next'
import './globals.css'


export const metadata: Metadata = {
  title: 'Remington College Of Health  Science And Technology',
  description: 'Shaping the future of health care through knowledge'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
