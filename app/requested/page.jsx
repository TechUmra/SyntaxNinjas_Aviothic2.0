"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RequestedDonations() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserAndLocation();
  }, []);

  const fetchUserAndLocation = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("User fetch error:", userError);
      setError("Please sign in to view requests.");
      setLoading(false);
      return;
    }

    const user = userData?.user;
    if (!user) {
      setError("No authenticated user found.");
      setLoading(false);
      return;
    }

    setUserId(user.id);
    getUserLocation();
  };

  const getUserLocation = (uid) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setUserLocation(location);
          fetchRequests(location);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Please enable location access to view nearby requests.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
    }
  };

  const fetchRequests = async ({ lat: userLat, lon: userLon }) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requested_donations")
      .select("*")
      .eq("status", "pending");

    if (error) {
      console.error(error);
      setError("Failed to load requests.");
      setLoading(false);
      return;
    }

    const nearby = data
      .map((r) => {
        if (!r.location) return null;
        const [lat, lon] = r.location.split(",").map(Number);
        const distance = calculateDistance(userLat, userLon, lat, lon);
        return { ...r, distance };
      })
      .filter((r) => r && r.distance <= 5)
      .sort((a, b) => a.distance - b.distance);

    setRequests(nearby);
    setLoading(false);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const claimDonation = async (requestId) => {
    const { error } = await supabase
      .from("requested_donations")
      .update({ status: "fulfilled" })
      .eq("id", requestId);

    if (error) {
      console.error("Claim error:", error);
      alert("Failed to claim donation. Try again.");
    } else {
      alert("You have claimed this donation! ✅");
      setRequests(requests.filter((r) => r.id !== requestId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-100 flex flex-col items-center py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
          📬 Requested Donations
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          See nearby needy requests and help by donating
        </p>
      </div>

      {loading && (
        <p className="text-lg text-green-700 animate-pulse">Loading requests...</p>
      )}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {!loading && requests.length === 0 && (
        <p className="bg-green-100 px-4 py-2 rounded-full text-green-800 shadow-md">
          😔 No pending requests within 5 km.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {requests.map((r) => (
          <div
            key={r.id}
            className="bg-white p-5 rounded-2xl shadow-lg border border-green-100 hover:border-green-300 transition-transform transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-green-300 to-teal-400 rounded-full opacity-30 blur-xl"></div>

            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xl text-green-700">{r.item_name}</h3>
              <span className="text-sm font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                Pending
              </span>
            </div>

            <div className="space-y-1 text-gray-700">
              <p>🍽️ <span className="font-semibold">{r.quantity}</span> servings requested</p>
              {r.additional_notes && <p>📝 Notes: {r.additional_notes}</p>}
              <p>📍 Location: <span className="font-semibold">{r.location}</span></p>
              {r.distance && (
                <p className="text-sm text-gray-600 mt-1">
                  📏 <span className="font-semibold">{r.distance.toFixed(2)} km</span> away
                </p>
              )}
            </div>

            <button
              onClick={() => claimDonation(r.id)}
              className="mt-4 w-full py-2 text-white font-semibold bg-gradient-to-r from-green-500 to-teal-400 rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-500 transition"
            >
              🤝 Donate / Claim
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
