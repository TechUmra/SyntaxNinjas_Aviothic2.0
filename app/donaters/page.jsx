"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DonatersPage() {
  const [donaters, setDonaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonaters();
  }, []);

  const fetchDonaters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email")
      .eq("role", "donor");

    if (error) {
      console.error("Error fetching donaters:", error);
      setDonaters([]);
    } else {
      setDonaters(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">All Donaters</h1>

      {loading ? (
        <p>Loading donaters...</p>
      ) : donaters.length === 0 ? (
        <p>No donaters found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {donaters.map((donater) => (
            <div
              key={donater.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{donater.name}</h2>
              <p>Email: {donater.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
