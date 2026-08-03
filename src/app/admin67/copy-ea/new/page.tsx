import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProviderForm } from "../provider-form";
import { createProviderAction } from "../actions";

export default function NewProviderPage() {
  return (
    <div>
      <Link href="/admin67/copy-ea" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Back to Copy EA
      </Link>
      <h1 className="font-display text-2xl font-bold mb-6">Add a Copy EA trader</h1>
      <ProviderForm action={createProviderAction} submitLabel="Create trader" />
    </div>
  );
}
