import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function Sidebar() {
  return (
    <aside className="space-y-12">
      {/* About Widget */}
      <div className="text-center">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-6 pb-2 border-b border-foreground/10 inline-block text-muted-foreground">About Me</h3>
        <div className="mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden bg-secondary">
           <img 
             src="/author_avatar.jpg" 
             alt="Author" 
             className="w-full h-full object-cover"
           />
        </div>
        <h4 className="text-lg font-serif font-bold mb-2">Editor's Note</h4>
        <p className="text-sm text-muted-foreground font-serif leading-relaxed mb-6 italic">
          "Sharing stories that matter, from design to culture and everything in between. This space is dedicated to thoughtful narratives."
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




    </aside>
  );
}
