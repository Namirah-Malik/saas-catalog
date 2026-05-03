import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Product Catalog",
  description: "Browse our products",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f8fafc" }}>
        {children}
      </body>
    </html>
  )
}
