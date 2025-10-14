"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignupPage() {
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { name, email, password, role } = formData;

    if (!name || !email || !password) {
      setMessage("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Create user with email/password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }, // store metadata
        },
      });

      if (error) throw error;

      // 2️⃣ Save user info in "profiles" table (optional)
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          name,
          email,
          role,
        },
      ]);

      if (insertError) throw insertError;

      setMessage("✅ Signup successful! Please verify your email.");
      setFormData({ name: "", email: "", password: "", role: "donor" });
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-yellow-300">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🍱 Food Donation Signup
        </h2>
        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="font-semibold">Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:border-orange-400 focus:outline-none"
            >
              <option value="donor">Donor (Donateer)</option>
              <option value="needy">Needy (Receiver)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold hover:bg-orange-600 transition"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
