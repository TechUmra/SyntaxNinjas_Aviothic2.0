"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NeedyDashboard() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("donations").select("*");
    if (error) {
      console.error(error);
      setError("Failed to load donations.");
    } else setDonations(data);
    setLoading(false);
  };

  const renderMap = (location) => {
    if (!location) return null;
    const [lat, lon] = location.split(",");
    return (
      <iframe
        className="w-full h-48 mt-2 rounded-md"
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps?q=${lat},${lon}&hl=en&z=15&output=embed`}
      ></iframe>
    );
  };

  const isExpired = (expiry) => new Date(expiry) < new Date();

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center py-10 px-4">
      <h2 className="text-3xl font-bold text-yellow-700 mb-6">🙏 Needy Dashboard</h2>

      {loading && <p>Loading donations...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && donations.length === 0 && <p>No donations available yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {donations.map((d) => (
          <div
            key={d.id}
            className={`bg-white p-4 shadow-md rounded-lg transition-transform transform hover:scale-105`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg text-orange-600">{d.food_name}</h3>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  isExpired(d.expiry_time)
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {isExpired(d.expiry_time) ? "Expired" : "Available"}
              </span>
            </div>
            <p>🍽️ Quantity: {d.quantity}</p>
            <p>⏰ Expires: {new Date(d.expiry_time).toLocaleString()}</p>
            <p>📍 Location: {d.location || "Not provided"}</p>
            {renderMap(d.location)}
          </div>
        ))}
      </div>
    </div>
  );
}
