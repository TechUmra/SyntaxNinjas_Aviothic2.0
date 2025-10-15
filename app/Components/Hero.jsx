"use client";
import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <header className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-20">
        {/* Navbar */}
        

        {/* Hero Section */}
        <div className="mt-10 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Left Column */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Share surplus. Nourish communities.
            </h1>
            <p className="mt-4 text-gray-600 text-base leading-relaxed">
              Connect restaurants, grocers, and neighbors with local food banks
              and shelters. Prevent waste and ensure fresh meals reach people
              who need them most.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="#donate"
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Donate food
              </Link>
              <Link
                href="#request"
                className="px-6 py-3 rounded-lg bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition"
              >
                Request assistance
              </Link>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              It takes just a few minutes to list surplus food safely and responsibly.
            </p>
          </div>

          {/* Right Column */}
          <div className="relative">
            <img
              src="/fresh-produce-food-donation-table.jpg"
              alt="Fresh produce and prepared meals organized for donation"
              className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
