"use server";

import { geminiModel } from "@/lib/GeminiApi";
import prisma from "@/lib/prisma";

export const createNoteAction = async (
  noteId: string,
  user: { id: string }
) => {
  try {
    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    if (error instanceof Error) {
      return { errorMessage: error.message };
    } else {
      return { errorMessage: "An error occurred" };
    }
  }
};

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });

    return { errorMessage: null };
  } catch (error) {
    if (error instanceof Error) {
      return { errorMessage: error.message };
    } else {
      return { errorMessage: "An error occurred" };
    }
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    await prisma.note.delete({
      where: { id: noteId },
    });

    return { errorMessage: null };
  } catch (error) {
    if (error instanceof Error) {
      return { errorMessage: error.message };
    } else {
      return { errorMessage: "An error occurred" };
    }
  }
};

/*
export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
  user: { id: string }
) => {
  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true, createdAt: true, updatedAt: true },
  });

  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }

  const formattedNotes = notes
    .map((note) =>
      `
        Text: ${note.text}
        Created at: ${note.createdAt}
        Last updated: ${note.updatedAt}
        `.trim()
    )
    .join("\n");

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "developer",
      content: `
            You are a helpful assistant that answers questions about a user's notes. 
            Assume all questions are related to the user's notes. 
            Make sure that your answers are not too verbose and you speak succinctly. 
            Your responses MUST be formatted in clean, valid HTML with proper structure. 
            Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
            Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
            Avoid inline styles, JavaScript, or custom attributes.
            
            Rendered like this in JSX:
            <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
      
            Here are the user's notes:
            ${formattedNotes}
            `,
    },
  ];

  for (let i = 0; i < newQuestions.length; i++) {
    messages.push({ role: "user", content: newQuestions[i] });
    if (responses.length > i) {
      messages.push({ role: "assistant", content: responses[i] });
    }
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return completion.choices[0].message.content || "A problem has occurred";
};
*/

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
  user: { id: string }
) => {
  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true, createdAt: true, updatedAt: true },
  });

  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }

  const formattedNotes = notes
    .map((note) =>
      `
        Text: ${note.text}
        Created at: ${note.createdAt.toISOString()}
        Last updated: ${note.updatedAt.toISOString()}
        `.trim()
    )
    .join("\n");

  const prompt = `
      You are a helpful assistant that answers questions about a user's notes. 
      Assume all questions are related to the user's notes. 
      Make sure that your answers are not too verbose and you speak succinctly. 
      Your responses MUST be formatted in clean, valid HTML with proper structure. 
      Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
      Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
      Avoid inline styles, JavaScript, or custom attributes.

      Rendered like this in JSX:
      <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

      Here are the user's notes:
      ${formattedNotes}

      ${newQuestions
        .map((question, index) => {
          const previousResponse = responses[index]
            ? `\nAssistant: ${responses[index]}`
            : "";
          return `\nUser: ${question}${previousResponse}`;
        })
        .join("")}
      \nAssistant: `;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || "A problem has occurred";
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return "A problem has occurred";
  }
};
