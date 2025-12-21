import Link from "next/link";
import { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const authorName = typeof post.author === 'object' ? post.author.username : 'Unknown';
  const imageUrl = post.image?.url;

  return (
    <div className="flex items-start justify-between gap-8 py-8 border-b last:border-0 group">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <div className="flex items-center gap-2">
             <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px]">
                {authorName[0]?.toUpperCase()}
             </div>
             <span className="font-medium text-foreground">{authorName}</span>
          </div>
          <span>•</span>
          <time dateTime={post.created_at}>
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </time>
        </div>
        
        <Link href={`/posts/${post.id}`} className="block group-hover:opacity-80 transition-opacity">
          <h2 className="text-xl md:text-2xl font-bold font-serif leading-tight mb-1 text-foreground">
            {post.title}
          </h2>
          <p className="text-muted-foreground font-serif text-sm md:text-base line-clamp-2 md:line-clamp-3 leading-relaxed">
            {post.body}
          </p>
        </Link>
        
        <div className="flex items-center gap-4 mt-4">
           {post.tags && post.tags.length > 0 && (
             <div className="flex gap-2">
               {post.tags.slice(0, 3).map(tag => (
                 <span key={tag} className="bg-secondary px-2 py-1 rounded-full text-xs text-secondary-foreground">
                   {tag}
                 </span>
               ))}
             </div>
           )}
           <span className="text-xs text-muted-foreground">
             {Math.ceil(post.body.length / 200)} min read
           </span>
        </div>
      </div>

      {imageUrl && (
        <Link href={`/posts/${post.id}`} className="hidden md:block shrink-0 w-32 h-32 md:w-40 md:h-28 bg-muted rounded-md overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
    </div>
  );
}
