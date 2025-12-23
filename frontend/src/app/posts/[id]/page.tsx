"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Post } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/Button";
import { FiHeart, FiMessageSquare, FiShare2, FiUser, FiTrash2, FiBookmark } from "react-icons/fi";
import { CommentsSection } from "@/components/CommentsSection";
import { relativeDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}`);
      return res.data as Post;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      toast.success("Story deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Failed to delete story");
    }
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/posts/${id}/like`);
      return res.data;
    },
    onSuccess: (data) => {
        // Invalidate to refetch fresh state, or we could update cache manually
        queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
    onError: (error: any) => {
        toast.error("Failed to like post");
    }
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || "Blog Post",
          text: "Check out this story!",
          url: url
        });
      } catch (err) {
        // User cancelled or failed
      }
    } else {
        // Fallback to copy
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">Loading Story...</div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Story not found</div>;

  const authorName = post.author && typeof post.author === 'object' ? post.author.username : 'Unknown';
  const authorId = typeof post.author === 'object' && post.author ? post.author.id : post.author;
  // Ensure we compare strings safely
  const isAuthor = user && String(user.id) === String(authorId);
  const imageUrl = post.image?.url;

  return (
    <article className="min-h-screen pb-20 bg-background">
      {/* Article Header */}
      <div className="container mx-auto px-4 max-w-3xl pt-12 md:pt-20">
        <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-accent-color mb-6">
           {post.tags?.[0] || "Featured"}
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.1] mb-8">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-between border-y border-border py-6 mb-10">
           <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                <span className="font-bold text-xs">{authorName.charAt(0).toUpperCase()}</span>
             </div>
             <div className="flex flex-col">
               <span className="font-medium text-foreground text-sm">{authorName}</span>
               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                 <time dateTime={post.created_at?.toString()}>
                  {relativeDate(post.created_at)}
                 </time>
                 <span>•</span>
                 <span>5 min read</span>
               </div>
             </div>
           </div>
           
           <div className="flex items-center gap-4 text-muted-foreground">
             <button 
                onClick={handleShare}
                className="hover:text-foreground transition-colors"
                title="Share"
             >
                <FiShare2 size={20} />
             </button>
             {/* Deleted Save Button */}
             {isAuthor && (
               <button 
                  onClick={() => setIsDeleteModalOpen(true)} 
                  className="hover:text-destructive transition-colors"
                  title="Delete Story"
               >
                 <FiTrash2 size={20} />
               </button>
             )}
           </div>
        </div>
      </div>

      {/* Hero Image */}
      {imageUrl && (
        <div className="container mx-auto px-4 max-w-4xl mb-16 md:mb-20">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted shadow-sm">
            <img
              src={imageUrl}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif leading-loose text-foreground/90 first-letter:float-left first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:mt-2">
          <div className="whitespace-pre-wrap">{post.body}</div>
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-16 mb-12">
              {post.tags.map(tag => (
                <span key={tag} className="bg-secondary px-4 py-2 rounded-full text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
        )}

        {/* Engagement Bar */}
        <div className="border-t border-border py-8 flex items-center justify-between mt-12 mb-12">
           <div className="flex gap-8">
              <button 
                onClick={() => likeMutation.mutate()}
                disabled={likeMutation.isPending}
                className={`flex items-center gap-2 transition-colors group ${post.is_liked ? 'text-red-600' : 'text-muted-foreground hover:text-red-600'}`}
              >
                <FiHeart size={24} className={`group-hover:fill-current ${post.is_liked ? 'fill-current' : ''}`} /> 
                <span className="font-medium">{post.likes_count || 0} Likes</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <FiMessageSquare size={24} />
                <span className="font-medium">Comments</span>
              </button>
           </div>
        </div>
        
        <CommentsSection postId={post.id} />
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Story"
        message="Are you sure you want to delete this story? This action cannot be undone."
        confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete"}
        isDestructive={true}
      />
    </article>
  );
}
