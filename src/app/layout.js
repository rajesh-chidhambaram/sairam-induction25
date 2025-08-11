import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sairam Induction 2025",
  description: "Sairam Institutions Induction Portal 2025",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="flex flex-col items-center">
        {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
