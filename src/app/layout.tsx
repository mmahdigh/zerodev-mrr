import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="m-auto flex min-h-screen max-w-[430px] flex-col items-center justify-center bg-white">
          {children}
        </main>
      </body>
    </html>
  )
}
