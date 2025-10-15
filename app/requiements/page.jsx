"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function RequestedDonationsStatus() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch donations from Supabase
  const fetchDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requested_donations")
      .select(
        `
        id,
        user_id,
        item_name,
        quantity,
        additional_notes,
        location,
        status,
        claimed_by,
        claimed_at,
        created_at,
        updated_at
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching donations:", error);
    } else {
      setDonations(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Requested Donations Status
      </h1>

      {loading ? (
        <p>Loading donations...</p>
      ) : donations.length === 0 ? (
        <p>No requested donations found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Item Name</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Quantity</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Location</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Status</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Claimed By</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Claimed At</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Notes</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Requested At</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem" }}>{donation.item_name}</td>
                <td style={{ padding: "0.5rem" }}>{donation.quantity}</td>
                <td style={{ padding: "0.5rem" }}>{donation.location}</td>
                <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                  {donation.status}
                </td>
                <td style={{ padding: "0.5rem" }}>{donation.claimed_by || "—"}</td>
                <td style={{ padding: "0.5rem" }}>
                  {donation.claimed_at ? new Date(donation.claimed_at).toLocaleString() : "—"}
                </td>
                <td style={{ padding: "0.5rem" }}>{donation.additional_notes || "—"}</td>
                <td style={{ padding: "0.5rem" }}>
                  {donation.created_at ? new Date(donation.created_at).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
