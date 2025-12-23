import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-16 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center text-center gap-8">
        {/* Minimal Logo */}
        <Link href="/" className="text-2xl font-serif font-bold tracking-tight">
          NARRATIVE.
        </Link>
        
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/posts" className="hover:text-foreground transition-colors">Stories</Link>
          <Link href="#" className="hover:text-foreground transition-colors">About</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-6 text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors p-2"><FaTwitter size={20} /></a>
          <a href="#" className="hover:text-foreground transition-colors p-2"><FaLinkedinIn size={20} /></a>
          <a href="#" className="hover:text-foreground transition-colors p-2"><FaGithub size={20} /></a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} Narrative Blog Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
