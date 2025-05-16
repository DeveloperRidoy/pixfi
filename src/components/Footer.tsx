import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer
      className={`bg-white border-t border-gray-200 py-6 transition-all pb-6`}
    >
      <div className="max-w-5xl mx-auto px-5 flex flex-col items-center gap-4 relative">
        {/* Logo & Brand Name */}
        <Link href="/" className="hover:text-black transition">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="notranslate text-lg font-semibold tracking-wide text-gray-900">
              PixFi
            </span>
          </div>
        </Link>

        {/* Tagline */}
        <p className="text-sm text-gray-600 text-center max-w-md">
          Bridging collaborative pixel art with Web3 fundraising.
        </p>

        {/* Navigation Links */}
        <div className="flex gap-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-black transition">
            About
          </Link>
        </div>

        {/* Copyright Notice */}
        <p className="notranslate text-xs text-gray-500 text-center">
          &copy; {new Date().getFullYear()} PixFi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
