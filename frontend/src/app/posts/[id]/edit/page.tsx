"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiImage, FiX, FiArrowLeft } from "react-icons/fi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/types";
import Link from "next/link";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // Fetch existing post
  const { data: post, isLoading: isFetching, error } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
       const res = await api.get(`/posts/${id}`);
       return res.data;
    },
    enabled: !!id,
    retry: false
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setTags(Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "");
      if (post.image?.url) {
        setExistingImageUrl(post.image.url);
      }
    }
  }, [post]);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // Use PUT for update
      const { data } = await api.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success("Story updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push(`/posts/${id}`);
    },
    onError: (error: any) => {
      console.error('Update post error:', error, error.response?.data);
      toast.error(error.response?.data?.msg || "Failed to update story");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("tags", tags); // Note: Backend expects "tags" for JSON but might check "tag" or "tags" in form data. Checking backend code... 
    // Backend `update_post` for form data: `tags = request.form.get("tags")`. 
    // And it splits by comma.
    
    if (image) {
      formData.append("image", image);
    } else if (existingImageUrl === null && post?.image?.url) {
        // If user removed the existing image (we'll implement a remove button)
        // For now, if we have a way to explicit remove, we might need to send something.
        // But backend: if "image" in data and data.get("image") is None -> updates["image"] = None (JSON specific)
        // For multipart, if no file is sent, it doesn't remove the old one unless we have specific logic.
        // Looking at backend `update_post`:
        // For multipart: `file = request.files.get("image")`. If file, update. 
        // It doesn't seem to support "removing" image via multipart form easily unless we send a flag or json.
        // But let's assume replacing for now or keeping as is.
    }
    
    mutation.mutate(formData);
  };

  const removeImage = () => {
      setImage(null);
      // If we want to support removing the existing image entirely, we might need a separate API call or handle it carefully.
      // For this MVP, we just clear the *new* file selection, or hide the preview.
      // If `existingImageUrl` is present, clearing `image` (file) just means "don't upload new one".
      // If user wants to DELETE the existing image, that's a bit more complex with current backend `update_post` multipart logic.
      // Let's just handle "Replace" or "Cancel New Upload" for now.
      // If the user wants to remove the existing image, they might not be able to do it easily without JSON.
      // But let's stick to "Cancel selection" logic for file input.
  };

  const isLoading = mutation.isPending || isFetching;

  if (isFetching) {
       return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (error) {
      return (
          <div className="container mx-auto px-4 py-12 text-center">
              <h1 className="text-2xl font-bold">Error loading post</h1>
              <p className="text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p>
              <Button onClick={() => router.push(`/posts/${id}`)} className="mt-4">Back</Button>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl min-h-screen">
      <div className="mb-8">
          <Link href={`/posts/${id}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <FiArrowLeft className="mr-2" />
              Back to Post
          </Link>
      </div>

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

        {/* Image Upload / Preview */}
        <div className="relative group">
          {image ? (
            // Showing NEWLY selected image
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                title="Remove selected image"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : existingImageUrl ? (
            // Showing EXISTING image
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
               <img src={existingImageUrl} alt="Existing" className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
                        <FiImage size={20} />
                        <span>Change Image</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                            className="hidden"
                        />
                    </label>
               </div>
            </div>
          ) : (
            // No image at all
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
          <Button type="button" variant="ghost" onClick={() => router.push(`/posts/${id}`)} className="text-muted-foreground hover:text-foreground">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
