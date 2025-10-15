"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sign in with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword(formData);

    if (authError) {
      alert(authError.message);
      return;
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      alert(profileError.message);
      return;
    }

    // Redirect according to role
    switch (profile.role) {
      case "donor":
        router.push("/dashboard/donor");
        break;
      case "needy":
        router.push("/dashboard/needy");
        break;
      case "admin":
        router.push("/dashboard/admin");
        break;
      default:
        alert("Unknown role. Please contact support.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">🍱 Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
          >
            Login
          </button>
          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-orange-500 font-semibold">
              Signup
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
