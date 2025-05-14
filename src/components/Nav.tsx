import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex gap-6 flex-wrap items-center justify-center bg-white p-5 text-xl sticky top-0 z-10">
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/"
      >
        Home
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/about"
      >
        About
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/contact"
      >
        Contact
      </Link>
    </nav>
  );
}
