"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Post } from "@/types";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return { results: [] };
      const res = await api.get(`/posts/search_top?q=${encodeURIComponent(query)}&limit=20`);
      return res.data;
    },
    enabled: !!query,
  });

  const posts: any[] = data?.results || [];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-serif font-bold mb-8 text-center">
        Search Results for "{query}"
      </h1>
      
      {isLoading ? (
        <div className="text-center py-20">Searching...</div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {posts.map((post) => (
            // Map search result structure to PostCard props if needed, or ensure PostCard handles it
            // The search_top endpoint returns a slightly different structure (body_snippet instead of body)
            // We might need to adapt it or update PostCard to be flexible.
            // For now, let's cast it and see, or map it.
            <PostCard key={post.id} post={{
                ...post,
                body: post.body_snippet || post.body, // Handle snippet
                author: { username: "Unknown", id: post.author_id } // Search might not return full author obj
            } as Post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          No stories found matching your search.
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
