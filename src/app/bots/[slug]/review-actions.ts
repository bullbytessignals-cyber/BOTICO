"use server";

import { revalidatePath } from "next/cache";
import { createReview } from "@/lib/reviews";

export interface ReviewState {
  error?: string;
  done?: boolean;
}

export async function submitReview(_prev: ReviewState, fd: FormData): Promise<ReviewState> {
  const slug = String(fd.get("botSlug") ?? "").trim();
  const name = String(fd.get("name") ?? "").trim();
  const rating = Number(fd.get("rating") ?? 0);
  const comment = String(fd.get("comment") ?? "").trim();

  if (!slug) return { error: "Missing bot." };
  if (!name) return { error: "Please enter your name." };
  if (!rating || rating < 1) return { error: "Please pick a star rating." };
  if (!comment) return { error: "Please write a short review." };

  const res = await createReview({ botSlug: slug, name, rating, comment });
  if (!res.ok) return { error: res.error };

  revalidatePath(`/bots/${slug}`);
  return { done: true };
}
