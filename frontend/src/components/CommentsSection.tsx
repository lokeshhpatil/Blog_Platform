"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { relativeDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  body: string;
  author: {
    id: string;
    username: string;
  };
  created_at: string;
}

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}/comments`);
      return res.data as Comment[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (body: string) => {
      await api.post(`/posts/${postId}/comments`, { body });
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment added!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Failed to add comment");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    mutation.mutate(newComment);
  };

  return (
    <div className="mt-12 bg-secondary/30 p-8 rounded-lg">
      <h3 className="text-xl font-bold mb-6 font-serif">Responses ({comments?.length || 0})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y font-serif mb-4"
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={mutation.isPending} disabled={!newComment.trim()}>
              Respond
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-background rounded-md border text-center text-sm text-muted-foreground">
          Please <a href="/login" className="text-primary hover:underline">sign in</a> to leave a comment.
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading comments...</div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {comment.author.username[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium">{comment.author.username}</span>
                <span className="text-xs text-muted-foreground">• {relativeDate(comment.created_at)}</span>
              </div>
              <p className="text-sm font-serif leading-relaxed text-foreground/90">{comment.body}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground italic">No comments yet. Be the first to respond!</div>
        )}
      </div>
    </div>
  );
}
