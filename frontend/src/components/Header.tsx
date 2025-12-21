"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/Button";
import { useState } from "react";
import { FiMenu, FiX, FiEdit, FiUser } from "react-icons/fi";

export function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
          MediumClone
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
               <Link href="/create" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                 <FiEdit /> Write
               </Link>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                       <FiUser />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                    Sign out
                  </Button>
               </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full px-6">Get started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-muted-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background shadow-lg absolute w-full">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
             {user && (
                <Link href="/create" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Write</Link>
             )}
          </nav>
          <div className="pt-4 border-t flex flex-col gap-2">
            {user ? (
              <Button variant="outline" onClick={() => { logout(); setIsMenuOpen(false); }}>Sign out</Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full rounded-full">Get started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
