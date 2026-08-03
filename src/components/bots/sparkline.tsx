import type { EquityPoint } from "@/lib/data/types";

/**
 * Lightweight SVG equity curve. Renders identically on server and client
 * (pure function of the data) so it is safe in server components.
 */
export function Sparkline({
  data,
  stroke = "#22d3ee",
  height = 56,
  width = 240,
  fill = true,
  id,
}: {
  data: EquityPoint[];
  stroke?: string;
  height?: number;
  width?: number;
  fill?: boolean;
  id: string;
}) {
  if (!data.length) return null;
  const values = data.map((d) => d.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d.v - min) / range) * (height - 6) - 3;
    return [x, y] as const;
  });

  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#grad-${id})`} />}
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
