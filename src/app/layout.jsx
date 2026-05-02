import { Poppins, Bricolage_Grotesque } from 'next/font/google'
import './globals.scss'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
})

export const metadata = {
  title: 'Note Sphere',
  description: 'A modular knowledge engine.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${bricolage.variable}`}>
      <body>{children}</body>
    </html>
  )
}
