"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch donations
      const { data: donations, error: donationsError } = await supabase
        .from("donations")
        .select("donor_id, quantity");

      if (donationsError) throw donationsError;

      // 2️⃣ Aggregate donations
      const donationMap = {};
      donations.forEach((donation) => {
        const donor = donation.donor_id;
        const qty = parseInt(donation.quantity) || 0;
        donationMap[donor] = (donationMap[donor] || 0) + qty;
      });

      const donorIds = Object.keys(donationMap);
      if (donorIds.length === 0) {
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      // 3️⃣ Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", donorIds);

      if (profilesError) throw profilesError;

      // 4️⃣ Merge, sort, and rank
      const leaderboardData = donorIds
        .map((donor_id) => {
          const user = profiles.find((p) => p.id === donor_id);
          return {
            donor_id,
            name: user?.name || "Anonymous Donor",
            total_quantity: donationMap[donor_id],
          };
        })
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
          badge:
            index === 0
              ? "🥇 Gold"
              : index === 1
              ? "🥈 Silver"
              : index === 2
              ? "🥉 Bronze"
              : "⭐ Contributor",
        }));

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-yellow-200 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-8 text-orange-800">🏆 Leaderboard</h1>

      {/* 🌀 Loading Spinner */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600 border-solid"></div>
          <p className="mt-4 text-orange-700 font-medium text-lg">Loading leaderboard...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        // 😔 Empty State
        <div className="bg-white shadow-xl rounded-2xl w-11/12 md:w-2/3 p-6 text-center">
          <p className="text-gray-600 text-lg">No donations yet 😔</p>
        </div>
      ) : (
        // 🧾 Leaderboard Table
        <div className="bg-white shadow-xl rounded-2xl w-11/12 md:w-2/3 p-6">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="p-3 rounded-tl-2xl">Rank</th>
                <th className="p-3">Name</th>
                <th className="p-3">Total Donations</th>
                <th className="p-3 rounded-tr-2xl">Badge</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((donor, index) => (
                <tr
                  key={donor.donor_id}
                  className={`border-b hover:bg-orange-100 ${
                    index % 2 === 0 ? "bg-orange-50" : "bg-white"
                  }`}
                >
                  <td className="p-3 font-bold">{donor.rank}</td>
                  <td className="p-3">{donor.name}</td>
                  <td className="p-3">{donor.total_quantity}</td>
                  <td className="p-3 text-lg">{donor.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
