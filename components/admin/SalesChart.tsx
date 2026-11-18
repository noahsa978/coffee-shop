"use client";

import { useSyncExternalStore } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockLast7DaysSales } from "@/data/admin-mock";

interface TooltipPayloadItem {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-warm-white p-3 rounded-xl border border-caramel/25 shadow-md text-xs font-sans">
        <p className="font-semibold text-espresso">{label}</p>
        <p className="text-caramel mt-1 font-medium">
          Sales: <span className="font-semibold">${payload[0].value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
}

// React 19 idiomatic mounted snapshot to prevent SSR hydration mismatch
function subscribeNoop() {
  return () => {};
}

export function SalesChart() {
  const isMounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  if (!isMounted) {
    return (
      <div className="h-[220px] w-full flex items-center justify-center bg-cream/40 rounded-xl">
        <span className="text-xs text-mocha">Loading sales chart...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={mockLast7DaysSales}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="caramelGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C68B59" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#C68B59" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#FAF3E8" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#7A5C48"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#FAF3E8" }}
          />
          <YAxis
            stroke="#7A5C48"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#C68B59"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#caramelGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
