"use client";

import { Button } from "@/components/ui/Button";
import { FiEdit2 } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface EditPostButtonProps {
  postId: string;
  authorId: string;
}

export function EditPostButton({ postId, authorId }: EditPostButtonProps) {
  const { user } = useAuth();

  // Check if current user is the author
  if (!user || user.id !== authorId) {
    return null;
  }

  return (
    <Link href={`/posts/${postId}/edit`}>
        <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground gap-2 font-serif"
        >
        <FiEdit2 className="w-4 h-4" />
        Edit
        </Button>
    </Link>
  );
}
