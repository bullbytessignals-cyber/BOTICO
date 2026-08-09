import { Star, Trash2 } from "lucide-react";
import { listAllReviews, type Review, type ReviewStatus } from "@/lib/reviews";
import { Badge } from "@/components/ui/badge";
import { adminSetReviewStatus, adminDeleteReview } from "../actions";

const STATUS_META: Record<ReviewStatus, { label: string; variant: "cyan" | "success" | "danger" }> = {
  pending: { label: "Pending", variant: "cyan" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
};

export default async function AdminReviewsPage() {
  const res = await listAllReviews();
  const reviews: Review[] = res.ok ? (res.data ?? []) : [];
  const backendError = res.ok ? null : res.error;
  const count = (s: ReviewStatus) => reviews.filter((r) => r.status === s).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Reviews</h1>
      <p className="text-sm text-muted mt-1">{reviews.length} total · approve to show them on the bot page</p>

      {backendError && (
        <div className="mt-5 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
          ⚠ Backend: {backendError}. Make sure the <code>bot_reviews</code> table exists.
        </div>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3">
        {(["pending", "approved", "rejected"] as ReviewStatus[]).map((s) => (
          <div key={s} className="glass rounded-2xl p-4">
            <div className="text-xs uppercase tracking-wide text-muted">{STATUS_META[s].label}</div>
            <div className="mt-1 font-display text-xl font-bold">{count(s)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {reviews.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center text-muted">No reviews yet.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => {
              const meta = STATUS_META[r.status] ?? STATUS_META.pending;
              return (
                <div key={r.id} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{r.name}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} className={`size-3.5 ${r.rating >= n ? "fill-warning text-warning" : "text-muted/40"}`} />
                          ))}
                        </div>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                        <Badge>{r.botSlug}</Badge>
                      </div>
                      <div className="text-xs text-muted mt-0.5">{new Date(r.created_at).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <form action={adminSetReviewStatus}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button className="h-9 px-4 rounded-lg text-sm font-medium bg-success/15 text-success hover:bg-success/25 transition-colors disabled:opacity-40" disabled={r.status === "approved"}>Approve</button>
                      </form>
                      <form action={adminSetReviewStatus}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value="rejected" />
                        <button className="h-9 px-4 rounded-lg text-sm font-medium bg-danger/15 text-danger hover:bg-danger/25 transition-colors disabled:opacity-40" disabled={r.status === "rejected"}>Reject</button>
                      </form>
                      <form action={adminDeleteReview}>
                        <input type="hidden" name="id" value={r.id} />
                        <button title="Delete" className="grid place-items-center size-9 rounded-lg text-muted hover:text-danger hover:bg-danger/10"><Trash2 className="size-4" /></button>
                      </form>
                    </div>
                  </div>
                  {r.comment && <p className="mt-3 text-sm text-muted border-t border-border pt-3 whitespace-pre-wrap">{r.comment}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
