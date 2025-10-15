"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RewardPage() {
  const [user, setUser] = useState(null);
  const [totalDonations, setTotalDonations] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState([]);

  const giftCards = [
    {
      id: 1,
      name: "Amazon ₹100 Gift Card",
      pointsRequired: 100,
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
      id: 2,
      name: "Swiggy ₹200 Coupon",
      pointsRequired: 200,
      image: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg",
    },
    {
      id: 3,
      name: "Flipkart ₹300 Voucher",
      pointsRequired: 300,
      image: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Flipkart_logo.png",
    },
    {
      id: 4,
      name: "Myntra ₹500 Voucher",
      pointsRequired: 500,
      image: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Myntra_logo.png",
    },
  ];

  useEffect(() => {
    const fetchUserAndDonations = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const { data, error } = await supabase
        .from("donations")
        .select("id")
        .eq("donor_id", currentUser.id);

      if (error) {
        console.error("Error fetching donations:", error);
        setLoading(false);
        return;
      }

      const total = data?.length || 0;
      const rewards = total * 10;

      setTotalDonations(total);
      setRewardPoints(rewards);
      setLoading(false);
    };

    fetchUserAndDonations();
  }, []);

  // ✅ Handle reward claim with point deduction
  const handleClaim = (gift) => {
    const alreadyClaimed = claimed.includes(gift.id);
    const enoughPoints = rewardPoints >= gift.pointsRequired;

    if (!enoughPoints || alreadyClaimed) return;

    alert(`🎉 You have claimed: ${gift.name}`);

    // Deduct points and mark as claimed
    setRewardPoints((prev) => prev - gift.pointsRequired);
    setClaimed((prev) => [...prev, gift.id]);
  };

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Poppins, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎁 Reward Points</h1>

      {user ? (
        <div
          style={{
            backgroundColor: "#f3f4f6",
            padding: "2rem",
            borderRadius: "12px",
            textAlign: "center",
            width: "fit-content",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <p>
            <strong>Donor:</strong> {user.email}
          </p>
          <h2 style={{ fontSize: "1.5rem", margin: "1rem 0" }}>
            🧺 Total Donations: {totalDonations}
          </h2>
          <h2 style={{ fontSize: "1.8rem", color: "#16a34a" }}>
            ⭐ Total Reward Points: {rewardPoints}
          </h2>
        </div>
      ) : (
        <p>No user logged in.</p>
      )}

      {/* 🎁 Gift Cards Grid */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.5rem",
          justifyItems: "center",
        }}
      >
        {giftCards.map((gift) => {
          const canClaim = rewardPoints >= gift.pointsRequired;
          const isClaimed = claimed.includes(gift.id);

          return (
            <div
              key={gift.id}
              style={{
                width: "180px",
                height: "220px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                textAlign: "center",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
            >
              <img
                src={gift.image}
                alt={gift.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                  marginBottom: "0.5rem",
                }}
              />
              <div>
                <h3 style={{ fontSize: "1rem", margin: "0.5rem 0" }}>{gift.name}</h3>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                  {gift.pointsRequired} Points
                </p>
              </div>
              

              <button
                onClick={() => handleClaim(gift)}
                disabled={!canClaim || isClaimed}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: canClaim && !isClaimed ? "#16a34a" : "#9ca3af",
                  color: "white",
                  cursor: canClaim && !isClaimed ? "pointer" : "not-allowed",
                  fontWeight: "bold",
                  transition: "0.3s ease",
                }}
              >
                {isClaimed ? "Claimed" : canClaim ? "Claim" : "Locked"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
