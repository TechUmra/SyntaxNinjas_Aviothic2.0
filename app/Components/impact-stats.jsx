"use client";
import React from "react";

export default function ImpactStats() {
  const stats = [
    { label: "Meals shared", value: "1.2M+" },
    { label: "Partners on board", value: "2,400+" },
    { label: "Food saved (lbs)", value: "8.6M+" },
  ];

  return (
    <section id="impact" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
            Real, measurable impact
          </h2>
          <p className="mt-3 text-gray-600">
            Together, we reduce waste and improve food access in neighborhoods everywhere.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="h-full rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-8 flex flex-col items-center justify-center"
            >
              <p className="text-3xl font-semibold tracking-tight text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
