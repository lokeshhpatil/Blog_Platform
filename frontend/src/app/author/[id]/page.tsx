"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Post } from "@/types";
import { PostCard } from "@/components/PostCard";
import { useParams } from "next/navigation";

export default function AuthorPage() {
  const { id } = useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ["posts", "author", id],
    queryFn: async () => {
      const res = await api.get(`/posts/?author_id=${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const posts: Post[] = data?.posts || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Author Profile</h1>
        <p className="text-muted-foreground">Posts by this author</p>
      </div>
      
      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12">
          No posts found for this author.
        </div>
      )}
    </div>
  );
}
