"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Post } from "@/types";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function PostsPage() {
  const [page, setPage] = useState(1);
  
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const res = await api.get(`/posts/?page=${page}&per_page=9`);
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const posts: Post[] = data?.posts || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">All Posts</h1>
      
      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setPage(old => Math.max(old - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center text-sm font-medium">Page {page}</span>
             <Button 
              variant="outline" 
              onClick={() => setPage(old => old + 1)}
              disabled={posts.length < 9 || isPlaceholderData}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
