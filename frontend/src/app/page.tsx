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
      <div className="container mx-auto px-4 py-20 text-center text-destructive">
        <p className="mb-4">Error loading stories: {(error as any)?.message || "Unknown error"}</p>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-8">
      {isLoading ? (
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground animate-pulse">Loading Stories...</div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="container mx-auto px-4">
             {heroPost && <HeroPost post={heroPost} />}
          </div>

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content - Grid */}
              <div className="lg:col-span-8">
                 <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
                    <h3 className="text-xl font-bold tracking-tight font-serif">Latest Stories</h3>
                    <div className="hidden md:flex gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <span className="text-foreground cursor-pointer">All</span>
                      <span className="hover:text-foreground cursor-pointer transition-colors">Design</span>
                      <span className="hover:text-foreground cursor-pointer transition-colors">Tech</span>
                      <span className="hover:text-foreground cursor-pointer transition-colors">Culture</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                   {gridPosts.map((post) => (
                     <PostCard key={post.id} post={post} />
                   ))}
                 </div>
                 
                 {gridPosts.length === 0 && (
                   <div className="text-center py-20 text-muted-foreground">
                     No more stories to show.
                   </div>
                 )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 pl-0 lg:pl-8 border-l-0 lg:border-l border-border/50">
                <div className="sticky top-24">
                  <Sidebar />
                </div>
              </aside>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
