import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant?: "neutral" | "warning" | "success";
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
}: StatCardProps) {
  const badgeStyles = {
    neutral: "bg-cream text-mocha border-caramel/25",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  }[badge?.variant || "neutral"];

  return (
    <div className="bg-warm-white rounded-2xl p-5 border border-caramel/20 shadow-xs flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-mocha uppercase tracking-wider font-sans">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold text-espresso mt-1 font-sans tracking-tight">
            {value}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-caramel shrink-0 border border-caramel/15">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 pt-3 border-t border-caramel/10 flex items-center justify-between text-xs font-sans">
          {subtitle && <span className="text-mocha">{subtitle}</span>}
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${badgeStyles}`}
            >
              {badge.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
