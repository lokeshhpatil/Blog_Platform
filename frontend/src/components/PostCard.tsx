import Link from "next/link";
import { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { FiShare2, FiHeart } from "react-icons/fi";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const authorName = typeof post.author === 'object' ? post.author.username : 'Unknown';
  const imageUrl = post.image?.url;

  return (
    <div className="group flex flex-col mb-12">
      {/* Image */}
      <Link href={`/posts/${post.id}`} className="block overflow-hidden mb-6 aspect-[4/3] bg-gray-100 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">No Image</div>
        )}
      </Link>

      {/* Content */}
      <div className="text-center px-4">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">
          <span>{authorName}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.created_at}>
             {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </time>
        </div>

        <Link href={`/posts/${post.id}`} className="block">
          <h2 className="text-2xl font-serif font-bold leading-tight mb-4 group-hover:text-gray-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-500 font-serif text-sm leading-relaxed line-clamp-3 mb-6">
          {post.body}
        </p>

        <div className="flex items-center justify-center gap-6">
           <Link href={`/posts/${post.id}`} className="text-[10px] font-bold tracking-[0.2em] uppercase border-b border-gray-300 pb-1 hover:border-black transition-colors">
             Read More
           </Link>
           <div className="flex gap-4 text-gray-400">
             <button className="hover:text-black transition-colors"><FiHeart /></button>
             <button className="hover:text-black transition-colors"><FiShare2 /></button>
           </div>
        </div>
      </div>
    </div>
  );
}
