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
      image: "data:image/png;base64,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",
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
