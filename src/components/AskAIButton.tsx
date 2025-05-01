"use client";
import React, { Fragment, startTransition, useRef, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ArrowUpIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";

import "@/components/styles/ai-response.css";
import { askAIAboutNotesAction } from "@/actions/notes";

type AskAIButtonProps = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
  };
};

export default function AskAIButton({ user }: AskAIButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [questionText, setQuestionText] = React.useState("");
  const [questions, setQuestions] = React.useState<string[]>([]);
  const [responses, setResponses] = React.useState<string[]>([]);

  const [isPending, setIsPending] = useTransition();

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setQuestionText("");
      setQuestions([]);
      setResponses([]);
    }
    setOpen(isOpen);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleClickInput = () => {
    textareaRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!questionText.trim()) return;

    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(
        newQuestions,
        responses,
        user
      );
      setResponses((prev) => [...prev, response]);

      setTimeout(scrollToBottom, 100);
    });
  };

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">✨ Ask AI</Button>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar flex h-[85vh] flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>🤖 ✨ Ask AI about Your Notes</DialogTitle>
          <DialogDescription>
            Out AI can answer your questions about your notes. Just ask a
            question
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-8">
          {questions.map((question, index) => (
            <Fragment key={index}>
              <p className="bg-muted text-muted-foreground ml-auto max-w-[60%] rounded-md px-2 py-1 text-sm">
                {question}
              </p>
              {responses[index] && (
                <p
                  className="bot-response text-muted-foreground text-sm"
                  dangerouslySetInnerHTML={{ __html: responses[index] }}
                />
              )}
            </Fragment>
          ))}
          {isPending && <p className="animate-pulse text-sm">Thinking...</p>}
        </div>
        <div
          className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
          onClick={handleClickInput}
        >
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything about your notes..."
            className="placeholder:text-muted-foreground resize-none rounded-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{
              minHeight: "0",
              lineHeight: "normal",
            }}
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            value={questionText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setQuestionText(e.target.value)
            }
          />
          <Button className="ml-auto size-8 rounded-full">
            <ArrowUpIcon className="text-background" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
