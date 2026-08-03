import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BotForm } from "../bot-form";
import { createBotAction } from "../actions";

export default function NewBotPage() {
  return (
    <div>
      <Link href="/admin67/bots" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Back to bots
      </Link>
      <h1 className="font-display text-2xl font-bold mb-6">Add a bot</h1>
      <BotForm action={createBotAction} submitLabel="Create bot" />
    </div>
  );
}
