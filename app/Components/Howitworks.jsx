"use client";
import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      title: "List surplus",
      description:
        "Restaurants, grocers, and households list extra food with pickup details and safety notes.",
      number: 1,
    },
    {
      title: "Match & pick up",
      description:
        "Local nonprofits and volunteers claim suitable items and arrange fast, safe pickup.",
      number: 2,
    },
    {
      title: "Deliver & serve",
      description:
        "Food reaches nearby shelters and community fridges while it’s still fresh.",
      number: 3,
    },
  ];

  return (
    <section id="how-it-works" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
            How it works
          </h2>
          <p className="mt-3 text-gray-600">
            A simple, safe flow designed with partners to minimize waste and maximize impact.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.number}
              className="h-full rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-indigo-600 text-white font-semibold"
                  aria-hidden="true"
                >
                  {s.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{s.title}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 flex-1">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
