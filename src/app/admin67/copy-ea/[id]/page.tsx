import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProviderForEdit } from "@/lib/copy-admin";
import { ProviderForm } from "../provider-form";
import { updateProviderAction } from "../actions";

export default async function EditProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = await getProviderForEdit(id);
  if (!provider) notFound();

  return (
    <div>
      <Link href="/admin67/copy-ea" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Back to Copy EA
      </Link>
      <h1 className="font-display text-2xl font-bold mb-6">Edit trader · {provider.name}</h1>
      <ProviderForm action={updateProviderAction} provider={provider} submitLabel="Save changes" />
    </div>
  );
}
