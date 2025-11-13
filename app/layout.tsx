import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Market Dashboard",
  description: "Near real-time stock market data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
