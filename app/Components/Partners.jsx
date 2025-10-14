"use client";
import React from "react";

export default function Partners() {
  const partners = [
    { name: "Local Grocer Co.", alt: "Local Grocer Co. logo" },
    { name: "FreshBite", alt: "FreshBite logo" },
    { name: "GreenCart", alt: "GreenCart logo" },
    { name: "Community Fridge Network", alt: "Community Fridge Network logo" },
    { name: "City Shelter Alliance", alt: "City Shelter Alliance logo" },
  ];

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
            Trusted by community partners
          </h2>
          <p className="mt-3 text-gray-600">
            We collaborate across the food system to make redistribution simple and safe.
          </p>
        </div>

        {/* Logos Grid */}
        <div className="mt-8 grid items-center justify-items-center gap-6 sm:grid-cols-3 md:grid-cols-5">
          {partners.map((p) => (
            <img
              key={p.name}
              src="/monochrome-logo-placeholder.jpg"
              alt={p.alt}
              className="h-10 w-auto opacity-80 hover:opacity-100 transition"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
