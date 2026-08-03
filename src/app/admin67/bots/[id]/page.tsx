import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBotForEdit } from "@/lib/bots-admin";
import { BotForm } from "../bot-form";
import { updateBotAction } from "../actions";

export default async function EditBotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bot = await getBotForEdit(id);
  if (!bot) notFound();

  return (
    <div>
      <Link href="/admin67/bots" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Back to bots
      </Link>
      <h1 className="font-display text-2xl font-bold mb-6">Edit bot · {bot.name}</h1>
      <BotForm action={updateBotAction} bot={bot} submitLabel="Save changes" />
    </div>
  );
}
