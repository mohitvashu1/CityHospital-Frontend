import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "./component/AppChrome";

export const metadata = {
  title: "City Hospital",
  description: "Quality healthcare at City Hospital",
};

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
