"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { askGemini, summarizeNote, generateFlashcards } from "./gemini";

export async function createNote(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim() === "") return;

  await prisma.note.create({
    data: {
      userId,
      title: title.trim(),
      content: content?.trim() || "",
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteNote(noteId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.note.deleteMany({
    where: { id: noteId, userId },
  });

  revalidatePath("/dashboard");
}

export async function askAboutNotes(question: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const notes = await prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (notes.length === 0) {
    return "You don't have any notes yet — add some first!";
  }

  const notesContext = notes
    .map((n) => `Title: ${n.title}\nContent: ${n.content}\nDate: ${n.createdAt.toDateString()}`)
    .join("\n\n---\n\n");

  const answer = await askGemini(question, notesContext);
  return answer;
}

export async function getSummary(content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const summary = await summarizeNote(content);
  return summary;
}

export async function getFlashcards(content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const flashcards = await generateFlashcards(content);
  return flashcards;
}