import type { Metadata, Viewport } from 'next'
import { DM_Sans, Space_Mono, Bebas_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

const spaceMono = Space_Mono({ 
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({ 
  subsets: ["latin"],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NEXUS - India\'s Sports Talent Discovery Platform',
  description: 'AI-powered sports talent discovery connecting 50M+ Indian youth athletes with ISL, IPL, PKL scouts and professional academies. Build your profile, get AI-matched, attend trials.',
  keywords: ['sports', 'talent', 'discovery', 'India', 'ISL', 'IPL', 'PKL', 'football', 'cricket', 'kabaddi', 'athletics', 'scouts', 'academy'],
  authors: [{ name: 'Team Infinity' }],
  openGraph: {
    title: 'NEXUS - India\'s Sports Talent Discovery Platform',
    description: 'The AI platform connecting India\'s youth athletes to ISL scouts, state academies, and professional coaches.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'NEXUS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS - India\'s Sports Talent Discovery Platform',
    description: 'AI-powered sports talent discovery for Indian athletes.',
  },
}

export const viewport: Viewport = {
  themeColor: '#060D08',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable} ${bebasNeue.variable}`}>
      <body className="font-sans antialiased bg-[var(--nx-bg)] text-[var(--nx-text1)] min-h-screen">
        <div className="fixed inset-0 nx-dot-grid pointer-events-none" />
        <div className="fixed inset-0 nx-green-radial pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
