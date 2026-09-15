"use client";

import { useState } from "react";
import { askAboutNotes } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function AskNotes() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    const result = await askAboutNotes(question);
    setAnswer(result);
    setLoading(false);
  }

  return (
    <Card className="p-4 mb-8">
      <h2 className="font-semibold mb-3">Ask Your Notes</h2>
      <div className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What did I write about React last month?"
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <Button onClick={() => handleAsk()} isDisabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </Button>
      </div>
      {answer && (
        <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">{answer}</p>
      )}
    </Card>
  );
}