"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Post } from "@/types";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", "latest"],
    queryFn: async () => {
      const res = await api.get("/posts/?per_page=10");
      return res.data;
    },
  });

  const posts: Post[] = data?.posts || [];

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <p>Error loading posts: {(error as any)?.message || "Unknown error"}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center justify-between border-b pb-4 mb-8">
        <h1 className="text-xl font-bold tracking-tight uppercase text-muted-foreground text-xs">Latest Stories</h1>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
               <div className="flex-1 space-y-3">
                 <div className="h-4 bg-muted w-1/4 rounded" />
                 <div className="h-6 bg-muted w-3/4 rounded" />
                 <div className="h-4 bg-muted w-full rounded" />
               </div>
               <div className="w-32 h-24 bg-muted rounded hidden md:block" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
