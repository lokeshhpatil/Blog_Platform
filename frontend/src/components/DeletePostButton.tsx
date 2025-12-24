"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { FiTrash2 } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface DeletePostButtonProps {
  postId: string;
  authorId: string;
}

export function DeletePostButton({ postId, authorId }: DeletePostButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  // Check if current user is the author
  if (!user || user.id !== authorId) {
    return null;
  }

  const mutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Small delay to ensure toast is seen
      setTimeout(() => {
          router.push("/");
      }, 500);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.msg || "Failed to delete post");
      setShowConfirm(false);
    },
  });

  if (showConfirm) {
    return (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
            <span className="text-sm text-muted-foreground mr-2 font-serif">Are you sure?</span>
            <Button 
                variant="danger" 
                size="sm" 
                onClick={() => mutation.mutate()}
                isLoading={mutation.isPending}
            >
                Yes, Delete
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowConfirm(false)}
                disabled={mutation.isPending}
            >
                Cancel
            </Button>
        </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowConfirm(true)}
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2 font-serif"
    >
      <FiTrash2 className="w-4 h-4" />
      Delete
    </Button>
  );
}
