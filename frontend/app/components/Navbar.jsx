'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ light = false }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link href="/" className="logo">Booking.com</Link>
        <div className="nav-items">
          <span className="nav-link">GBP</span>
          <span className="nav-link">🇬🇧</span>
          {!light && !isAuthPage && (
            <>
              <span className="nav-link">List your property</span>
              <Link href="/register" className="btn-secondary">Register</Link>
              <Link href="/login" className="btn-secondary">Sign in</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
