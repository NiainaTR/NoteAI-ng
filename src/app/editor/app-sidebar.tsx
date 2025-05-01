"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import { Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Note } from "@prisma/client";
import Fuse from "fuse.js";
import SelectNoteButton from "./SelectNoteButton";
import DeleteNoteButton from "./DeleteNoteButton";

type Props = {
  notes: Note[];
};

export function AppSidebar({ notes }: Props) {
  // We need to use a local state for the notes, because we need to filter them
  const [searchText, setSearchText] = React.useState("");
  const [localNotes, setLocalNotes] = React.useState<Note[]>([]);

  React.useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const fuse = React.useMemo(() => {
    return new Fuse(localNotes, {
      keys: ["text"],
      threshold: 0.4,
    });
  }, [localNotes]);

  const filteredNotes = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : localNotes;

  const deleteNoteLocally = (noteId: string) => {
    setLocalNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== noteId)
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
        <SidebarGroup className="py-0 my-4">
          <SidebarGroupContent className="relative">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <SidebarInput
              id="search"
              placeholder="Search a note......"
              className="pl-8"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {
          <SidebarMenu className="mt-4 px-2">
            {filteredNotes.map((note) => (
              <SidebarMenuItem key={note.id} className="group/item">
                <SelectNoteButton note={note} />
                <DeleteNoteButton
                  noteId={note.id}
                  deleteNoteLocally={deleteNoteLocally}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        }
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
