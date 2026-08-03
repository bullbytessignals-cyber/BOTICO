"use client";

import { useActionState, useRef, useEffect } from "react";
import { Plus, Trash2, AlertCircle, Loader2, BookOpen, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JournalEntry } from "@/lib/journal";
import { addJournalEntry, removeJournalEntry, type JournalState } from "./journal-actions";

const input =
  "w-full h-10 px-3 rounded-lg bg-black/20 border border-border text-sm outline-none focus:ring-2 focus:ring-cyan/50 placeholder:text-muted/60";

function fmt(n?: number) {
  return n == null ? "—" : n.toLocaleString(undefined, { maximumFractionDigits: 5 });
}
function usd(n: number) {
  const s = n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  return n > 0 ? `+${s}` : s;
}

export function JournalPanel({ entries }: { entries: JournalEntry[] }) {
  const [state, formAction, pending] = useActionState<JournalState, FormData>(addJournalEntry, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the add form after a successful insert.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  const totalPnl = entries.reduce((a, e) => a + e.pnl, 0);
  const wins = entries.filter((e) => e.pnl > 0).length;
  const winRate = entries.length ? Math.round((wins / entries.length) * 100) : 0;

  return (
    <section id="journal" className="scroll-mt-28">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <BookOpen className="size-4 text-cyan-bright" /> Trading Journal
        </h2>
        {entries.length > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">Win rate <span className="text-foreground font-semibold">{winRate}%</span></span>
            <span className={`font-display font-bold ${totalPnl >= 0 ? "text-success" : "text-danger"}`}>
              {usd(totalPnl)}
            </span>
          </div>
        )}
      </div>

      {/* Add trade */}
      <form ref={formRef} action={formAction} className="glass rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <input name="tradedOn" type="date" className={input} aria-label="Date" />
          <input name="symbol" className={input} placeholder="Symbol *" />
          <select name="side" className={input} defaultValue="buy" aria-label="Side">
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          <input name="entry" type="number" step="any" className={input} placeholder="Entry" />
          <input name="exit" type="number" step="any" className={input} placeholder="Exit" />
          <input name="size" type="number" step="any" className={input} placeholder="Size / lots" />
          <input name="pnl" type="number" step="any" className={input} placeholder="P&L $" />
        </div>
        <div className="mt-2 flex flex-col sm:flex-row gap-2">
          <input name="notes" className={input + " flex-1"} placeholder="Notes (setup, mistakes, lessons…)" />
          <Button type="submit" disabled={pending} className="shrink-0">
            {pending ? (<><Loader2 className="size-4 animate-spin" /> Adding…</>) : (<><Plus className="size-4" /> Add trade</>)}
          </Button>
        </div>
        {state.error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-danger">
            <AlertCircle className="size-4 shrink-0" /> {state.error}
          </div>
        )}
      </form>

      {/* Entries */}
      {entries.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted">
          No trades logged yet. Add your first trade above to start your journal.
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Side</th>
                  <th className="px-4 py-3 font-medium text-right">Entry</th>
                  <th className="px-4 py-3 font-medium text-right">Exit</th>
                  <th className="px-4 py-3 font-medium text-right">Size</th>
                  <th className="px-4 py-3 font-medium text-right">P&L</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-white/5">
                    <td className="px-4 py-3 whitespace-nowrap text-muted">
                      {e.tradedOn || new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium">{e.symbol}</td>
                    <td className="px-4 py-3">
                      <Badge variant={e.side === "buy" ? "success" : "danger"}>
                        {e.side === "buy" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {e.side}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">{fmt(e.entry)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">{fmt(e.exit)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">{fmt(e.size)}</td>
                    <td className={`px-4 py-3 text-right tabular-nums font-semibold ${e.pnl >= 0 ? "text-success" : "text-danger"}`}>
                      {usd(e.pnl)}
                    </td>
                    <td className="px-4 py-3 max-w-[220px] truncate text-muted" title={e.notes}>{e.notes || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={removeJournalEntry}>
                        <input type="hidden" name="id" value={e.id} />
                        <button className="text-muted hover:text-danger transition-colors" aria-label="Delete">
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
