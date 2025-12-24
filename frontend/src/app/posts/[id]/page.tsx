"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Post } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { FiArrowLeft, FiUser, FiCalendar } from "react-icons/fi";
import Link from "next/link";
import { Suspense } from "react";

import { CommentsSection } from "@/components/CommentsSection";
import { LikeButton } from "@/components/LikeButton";
import { DeletePostButton } from "@/components/DeletePostButton";

function PostDetailContent() {
  const params = useParams();
  const router = useRouter();
  // Safe cast params.id to string or undefined
  const id = params?.id as string | undefined;

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
       if (!id) throw new Error("No ID");
       const res = await api.get(`/posts/${id}`);
       return res.data;
    },
    enabled: !!id,
    retry: false
  });

  if (isLoading) {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-12 animate-pulse">
            <div className="h-8 bg-muted w-1/3 mb-8 rounded"></div>
            <div className="h-[400px] bg-muted w-full rounded-xl mb-8"></div>
            <div className="space-y-4">
                <div className="h-4 bg-muted w-full rounded"></div>
                <div className="h-4 bg-muted w-5/6 rounded"></div>
                <div className="h-4 bg-muted w-4/6 rounded"></div>
            </div>
        </div>
    );
  }

  if (error || !post) {
      return (
          <div className="container max-w-md mx-auto px-4 py-24 text-center">
              <h1 className="text-2xl font-bold font-serif mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-8">The post you are looking for does not exist or has been removed.</p>
               <Button onClick={() => router.push('/')}>Back to Home</Button>
          </div>
      )
  }

  const authorName = typeof post.author === 'object' ? post.author.username : 'Unknown';
  const authorId = typeof post.author === 'object' ? post.author.id : (typeof post.author === 'string' ? post.author : '');

  return (
    <article className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground group transition-colors">
                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Posts
            </Link>
            
            {/* Admin/Author Actions */}
            <div className="flex items-center gap-2">
                 <DeletePostButton postId={post.id} authorId={authorId} />
            </div>
        </div>
        
        <header className="mb-10 text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight text-foreground">
                {post.title}
            </h1>
             <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <FiUser />
                    <span className="font-medium text-foreground">{authorName}</span>
                </div>
                <div className="flex items-center gap-2">
                    <FiCalendar />
                    <time>{formatDate(post.created_at)}</time>
                </div>
                {/* Like Button in header metadata */}
                <div className="flex items-center">
                    <LikeButton 
                        postId={post.id} 
                        initialLikes={post.likes_count || 0} 
                        initialIsLiked={post.is_liked || false} 
                    />
                </div>
            </div>
        </header>

        {post.image?.url && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 shadow-sm">
                <img 
                   src={post.image.url} 
                   alt={post.title} 
                   className="object-cover w-full h-full"
                />
            </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed text-foreground/90 whitespace-pre-wrap">
             {post.body}
        </div>
        
        {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
                <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                            # {tag}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Comments Section */}
        <div className="mt-12 border-t pt-12">
            <CommentsSection postId={post.id} />
        </div>

    </article>
  );
}

export default function PostDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <PostDetailContent />
        </Suspense>
    )
}
