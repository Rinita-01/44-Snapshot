import React from "react";

export function SparkBar({ data, color }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div className="mb-2 text-sm font-semibold">Monthly New Users</div>
      <svg viewBox="0 0 240 80" className="h-24 w-full" aria-hidden="true">
        {data.map((value, idx) => {
          const height = (value / max) * 60;
          return (
            <rect
              key={idx}
              x={idx * 18 + 5}
              y={70 - height}
              width={12}
              height={height}
              rx={4}
              fill={color}
            />
          );
        })}
      </svg>
    </div>
  );
}

export function LineChart({ data, color, title }) {
  const max = Math.max(...data, 1);
  const points = data
    .map((value, idx) => {
      const x = (idx / (data.length - 1)) * 220 + 10;
      const y = 70 - (value / max) * 50;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <div className="mb-2 text-sm font-semibold">{title}</div>
      <svg viewBox="0 0 240 80" className="h-24 w-full" aria-hidden="true">
        <polyline fill="none" stroke={color} strokeWidth="3" points={points} />
        {data.map((value, idx) => {
          const x = (idx / (data.length - 1)) * 220 + 10;
          const y = 70 - (value / max) * 50;
          return <circle key={idx} cx={x} cy={y} r="3" fill={color} />;
        })}
      </svg>
    </div>
  );
}