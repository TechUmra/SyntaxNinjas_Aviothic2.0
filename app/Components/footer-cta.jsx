"use client";
import Link from "next/link";
import React from "react";

export default function FooterCTA() {
  return (
    <section id="donate" className="bg-indigo-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid items-center gap-6 md:grid-cols-2">
          {/* Left Side */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Turn surplus into support
            </h2>
            <p className="mt-3 text-base opacity-90">
              List excess food in minutes. We’ll match it locally so it gets served, not wasted.
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link
              href="#request"
              className="px-6 py-3 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-gray-100 transition"
            >
              Request assistance
            </Link>
            <Link
              href="#donate"
              className="px-6 py-3 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition"
            >
              Donate food
            </Link>
          </div>
        </div>

        {/* Screen Reader Text */}
        <p className="sr-only">
          Footer call-to-action section encouraging users to donate food or request assistance.
        </p>
      </div>
    </section>
  );
}
