import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter uppercase font-serif block">
              NARRATIVE
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-serif">
              A minimal platform for storytellers. We believe in the power of words and the beauty of simplicity.
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-500">Explore</h4>
            <ul className="space-y-4 text-sm font-bold tracking-wide uppercase">
              <li><Link href="/" className="hover:text-gray-400 transition-colors">Home</Link></li>
              <li><Link href="/posts" className="hover:text-gray-400 transition-colors">Latest Stories</Link></li>
              <li><Link href="#" className="hover:text-gray-400 transition-colors">Culture</Link></li>
              <li><Link href="#" className="hover:text-gray-400 transition-colors">Tech</Link></li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-500">Connect</h4>
            <ul className="space-y-4 text-sm font-bold tracking-wide uppercase">
              <li><Link href="#" className="hover:text-gray-400 transition-colors">Instagram</Link></li>
              <li><Link href="#" className="hover:text-gray-400 transition-colors">Twitter</Link></li>
              <li><Link href="#" className="hover:text-gray-400 transition-colors">Facebook</Link></li>
              <li><Link href="#" className="hover:text-gray-400 transition-colors">LinkedIn</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-6 text-gray-500">Legal</h4>
            <ul className="space-y-4 text-sm font-bold tracking-wide uppercase">
              <li><Link href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-gray-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-gray-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
          <div>
            &copy; {new Date().getFullYear()} NARRATIVE. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition-colors"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition-colors"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
