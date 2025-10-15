"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DonorDashboard() {
  const [user, setUser] = useState(null);
  const [donation, setDonation] = useState({
    food_name: "",
    quantity: "",
    expiry_time: "",
  });
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [donationCount, setDonationCount] = useState(0);
  const [nearbyRequests, setNearbyRequests] = useState([]);

  // Haversine formula to calculate distance in km
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch user session and donation count
  useEffect(() => {
    const fetchUserAndDonations = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchDonationCount(session.user.id);
      } else {
        alert("You must log in first");
      }
    };
    fetchUserAndDonations();

    // Get donor location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation(`${lat},${lon}`);
          fetchNearbyRequests(lat, lon);
        },
        (err) => console.error(err)
      );
    }
  }, []);

  // Fetch total donations made by this donor
  const fetchDonationCount = async (donorId) => {
    const { data, error } = await supabase
      .from("donations")
      .select("id", { count: "exact" })
      .eq("donor_id", donorId);

    if (error) console.error(error);
    else setDonationCount(data.length);
  };

  // Fetch nearby requested donations
  const fetchNearbyRequests = async (lat, lon) => {
    const { data, error } = await supabase.from("requested_donations").select("*");
    if (error) {
      console.error(error);
      return;
    }

    const radiusKm = 5; // nearby radius in km
    const nearby = data.filter((req) => {
      if (!req.location) return false;
      const [reqLat, reqLon] = req.location.split(",").map(Number);
      const distance = getDistanceFromLatLonInKm(lat, lon, reqLat, reqLon);
      return distance <= radiusKm;
    });

    setNearbyRequests(nearby);
  };

  const handleChange = (e) =>
    setDonation({ ...donation, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in");

    setLoading(true);
    const { error } = await supabase.from("donations").insert([
      {
        donor_id: user.id,
        food_name: donation.food_name,
        quantity: donation.quantity,
        expiry_time: donation.expiry_time,
        location,
      },
    ]);
    setLoading(false);

    if (error) alert(error.message);
    else {
      alert("Donation added successfully!");
      setDonation({ food_name: "", quantity: "", expiry_time: "" });
      fetchDonationCount(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex flex-col items-center py-10 px-4">
      <h2 className="text-4xl font-bold text-orange-600 mb-6">🍱 Donor Dashboard</h2>

      {user && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 w-full max-w-md text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome, {user.email}
          </h3>
          <p className="text-gray-700 mt-2">
            🌟 Total Donations Made:{" "}
            <span className="font-bold text-orange-500">{donationCount}</span>
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl p-6 rounded-2xl w-full max-w-md mb-10"
      >
        <h3 className="text-xl font-semibold text-orange-600 mb-4">Add a Donation</h3>
        <input
          type="text"
          name="food_name"
          placeholder="Food Name"
          value={donation.food_name}
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg text-orange-600 placeholder-orange-300 focus:ring-2 focus:ring-orange-300"
        />
        <input
          type="text"
          name="quantity"
          placeholder="Quantity (e.g., 2 kg, 5 plates)"
          value={donation.quantity}
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg text-orange-600 placeholder-orange-300 focus:ring-2 focus:ring-orange-300"
        />
        <input
          type="datetime-local"
          name="expiry_time"
          value={donation.expiry_time}
          onChange={handleChange}
          className="w-full mb-3 p-3 border rounded-lg text-orange-600 focus:ring-2 focus:ring-orange-300"
        />

        {location && <p className="text-sm text-gray-500 mb-3">📍 {location}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
        >
          {loading ? "Adding..." : "Add Donation"}
        </button>
      </form>

      {/* Nearby Requested Donations Section */}
      <div className="w-full max-w-3xl">
        <h3 className="text-2xl font-bold text-orange-600 mb-4">📍 Nearby Requested Donations</h3>
        {nearbyRequests.length === 0 ? (
          <p className="text-gray-600">No nearby requests found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {nearbyRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <h4 className="font-semibold text-gray-800">{req._name}</h4>
                <p className="text-gray-600">Quantity: {req.quantity}</p>
                <p className="text-gray-500 text-sm">
                  Requested By: {req.requester_email || "Anonymous"}
                </p>
                <p className="text-gray-400 text-sm mt-1">Location: {req.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
