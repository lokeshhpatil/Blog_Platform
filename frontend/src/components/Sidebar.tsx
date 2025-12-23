import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function Sidebar() {
  return (
    <aside className="space-y-12">
      {/* About Widget */}
      <div className="text-center">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-6 pb-2 border-b border-foreground/10 inline-block text-muted-foreground">About</h3>
        <div className="bg-secondary aspect-square w-32 mx-auto mb-4 rounded-full flex items-center justify-center text-muted-foreground">
           {/* Placeholder for author image */}
           <span className="text-xs uppercase tracking-widest">Photo</span>
        </div>
        <p className="text-sm text-muted-foreground font-serif leading-relaxed mb-6 italic">
          "Sharing stories that matter, from design to culture and everything in between."
        </p>
      </div>

      {/* Social Widget */}
      <div className="text-center">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-6 pb-2 border-b border-foreground/10 inline-block text-muted-foreground">Follow</h3>
        <div className="flex justify-center gap-6 text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors"><FaFacebookF /></a>
          <a href="#" className="hover:text-foreground transition-colors"><FaTwitter /></a>
          <a href="#" className="hover:text-foreground transition-colors"><FaInstagram /></a>
          <a href="#" className="hover:text-foreground transition-colors"><FaPinterest /></a>
        </div>
      </div>

      {/* Newsletter Widget */}
      <div className="bg-foreground text-background p-8 text-center rounded-xl">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-2">Newsletter</h3>
        <p className="text-xs text-background/60 mb-6 font-serif">Get weekly inspiration delivered to your inbox.</p>
        <form className="space-y-4">
          <Input 
            placeholder="Your Email" 
            className="bg-background/10 border-background/20 text-background placeholder:text-background/50 text-center text-sm focus:bg-background/20 transition-colors" 
          />
          <Button className="w-full bg-background text-foreground hover:bg-background/90 text-xs font-bold tracking-widest uppercase">
            Subscribe
          </Button>
        </form>
      </div>

      {/* Categories Widget */}
      <div>
         <h3 className="text-xs font-bold tracking-widest uppercase mb-6 pb-2 border-b border-foreground/10 inline-block text-muted-foreground">Topics</h3>
         <ul className="space-y-3 text-sm font-medium text-muted-foreground">
           <li className="flex justify-between hover:text-foreground cursor-pointer transition-colors group">
             <span className="group-hover:translate-x-1 transition-transform">Design</span> 
             <span className="text-muted-foreground/50">04</span>
           </li>
           <li className="flex justify-between hover:text-foreground cursor-pointer transition-colors group">
             <span className="group-hover:translate-x-1 transition-transform">Culture</span> 
             <span className="text-muted-foreground/50">12</span>
           </li>
           <li className="flex justify-between hover:text-foreground cursor-pointer transition-colors group">
             <span className="group-hover:translate-x-1 transition-transform">Technology</span> 
             <span className="text-muted-foreground/50">08</span>
           </li>
           <li className="flex justify-between hover:text-foreground cursor-pointer transition-colors group">
             <span className="group-hover:translate-x-1 transition-transform">Travel</span> 
             <span className="text-muted-foreground/50">21</span>
           </li>
         </ul>
      </div>
    </aside>
  );
}
