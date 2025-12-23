"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FiMenu, FiX, FiSearch, FiUser, FiLogOut, FiEdit3 } from "react-icons/fi";
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

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Design", href: "/search?q=Design" }, // Example categories
    { label: "Culture", href: "/search?q=Culture" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -ml-2 hover:bg-muted rounded-full">
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2">
           <Link href="/" className="text-xl font-bold tracking-tight font-serif">
             NARRATIVE.
           </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/posts" className="hover:text-foreground transition-colors">Stories</Link>
          {user && (
             <Link href="/create" className="hover:text-foreground transition-colors">Write</Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <FiSearch size={20} />
          </button>

          {/* Auth Actions */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-border ml-2">
               <Link href="/create" className="hidden md:flex p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground" title="Write a story">
                 <FiEdit3 size={20} />
               </Link>
               <button onClick={logout} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-destructive transition-colors" title="Sign out">
                 <FiLogOut size={20} />
               </button>
            </div>
          ) : (
            <Link href="/login" className="ml-2 text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Search Overlay - Minimal */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 w-full bg-background border-b border-border p-4 animate-in slide-in-from-top-2 shadow-lg">
           <form onSubmit={handleSearch} className="container mx-auto max-w-2xl relative">
             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
               autoFocus
               type="text" 
               placeholder="Search stories, topics, or authors..." 
               className="w-full bg-secondary/50 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </form>
        </div>
      )}

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 p-6 animate-in slide-in-from-left-5">
          <nav className="flex flex-col gap-6 text-lg font-medium">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="border-b border-border pb-2">Home</Link>
            <Link href="/posts" onClick={() => setIsMenuOpen(false)} className="border-b border-border pb-2">Latest Stories</Link>
            {user && (
               <Link href="/create" onClick={() => setIsMenuOpen(false)} className="border-b border-border pb-2 text-primary">Write a Story</Link>
            )}
            {!user && (
               <Link href="/login" onClick={() => setIsMenuOpen(false)} className="border-b border-border pb-2">Sign In</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
