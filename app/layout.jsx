import './globals.css'

export const metadata = {
  title: 'TimeBloc',
  description: 'Secure Social Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}