"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NeedyDashboard() {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userId, setUserId] = useState(null);

  const [requestForm, setRequestForm] = useState({
    item_name: "",
    quantity: "",
    additional_notes: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetchUserAndLocation();
  }, []);

  const fetchUserAndLocation = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("User fetch error:", userError);
      setError("Please sign in to view donations.");
      setLoading(false);
      return;
    }

    const user = userData?.user;
    if (!user) {
      setError("No authenticated user found.");
      setLoading(false);
      return;
    }

    // ✅ Fetch role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      setError("Unable to fetch user role.");
      setLoading(false);
      return;
    }

    // ✅ Role-based restriction
    if (profile?.role !== "needy") {
      setError("You are not authorized to access this page.");
      setLoading(false);
      return;
    }

    setUserId(user.id);
    getUserLocation(user.id);
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
          await saveNeedyLocation(uid, location);
          fetchDonations(location);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Please enable location access to view nearby donations.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
    }
  };

  const saveNeedyLocation = async (uid, { lat, lon }) => {
    try {
      const { error } = await supabase
        .from("needy_locations")
        .upsert(
          {
            user_id: uid,
            location: `${lat},${lon}`,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      if (error) console.error("Location update error:", error);
    } catch (err) {
      console.error("Location save error:", err);
    }
  };

  const fetchDonations = async ({ lat: userLat, lon: userLon }) => {
    setLoading(true);
    const { data, error } = await supabase.from("donations").select("*");

    if (error) {
      console.error(error);
      setError("Failed to load donations.");
      setLoading(false);
      return;
    }

    const nearby = data
      .filter((d) => !d.claimed_by || d.claimed_by === userId)
      .map((d) => {
        if (!d.location) return null;
        const [lat, lon] = d.location.split(",").map(Number);
        const distance = calculateDistance(userLat, userLon, lat, lon);
        return { ...d, distance };
      })
      .filter((d) => d && d.distance <= 5)
      .sort((a, b) => a.distance - b.distance);

    setDonations(data);
    setFilteredDonations(nearby);
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

  const renderMap = (location) => {
    if (!location) return null;
    const [lat, lon] = location.split(",");
    return (
      <iframe
        className="w-full h-40 mt-3 rounded-xl border-2 border-yellow-200 shadow-inner"
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps?q=${lat},${lon}&hl=en&z=15&output=embed`}
      ></iframe>
    );
  };

  const isExpired = (expiry) => new Date(expiry) < new Date();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm({ ...requestForm, [name]: value });
  };

  const submitRequest = async () => {
    if (!requestForm.item_name || !requestForm.quantity) {
      alert("Please fill in required fields.");
      return;
    }
    if (!userLocation || !userId) {
      alert("Location or user data missing.");
      return;
    }

    const { lat, lon } = userLocation;

    const { error } = await supabase.from("requested_donations").insert([
      {
        user_id: userId,
        item_name: requestForm.item_name,
        quantity: requestForm.quantity,
        additional_notes: requestForm.additional_notes,
        location: `${lat},${lon}`,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Request donation error:", error);
      alert("Failed to submit request. Try again.");
    } else {
      alert("Donation request submitted successfully!");
      setRequestForm({ item_name: "", quantity: "", additional_notes: "" });
    }
  };

  const handleClaimDonation = async (donationId) => {
    if (!userId) {
      alert("You must be logged in to claim a donation.");
      return;
    }

    const { data: existing, error: fetchError } = await supabase
      .from("donations")
      .select("claimed_by")
      .eq("id", donationId)
      .single();

    if (fetchError) {
      console.error("Error fetching donation:", fetchError);
      alert("Something went wrong. Please try again.");
      return;
    }

    if (existing.claimed_by) {
      alert("This donation has already been claimed.");
      fetchDonations(userLocation);
      return;
    }

    const { error } = await supabase
      .from("donations")
      .update({ claimed_by: userId })
      .eq("id", donationId);

    if (error) {
      console.error("Claim error:", error);
      alert("Failed to claim the donation. Try again.");
    } else {
      alert("🎉 Donation claimed successfully!");
      fetchDonations(userLocation);
    }
  };

  // 🔒 Unauthorized access view
  if (error === "You are not authorized to access this page.") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            🚫 Access Denied
          </h1>
          <p className="text-gray-700">
            This page is for <span className="font-semibold">Needy</span> users only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-rose-100 flex flex-col items-center py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
          🙏 Welcome to Needy Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Find{" "}
          <span className="font-semibold text-orange-600">
            nearby food donations
          </span>{" "}
          or request help 🌍
        </p>
      </div>

      {/* Request Donation Form */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg mb-10 border border-orange-100">
        <h2 className="text-xl font-bold text-orange-700 mb-4">
          📩 Request Food Donation
        </h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="item_name"
            placeholder="Item Name"
            value={requestForm.item_name}
            onChange={handleInputChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity / Servings"
            value={requestForm.quantity}
            onChange={handleInputChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <textarea
            name="additional_notes"
            placeholder="Additional Notes (optional)"
            value={requestForm.additional_notes}
            onChange={handleInputChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={submitRequest}
            className="mt-2 py-2 text-white font-semibold bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg shadow-md hover:shadow-lg hover:from-orange-600 hover:to-yellow-500 transition"
          >
            Submit Request
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-lg text-yellow-700 animate-pulse">
          Loading nearby donations...
        </p>
      )}
      {error && error !== "You are not authorized to access this page." && (
        <p className="text-red-600 font-semibold">{error}</p>
      )}

      {!loading && filteredDonations.length === 0 && (
        <p className="bg-yellow-100 px-4 py-2 rounded-full text-yellow-800 shadow-md">
          😔 No nearby donations available within 5 km.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {filteredDonations.map((d) => (
          <div
            key={d.id}
            className="bg-white p-5 rounded-2xl shadow-lg border border-orange-100 hover:border-orange-300 transition-transform transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-30 blur-xl"></div>

            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xl text-orange-700">
                {d.food_name}
              </h3>
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  isExpired(d.expiry_time)
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isExpired(d.expiry_time) ? "Expired" : "Available"}
              </span>
            </div>

            <div className="space-y-1 text-gray-700">
              <p>
                🍽️ <span className="font-semibold">{d.quantity}</span> servings
                available
              </p>
              <p>
                ⏰{" "}
                <span className="font-semibold">
                  {new Date(d.expiry_time).toLocaleString()}
                </span>
              </p>
              <p>
                📍 Location:{" "}
                <span className="font-semibold">
                  {d.location || "Not provided"}
                </span>
              </p>
              {d.distance && (
                <p className="text-sm text-gray-600 mt-1">
                  📏{" "}
                  <span className="font-semibold">
                    {d.distance.toFixed(2)} km
                  </span>{" "}
                  away
                </p>
              )}
            </div>

            {renderMap(d.location)}

            <div className="mt-4">
              {d.claimed_by ? (
                d.claimed_by === userId ? (
                  <span className="text-green-600 font-semibold">
                    ✅ Claimed by you
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    ❌ Already claimed
                  </span>
                )
              ) : (
                <button
                  onClick={() => handleClaimDonation(d.id)}
                  className="mt-2 py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition"
                >
                  Claim Donation
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
