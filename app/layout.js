import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../app/component/Navbar";


export const metadata = {
  title: "City Hospital",
  description: "Quality healthcare at City Hospital",
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
         <Navbar />
        {children}
        </body>
    </html>
  );
}
