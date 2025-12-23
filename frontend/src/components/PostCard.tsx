import Link from "next/link";
import { Post } from "@/types";
import { FiArrowUpRight, FiHeart } from "react-icons/fi";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const authorName = typeof post.author === 'object' ? post.author.username : 'Unknown';
  const imageUrl = post.image?.url;

  return (
    <div className="group flex flex-col gap-4 mb-8 break-inside-avoid">
      {/* Image Container */}
      <Link href={`/posts/${post.id}`} className="relative overflow-hidden rounded-xl bg-muted aspect-[4/3] w-full">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-medium bg-secondary">
             No Image
          </div>
        )}
        {/* Hover Overlay Icon */}
        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
           <FiArrowUpRight size={18} className="text-black" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{authorName}</span>
          <time dateTime={post.created_at}>
             {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </time>
        </div>

        <Link href={`/posts/${post.id}`} className="group-hover:text-accent-color transition-colors">
          <h3 className="text-lg font-bold font-serif leading-tight text-foreground line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-serif">
          {post.body}
        </p>
      </div>
    </div>
  );
}
