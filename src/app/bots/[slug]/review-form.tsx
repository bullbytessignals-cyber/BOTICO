"use client";

import { useActionState, useState } from "react";
import { Star, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitReview, type ReviewState } from "./review-actions";

const input =
  "w-full h-11 px-4 rounded-xl bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 placeholder:text-muted/60";

export function ReviewForm({ botSlug }: { botSlug: string }) {
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(submitReview, {});
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (state.done) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-5 text-center">
        <CheckCircle2 className="size-7 text-success mx-auto" />
        <p className="mt-2 text-sm text-foreground font-medium">Thanks for your review!</p>
        <p className="text-xs text-muted">It will appear here once approved.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-border bg-black/10 p-5 space-y-3">
      <h4 className="font-semibold">Write a review</h4>
      <input type="hidden" name="botSlug" value={botSlug} />
      <input type="hidden" name="rating" value={rating} />

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            className="p-0.5"
          >
            <Star
              className={`size-6 transition-colors ${
                (hover || rating) >= n ? "fill-warning text-warning" : "text-muted/50"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <input name="name" className={input} placeholder="Your name *" />
      </div>
      <textarea
        name="comment"
        rows={3}
        className="w-full px-4 py-3 rounded-xl bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 resize-y placeholder:text-muted/60"
        placeholder="Share your experience with this bot… *"
      />

      {state.error && (
        <div className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="size-4 shrink-0" /> {state.error}
        </div>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? (<><Loader2 className="size-4 animate-spin" /> Submitting…</>) : "Submit review"}
      </Button>
    </form>
  );
}
