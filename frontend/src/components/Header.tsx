"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/Button";
import { useState } from "react";
import { FiMenu, FiX, FiSearch, FiUser } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="w-full bg-background text-foreground">
      {/* Top Bar */}
      <div className="container mx-auto px-4 h-12 flex items-center justify-between border-b border-border text-xs uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-muted-foreground transition-colors"><FaFacebookF /></a>
          <a href="#" className="hover:text-muted-foreground transition-colors"><FaTwitter /></a>
          <a href="#" className="hover:text-muted-foreground transition-colors"><FaInstagram /></a>
        </div>
        <div className="hidden md:block text-muted-foreground">
          The Art of Storytelling
        </div>
        <div className="flex items-center gap-4">
           {user ? (
             <button onClick={logout} className="hover:text-muted-foreground transition-colors">Sign Out</button>
           ) : (
             <Link href="/login" className="hover:text-muted-foreground transition-colors">Sign In</Link>
           )}
           <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:text-muted-foreground transition-colors">
             {isSearchOpen ? <FiX size={14} /> : <FiSearch size={14} />}
           </button>
        </div>
      </div>

      {/* Search Bar Overlay */}
      {isSearchOpen && (
        <div className="border-b border-border bg-secondary/30 animate-in slide-in-from-top-2">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories..." 
                className="w-full bg-background border border-border rounded-full pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center gap-6 relative">
        {/* Logo */}
        <Link href="/" className="text-5xl font-black tracking-tighter uppercase font-serif">
          NARRATIVE
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button className="absolute right-4 top-8 md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
          <Link href="/" className="hover:text-muted-foreground transition-colors">Home</Link>
          <Link href="/posts" className="hover:text-muted-foreground transition-colors">Posts</Link>
          {user && (
             <Link href="/create" className="hover:text-muted-foreground transition-colors">Write</Link>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border p-4 bg-background absolute w-full z-50 shadow-xl">
          <nav className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-center">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/posts" onClick={() => setIsMenuOpen(false)}>Posts</Link>
            {user && (
               <Link href="/create" onClick={() => setIsMenuOpen(false)}>Write</Link>
            )}
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
