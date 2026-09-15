import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function askGemini(question: string, notesContext: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `You are a helpful assistant that answers questions based ONLY on the user's personal notes provided below. If the answer isn't in the notes, say so honestly instead of making something up.

NOTES:
${notesContext}

QUESTION: ${question}

ANSWER:`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    // If Gemini is temporarily overloaded or fails for any reason,
    // show a friendly message instead of crashing the whole page
    console.error("Gemini error:", error);
    return "Sorry, the AI is temporarily busy. Please try asking again in a moment.";
  }
}

export async function summarizeNote(content: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Summarize the following note in 2-3 concise sentences. Focus on the key points only.

NOTE:
${content}

SUMMARY:`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    return "Sorry, couldn't generate a summary right now. Please try again.";
  }
}

export async function generateFlashcards(content: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Based on the note below, generate 3-5 flashcards to help someone study or remember the key points. 

Format your response EXACTLY like this, with no extra text before or after:
Q: [question]
A: [answer]

Q: [question]
A: [answer]

NOTE:
${content}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    return "Sorry, couldn't generate flashcards right now. Please try again.";
  }
}