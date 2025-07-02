import type { Metadata } from 'next'
import './globals.css'
import Script from "next/script";

export const metadata: Metadata = {
  title: 'Frontal Hairs - Premium Hair Collection',
  description: 'Select from our premium collection of frontal hairs. High-quality hair pieces for the perfect look.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&intent=capture`}
          strategy="afterInteractive"
          id="paypal-sdk"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
