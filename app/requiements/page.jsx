"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // Use your existing client

export default function RequestedDonationsStatus() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requested_donations")
      .select(`
        id,
        user_id,
        item_name,
        quantity,
        additional_notes,
        location,
        status,
        claimed_by,
        claimed_at,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching donations:", error);
    else setDonations(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem", fontSize: "2rem", color: "#333" }}>
        Requested Donations Status
      </h1>

      {loading ? (
        <p style={{ textAlign: "center", color: "#555" }}>Loading donations...</p>
      ) : donations.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No requested donations found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 0.5rem",
            backgroundColor: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 1rem" }}>Item Name</th>
                <th style={{ padding: "0.75rem 1rem" }}>Quantity</th>
                <th style={{ padding: "0.75rem 1rem" }}>Location</th>
                <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                <th style={{ padding: "0.75rem 1rem" }}>Claimed By</th>
                <th style={{ padding: "0.75rem 1rem" }}>Claimed At</th>
                <th style={{ padding: "0.75rem 1rem" }}>Notes</th>
                <th style={{ padding: "0.75rem 1rem" }}>Requested At</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} style={{
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                  marginBottom: "0.5rem",
                  transition: "transform 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <td style={{ padding: "0.75rem 1rem" }}>{donation.item_name}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{donation.quantity}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{donation.location}</td>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: "bold", color: donation.status === "pending" ? "#d97706" : "#16a34a" }}>
                    {donation.status}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>{donation.claimed_by || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {donation.claimed_at ? new Date(donation.claimed_at).toLocaleString() : "—"}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>{donation.additional_notes || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {donation.created_at ? new Date(donation.created_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
