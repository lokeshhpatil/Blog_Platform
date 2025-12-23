import Link from "next/link";
import { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { FiArrowRight } from "react-icons/fi";

interface HeroPostProps {
  post: Post;
}

export function HeroPost({ post }: HeroPostProps) {
  const authorName = typeof post.author === 'object' ? post.author.username : 'Unknown';
  const imageUrl = post.image?.url;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] mb-16">
      {/* Left: Content */}
      <div className="bg-black text-white p-12 md:p-20 flex flex-col justify-center items-start">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">
          Featured Story
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-8">
          {post.title}
        </h2>
        <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-gray-400 mb-8">
          <span>By {authorName}</span>
          <span>—</span>
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </time>
        </div>
        <p className="text-gray-300 mb-8 line-clamp-3 leading-relaxed max-w-md font-serif">
          {post.body}
        </p>
        <Link href={`/posts/${post.id}`} className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition-colors">
          Read More <FiArrowRight />
        </Link>
      </div>

      {/* Right: Image */}
      <div className="relative h-[400px] md:h-auto bg-gray-100">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
            No Image
          </div>
        )}
      </div>
    </div>
  );
}
