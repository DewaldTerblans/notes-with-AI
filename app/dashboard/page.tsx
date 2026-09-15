import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createNote } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AskNotes from "@/components/AskNotes";
import NoteCard from "@/components/NoteCard";

export default async function DashboardPage() {
  const user = await currentUser();

  const notes = await prisma.note.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        {user?.firstName ? `${user.firstName}'s Notes` : "My Notes"}
      </h1>

      <AskNotes />

      <form action={createNote} className="flex flex-col gap-2 mb-8">
        <Input type="text" name="title" placeholder="Note title" required />
        <Textarea
          name="content"
          placeholder="Write your note here (Markdown supported)..."
          rows={5}
        />
        <Button type="submit" className="self-start">
          Save Note
        </Button>
      </form>

      <div className="space-y-3">
        {notes.length === 0 && (
          <p className="text-gray-500">No notes yet — write your first one above.</p>
        )}

        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}