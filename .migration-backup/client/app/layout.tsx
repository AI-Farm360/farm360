import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Farm360 - AI Satellite Advisory for Potato Farmers",
  description:
    "Continuously analyzes satellite imagery, weather indices, and crop growth patterns to detect moisture stress, leaf anomaly, and pest risk early.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
