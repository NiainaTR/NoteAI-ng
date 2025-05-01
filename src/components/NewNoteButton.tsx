"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { createNoteAction } from "@/actions/notes";

type NewNoteButtonProps = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
  };
};

export default function NewNoteButton({ user }: NewNoteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClickNewNoteButton = async () => {
    setLoading(true);
    const uuid = uuidv4();
    await createNoteAction(uuid, user);
    router.push(`/editor?noteId=${uuid}`);
    setLoading(false);
  };

  return (
    <Button
      onClick={handleClickNewNoteButton}
      variant="outline"
      className="flex gap-1 shadow-md gradient-blue"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <Plus className="h-4 w-4" />
          <p>New note</p>
        </>
      )}
    </Button>
  );
}
