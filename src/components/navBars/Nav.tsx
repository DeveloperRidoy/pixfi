import Link from "next/link";
import Logo from "../Logo";
import { Button } from "../ui/button";
import ProfileDropdown from "../ProfileDropdown";
import { useAuthContext } from "@/context/AuthContext";
import { HeartHandshake } from "lucide-react";

/**
 * A responsive Nav component:
 * - On small screens, the search bar and "Create Event" button
 *   stack below the logo.
 * - On medium+ screens, items line up in a single row.
 */
export default function Nav() {
  const { user } = useAuthContext();
  return (
    <nav className="bg-white p-1 md:p-3 sticky top-0 z-50 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-1 md:gap-3">
        {/* Left: Logo */}
        <Link href="/">
          <Logo height={50} width={50} />
        </Link>

        <div className="relative"></div>

        {/* Mobile: Create + Login */}
        <div className="flex md:hidden items-center gap-3 mt-2 md:mt-0">
          <Link href="/create-campaign" className="shrink-0">
            <Button>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" />
                <span>Create Campaign</span>
              </div>
            </Button>
          </Link>
          {user ? (
            <ProfileDropdown />
          ) : (
            <Link href="/login">
              <Button variant="secondary">
                <div className="flex items-center gap-2">
                  <span>Login</span>
                </div>
              </Button>
            </Link>
          )}
        </div>

        <div className="flex-1 hidden md:flex items-center justify-center gap-5">
          {/* Desktop: Navigation Links */}
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-black transition">
            About
          </Link>
        </div>

        {/* Desktop: Create + Login/Profile */}
        <div className="hidden md:flex items-center gap-3 mt-2 md:mt-0">
          <Link href="/create-campaign" className="shrink-0 hidden md:block">
            <Button>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" />
                <span>Create Campaign</span>
              </div>
            </Button>
          </Link>

          {user ? (
            <ProfileDropdown />
          ) : (
            <Link href="/login">
              <Button variant="secondary">
                <div className="flex items-center gap-2">
                  <span>Login</span>
                </div>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
