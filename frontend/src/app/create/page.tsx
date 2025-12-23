"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiImage, FiX } from "react-icons/fi";
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
      toast.success("Story published successfully.");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push(`/posts/${data.id}`);
    },
    onError: (error: any) => {
      console.error('Create post error:', error, error.response?.data);
      toast.error(error.response?.data?.msg || "Failed to publish story");
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
    <div className="container mx-auto px-4 py-12 max-w-2xl min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title Input */}
        <div>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Title"
            required
            className="w-full text-5xl font-serif font-bold placeholder:text-muted-foreground/30 bg-transparent border-none outline-none focus:ring-0 px-0"
          />
        </div>

        {/* Image Upload */}
        <div className="relative group">
          {image ? (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors w-fit p-2 -ml-2 rounded-lg hover:bg-secondary/50">
               <FiImage size={20} />
               <span className="text-sm font-medium">Add Cover Image</span>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={(e) => setImage(e.target.files?.[0] || null)}
                 className="hidden"
               />
            </label>
          )}
        </div>

        {/* Content Textarea */}
        <div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tell your story..."
            required
            className="w-full min-h-[500px] resize-none border-none bg-transparent text-xl font-serif leading-relaxed placeholder:text-muted-foreground/30 focus:ring-0 outline-none px-0"
          />
        </div>

        {/* Tags */}
        <div className="border-t border-border pt-6">
          <Input 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="Add relevant topics (e.g. Design, Life)..."
            className="border-none bg-transparent px-0 font-medium text-muted-foreground focus:ring-0 placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
            Discard
          </Button>
          <Button type="submit" isLoading={isLoading} className="rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest">
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
