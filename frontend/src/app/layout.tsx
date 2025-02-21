import "../globals.css";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "App Templatei",
  description: "A template for a new application",
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
