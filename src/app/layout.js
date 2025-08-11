import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "sonner";

export const metadata = {
  title: "Sairam Induction 2025 | Sairam Institutions",
  description: "Official induction portal for Sairam Institutions 2025. Register your admission ID and manage your accompanying family members for the induction ceremony.",
  keywords: "Sairam Institutions, Induction 2025, Admission, Registration, Chennai",
  authors: [{ name: "Sairam Institutions" }],
  robots: "index, follow",
  openGraph: {
    title: "Sairam Induction 2025",
    description: "Join us for the Sairam Institutions Induction Ceremony 2025",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ErrorBoundary>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" richColors />
        </ErrorBoundary>
      </body>
    </html>
  );
}
