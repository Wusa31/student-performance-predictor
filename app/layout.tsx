import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Performance Predictor",
  description: "Predict exam scores from attendance and test scores."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}