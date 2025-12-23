import Link from "next/link";
import { Post } from "@/types";
import { FiArrowRight } from "react-icons/fi";
import { formatDate } from "@/lib/utils";

interface HeroPostProps {
  post: Post;
}

export function HeroPost({ post }: HeroPostProps) {
  const authorName = post.author && typeof post.author === 'object' ? post.author.username : 'Unknown';
  const imageUrl = post.image?.url;

  return (
    <section className="mb-20">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
         {/* Image Side */}
         <Link href={`/posts/${post.id}`} className="block relative aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl bg-muted group">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary">
                No Image
              </div>
            )}
         </Link>

         {/* Content Side */}
         <div className="flex flex-col items-start justify-center space-y-6">
           <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-accent-color">
             <span>Featured Story</span>
             <span className="w-12 h-px bg-accent-color/30"></span>
           </div>
           
           <Link href={`/posts/${post.id}`} className="group">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.1] text-foreground group-hover:text-accent-color transition-colors">
               {post.title}
             </h2>
           </Link>

           <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
             <span>{authorName}</span>
             <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
             <time dateTime={post.created_at?.toString()}>
               {formatDate(post.created_at)}
             </time>
           </div>

           <div className="text-muted-foreground text-lg leading-relaxed line-clamp-3 font-serif max-w-md">
             {post.body}
           </div>

           <Link href={`/posts/${post.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-accent-color hover:border-accent-color transition-colors">
             Read Story <FiArrowRight />
           </Link>
         </div>
       </div>
    </section>
  );
}

