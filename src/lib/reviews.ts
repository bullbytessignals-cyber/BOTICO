import { supabaseService } from "@/lib/supabase/server";

const TABLE = "bot_reviews";

export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export interface ReviewInput {
  botSlug: string;
  name: string;
  rating: number; // 1-5
  comment?: string;
}

export interface Review extends ReviewInput {
  id: string;
  created_at: string;
  status: ReviewStatus;
}

type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

function fromRow(r: Record<string, unknown>): Review {
  return {
    id: r.id as string,
    created_at: r.created_at as string,
    botSlug: (r.bot_slug as string) ?? "",
    name: (r.name as string) ?? "Anonymous",
    rating: Number(r.rating ?? 5),
    comment: (r.comment as string) ?? "",
    status: (r.status as ReviewStatus) ?? "pending",
  };
}

/** Approved reviews for one bot (public). */
export async function listApprovedReviews(botSlug: string): Promise<Review[]> {
  const sb = supabaseService();
  if (!sb || !botSlug) return [];
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("bot_slug", botSlug)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(fromRow);
}

/** All reviews (admin moderation). */
export async function listAllReviews(): Promise<Result<Review[]>> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { data, error } = await sb.from(TABLE).select("*").order("created_at", { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []).map(fromRow) };
}

export async function createReview(input: ReviewInput): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const rating = Math.max(1, Math.min(5, Math.round(input.rating || 5)));
  const { error } = await sb.from(TABLE).insert({
    bot_slug: input.botSlug,
    name: input.name || "Anonymous",
    rating,
    comment: input.comment || null,
    status: "pending",
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function setReviewStatus(id: string, status: ReviewStatus): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from(TABLE).update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteReview(id: string): Promise<Result> {
  const sb = supabaseService();
  if (!sb) return { ok: false, error: "Backend not connected." };
  const { error } = await sb.from(TABLE).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
