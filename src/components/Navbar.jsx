import Image from "next/image";

export default function Form() {
  return (
    <div>
      <section className="nav flex gap-2 bg-black h-auto">
        <Image
          src="/image/sairam_logo.svg"
          width={150}
          height={150}
          alt="SairamLogo"
        />
      </section>
    </div>

  );
}
