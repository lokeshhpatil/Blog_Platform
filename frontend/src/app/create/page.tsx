"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiImage } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreatePostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push(`/posts/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || "Failed to create post");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("tag", tags); 
    if (image) {
      formData.append("image", image);
    }
    
    mutation.mutate(formData);
  };

  const isLoading = mutation.isPending;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 font-serif">Write a Story</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter a captivating title"
            required
            className="text-lg font-semibold font-serif"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Cover Image</label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {image ? (
              <div className="text-sm text-primary font-medium">{image.name}</div>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <FiImage size={32} className="mb-2" />
                <span>Click to upload cover image</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tell your story..."
            required
            className="w-full min-h-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y font-serif leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
          <Input 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="technology, life, coding"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" isLoading={isLoading} className="rounded-full px-8">Publish</Button>
        </div>
      </form>
    </div>
  );
}
