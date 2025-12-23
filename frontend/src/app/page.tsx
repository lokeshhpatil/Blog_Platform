"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Post } from "@/types";
import { PostCard } from "@/components/PostCard";
import { HeroPost } from "@/components/HeroPost";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", "latest"],
    queryFn: async () => {
      const res = await api.get("/posts/?per_page=10");
      return res.data;
    },
  });

  const posts: Post[] = data?.posts || [];
  const heroPost = posts[0];
  const gridPosts = posts.slice(1);

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        <p>Error loading posts: {(error as any)?.message || "Unknown error"}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {isLoading ? (
        <div className="container mx-auto px-4 py-20 text-center">Loading...</div>
      ) : (
        <>
          {/* Hero Section */}
          {heroPost && <HeroPost post={heroPost} />}

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content - Grid */}
              <div className="lg:col-span-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                   {gridPosts.map((post) => (
                     <PostCard key={post.id} post={post} />
                   ))}
                 </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <Sidebar />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
