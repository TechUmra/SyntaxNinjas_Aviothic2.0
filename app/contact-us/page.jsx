"use client";
import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Thank you for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Contact Us</h1>
      <p style={styles.subtitle}>
        Have questions or want to contribute? Reach out to us!
      </p>

      <div style={styles.content}>
        {/* Contact Form */}
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            style={{ ...styles.input, height: "120px" }}
            required
          />
          <button type="submit" style={styles.button}>
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div style={styles.info}>
          <h2>Get in Touch</h2>
          <p>FoodForAll Foundation</p>
          <p>Email: contact@foodforall.org</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123 Charity Lane, Kanpur, India</p>

          {/* Map placeholder */}
          <div style={styles.map}>
            <p>Map Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Arial', sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "3rem",
    marginBottom: "10px",
    color: "#2c3e50",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "1.2rem",
    marginBottom: "40px",
    color: "#555",
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    justifyContent: "center",
  },
  form: {
    flex: "1",
    minWidth: "300px",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border 0.3s",
  },
  button: {
    padding: "12px 15px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#27ae60",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  info: {
    flex: "1",
    minWidth: "300px",
    maxWidth: "500px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
  },
  map: {
    marginTop: "20px",
    width: "100%",
    height: "200px",
    backgroundColor: "#dfe6e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    fontWeight: "bold",
    color: "#555",
  },
};
