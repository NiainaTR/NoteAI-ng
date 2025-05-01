import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/Auth/LogoutButton";
import { NotepadText } from "lucide-react";
import prisma from "@/lib/prisma";
import NotesListClient from "@/components/NotesListClient";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }
  
  const notes = await prisma.note.findMany({
    where: {
      authorId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <main className="home-container">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <LogoutButton />
        </div>
      </Header>

      <NotesListClient initialNotes={notes} user={{ ...session.user, image: session.user.image ?? null }}/>
    </main>
  );
}
