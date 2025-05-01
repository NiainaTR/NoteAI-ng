"use client";

import { NotepadText, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { deleteNoteAction } from "@/actions/notes";
import NewNoteButton from "./NewNoteButton";

// Define the Note type to match your Prisma schema
type Note = {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
};

type NotesListClientProps = {
  initialNotes: Note[];
  user: {
    image: string | null;
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

export default function NotesListClient({
  initialNotes,
  user,
}: NotesListClientProps) {
  // Use client-side state to manage notes
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [pendingNoteId, setPendingNoteId] = useState<string | null>(null);

  const handleDeleteNote = (noteId: string) => {
    setPendingNoteId(noteId);
    startTransition(async () => {
      const { errorMessage } = await deleteNoteAction(noteId);

      if (!errorMessage) {
        // Update the local state to remove the deleted note
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));

        toast({
          title: "Note Deleted",
          description: "You have successfully deleted the note",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      setPendingNoteId(null);
    });
  };

  if (notes.length === 0) {
    return (
      <div className="document-list-empty">
        <NotepadText size={100} />
        <NewNoteButton user={user} />
      </div>
    );
  }

  return (
    <div className="document-list-container">
      <div className="max-w-[730px] items-end flex w-full justify-between">
        <h3 className="text-2xl font-semibold">My all notes</h3>
        <NewNoteButton user={user} />
      </div>
      <ul className="flex w-full max-w-[730px] flex-col gap-5 space-y-1">
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex items-center justify-between rounded-lg bg-doc p-5 shadow-xl"
          >
            <Link
              href={`/editor?noteId=${note.id}`}
              className="flex flex-1 items-center gap-4"
            >
              <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                <NotepadText size={40} />
              </div>
              <div className="space-y-1">
                <p className="line-clamp-1 text-lg font-bold">
                  {note.text || "BLANK NOTE"}
                </p>
                <p className="text-sm font-light text-blue-100">
                  {dateConverter(new Date(note.createdAt).toDateString())}
                </p>
              </div>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="gradient-red text-white">
                  {isPending && pendingNoteId === note.id ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this note?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your note from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteNote(note.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-24"
                  >
                    {isPending && pendingNoteId === note.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        ))}
      </ul>
    </div>
  );
}
