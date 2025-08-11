import Image from "next/image";

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#10283d] to-[#1e3a5f] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/image/sairam_logo.svg"
            width={80}
            height={80}
            alt="Sairam Institutions Logo"
            className="h-16 w-auto"
          />
          <div className="text-center">
            <p className="text-white text-sm font-medium">
              ©️ Sairam Institutions, {getCurrentYear()}. All rights Reserved.
            </p>
            <p className="text-blue-200 text-xs mt-1">
              Building Future Leaders Since 1995
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;