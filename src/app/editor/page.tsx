import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import NoteProvider from "@/components/NoteProvider";
import LogoutButton from "@/components/Auth/LogoutButton";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  console.log("noteIdParam", noteIdParam);

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam![0]
    : noteIdParam || "";

  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: session.user.id },
  });

  let notes = await prisma.note.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <NoteProvider>
      <SidebarProvider>
        <AppSidebar notes={notes} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <LogoutButton />
          </header>
          <div className="flex h-full flex-col items-center gap-4 m-2">
            <div className="flex w-full justify-end gap-2">
              <AskAIButton user={session.user} />
              <NewNoteButton user={session.user} />
            </div>
            <NoteTextInput
              noteId={noteId}
              startingNoteText={note ? note.text : ""}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </NoteProvider>
  );
}
