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

  // ✅ Get user session and donation count
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

    // 🌍 Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation(`${lat},${lon}`);
        },
        (err) => console.error(err)
      );
    }
  }, []);

  // ✅ Fetch total donations made by this user
  const fetchDonationCount = async (donorId) => {
    const { data, error } = await supabase
      .from("donations")
      .select("id", { count: "exact" })
      .eq("donor_id", donorId);

    if (error) console.error(error);
    else setDonationCount(data.length);
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
      fetchDonationCount(user.id); // refresh count after adding
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold text-orange-600 mb-4">🍱 Donor Dashboard</h2>

      {user && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 w-full max-w-md text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome, {user.email}
          </h3>
          <p className="text-gray-600">
            🌟 Total Donations Made:{" "}
            <span className="font-bold text-orange-600">{donationCount}</span>
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md"
      >
        <input
          type="text"
          name="food_name"
          placeholder="Food Name"
          value={donation.food_name}
          onChange={handleChange}
          className="w-full mb-3 border p-2 rounded"
        />
        <input
          type="text"
          name="quantity"
          placeholder="Quantity (e.g., 2 kg, 5 plates)"
          value={donation.quantity}
          onChange={handleChange}
          className="w-full mb-3 border p-2 rounded"
        />
        <input
          type="datetime-local"
          name="expiry_time"
          value={donation.expiry_time}
          onChange={handleChange}
          className="w-full mb-3 border p-2 rounded"
        />

        {location && (
          <p className="text-sm text-gray-600 mb-3">📍 {location}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          {loading ? "Adding..." : "Add Donation"}
        </button>
      </form>
    </div>
  );
}
