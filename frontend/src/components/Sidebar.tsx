import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export function Sidebar() {
  return (
    <aside className="space-y-12">
      {/* About Widget */}
      <div className="text-center">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-6 pb-2 border-b border-black inline-block">About Me</h3>
        <div className="bg-gray-100 aspect-square mb-4">
           {/* Placeholder for author image */}
           <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">Author Image</div>
        </div>
        <p className="text-sm text-gray-600 font-serif leading-relaxed mb-4">
          Aenean eleifend ante maecenas pulvinar montes lorem et pede dis dolor pretium donec dictum. Vici consequat justo enim.
        </p>
        <img src="/signature.png" alt="" className="h-8 mx-auto opacity-50" /> 
      </div>

      {/* Social Widget */}
      <div className="text-center">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-6 pb-2 border-b border-black inline-block">Follow Me</h3>
        <div className="flex justify-center gap-6 text-gray-600">
          <a href="#" className="hover:text-black transition-colors"><FaFacebookF /></a>
          <a href="#" className="hover:text-black transition-colors"><FaTwitter /></a>
          <a href="#" className="hover:text-black transition-colors"><FaInstagram /></a>
          <a href="#" className="hover:text-black transition-colors"><FaPinterest /></a>
        </div>
      </div>

      {/* Newsletter Widget */}
      <div className="bg-black text-white p-8 text-center">
        <h3 className="text-xs font-bold tracking-widest uppercase mb-2">Newsletter</h3>
        <p className="text-xs text-gray-400 mb-6">Subscribe to my newsletter</p>
        <form className="space-y-4">
          <Input placeholder="Your Email" className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-center text-xs" />
          <Button className="w-full bg-white text-black hover:bg-gray-200 text-xs font-bold tracking-widest uppercase">Subscribe</Button>
        </form>
      </div>

      {/* Categories Widget */}
      <div>
         <h3 className="text-xs font-bold tracking-widest uppercase mb-6 pb-2 border-b border-black inline-block">Categories</h3>
         <ul className="space-y-3 text-sm text-gray-600 font-serif">
           <li className="flex justify-between hover:text-black cursor-pointer"><span>Lifestyle</span> <span className="text-gray-400">(23)</span></li>
           <li className="flex justify-between hover:text-black cursor-pointer"><span>Travel</span> <span className="text-gray-400">(14)</span></li>
           <li className="flex justify-between hover:text-black cursor-pointer"><span>Fashion</span> <span className="text-gray-400">(8)</span></li>
           <li className="flex justify-between hover:text-black cursor-pointer"><span>Photography</span> <span className="text-gray-400">(5)</span></li>
         </ul>
      </div>
    </aside>
  );
}
