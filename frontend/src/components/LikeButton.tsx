"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { FiHeart } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialIsLiked: boolean;
}

export function LikeButton({ postId, initialLikes, initialIsLiked }: LikeButtonProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/posts/${postId}/like`);
      return res.data;
    },
    onMutate: () => {
        // Optimistic update
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
    },
    onError: (err: any) => {
        // Revert on error
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        toast.error("Failed to like post");
        console.error(err);
    },
    onSuccess: (data) => {
        // Sync with server response
        setIsLiked(data.liked);
        setLikes(data.likes_count);
    }
  });

  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like this post");
      return;
    }
    mutation.mutate();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={`group gap-2 transition-all duration-300 ${
        isLiked ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
      }`}
    >
      <FiHeart
        className={`w-5 h-5 transition-transform duration-300 ${
          isLiked ? "fill-current" : ""
        } ${isAnimating ? "scale-125" : "group-hover:scale-110"}`}
      />
      <span className="font-medium font-serif min-w-[1rem] text-center">
        {likes}
      </span>
    </Button>
  );
}
