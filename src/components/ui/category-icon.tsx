import {
  Zap, Timer, Newspaper, Landmark, Crosshair, TrendingUp, Grid3x3,
  Waves, Rocket, Repeat, Copy, BrainCircuit, Coins, DollarSign, Bitcoin,
  BarChart3, Sunrise, Building2, Moon, ShieldCheck, BadgeCheck, Users, Crown,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Zap, Timer, Newspaper, Landmark, Crosshair, TrendingUp, Grid3x3,
  Waves, Rocket, Repeat, Copy, BrainCircuit, Coins, DollarSign, Bitcoin,
  BarChart3, Sunrise, Building2, Moon, ShieldCheck, BadgeCheck, Users, Crown,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = MAP[name] ?? Zap;
  return <Icon className={className} />;
}
