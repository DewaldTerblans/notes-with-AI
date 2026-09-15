"use client";

import { useState } from "react";
import { deleteNote, getSummary, getFlashcards } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function NoteCard({ note }: { note: Note }) {
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

  async function handleSummarize() {
    setLoadingSummary(true);
    setSummary("");
    const result = await getSummary(note.content);
    setSummary(result);
    setLoadingSummary(false);
  }

  async function handleFlashcards() {
    setLoadingFlashcards(true);
    setFlashcards("");
    const result = await getFlashcards(note.content);
    setFlashcards(result);
    setLoadingFlashcards(false);
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <h2 className="font-semibold">{note.title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSummarize()}
            disabled={loadingSummary}
          >
            {loadingSummary ? "Summarizing..." : "Summarize"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFlashcards()}
            disabled={loadingFlashcards}
          >
            {loadingFlashcards ? "Generating..." : "Flashcards"}
          </Button>
          <form action={deleteNote.bind(null, note.id)}>
            <Button type="submit" variant="destructive" size="sm">
              Delete
            </Button>
          </form>
        </div>
      </div>

      <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">
        {note.content}
      </p>

      {summary && (
        <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-900">
          <strong>Summary:</strong> {summary}
        </div>
      )}

      {flashcards && (
        <div className="mt-3 p-3 bg-purple-50 rounded text-sm text-purple-900 whitespace-pre-wrap">
          <strong>Flashcards:</strong>
          {"\n"}
          {flashcards}
        </div>
      )}
    </Card>
  );
}
