import { Bot, FileText } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-block">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-10 h-10 rounded-md gradient-blue flex items-center justify-center text-white font-bold">
          <FileText />
        </div>
        <h1 className="text-2xl flex items-center font-bold">
          NotesAI-ng <Bot className="mx-2" />
        </h1>
      </div>
    </Link>
  );
}
