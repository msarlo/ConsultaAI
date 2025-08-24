import Link from "next/link";

export function Header() {
  return (
    <header className="top-0 left-0 w-full bg-blue-500 py-7 px-4 sm:px-6 lg:px-8 z-50 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <p className="text-red-950">TESTANDO </p>
        <Link href="/" className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
        </Link>
      </div>
    </header>
  );
};

