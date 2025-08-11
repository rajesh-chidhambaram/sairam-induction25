import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-[#10283d] to-[#1e3a5f] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          <div className="flex items-center space-x-4">
            <Image
              src="/image/sairam_logo.svg"
              width={60}
              height={60}
              alt="Sairam Institutions Logo"
              className="h-12 w-auto"
              priority
            />
            <div className="hidden sm:block">
              <h1 className="text-white text-lg font-semibold">
                Sairam Institutions
              </h1>
              <p className="text-blue-200 text-sm">
                Induction Portal 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
