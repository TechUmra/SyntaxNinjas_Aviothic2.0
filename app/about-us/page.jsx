"use client";
import React, { useEffect, useState } from "react";

export default function AboutUs() {
  // Animated counters
  const [meals, setMeals] = useState(0);
  const [restaurants, setRestaurants] = useState(0);
  const [communities, setCommunities] = useState(0);

  useEffect(() => {
    const animate = (setter, target, duration) => {
      let start = 0;
      const stepTime = Math.floor(duration / target);
      const timer = setInterval(() => {
        start += 1;
        setter(start);
        if (start >= target) clearInterval(timer);
      }, stepTime);
    };
    animate(setMeals, 5000, 2000);
    animate(setRestaurants, 100, 2000);
    animate(setCommunities, 50, 2000);
  }, []);

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>BhojanGo</h1>
        <p style={styles.heroSubtitle}>Connecting surplus food with those in need.</p>
      </section>

      {/* Mission + Vision Section */}
      <section style={styles.section}>
        <div style={styles.sectionContent}>
          <div style={styles.text}>
            <h2 style={styles.sectionTitle}>Our Mission</h2>
            <p>
              BhojanGo aims to minimize food waste and feed communities in need
              by connecting surplus food from restaurants, events, and households
              to those who need it most.
            </p>
          </div>
          <div style={styles.image}>
            <img
              src="https://images.unsplash.com/photo-1604908177520-67c4504cf7b6?auto=format&fit=crop&w=600&q=80"
              alt="Mission"
              style={styles.img}
            />
          </div>
        </div>

        <div style={{ ...styles.sectionContent, flexDirection: "row-reverse" }}>
          <div style={styles.text}>
            <h2 style={styles.sectionTitle}>Our Vision</h2>
            <p>
              A world where nutritious food is accessible to everyone, and food
              waste is drastically reduced through community collaboration.
            </p>
          </div>
          <div style={styles.image}>
            <img
              src="https://images.unsplash.com/photo-1580910051075-8b2efba0a08f?auto=format&fit=crop&w=600&q=80"
              alt="Vision"
              style={styles.img}
            />
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section style={styles.sectionAlt}>
        <h2 style={styles.sectionTitleCenter}>What We Do</h2>
        <div style={styles.cards}>
          {[
            {
              title: "Food Collection",
              text: "Collect surplus food from restaurants, events, and households.",
              img: "https://images.unsplash.com/photo-1611599535980-65d7d0d9a1b0?auto=format&fit=crop&w=400&q=80",
            },
            {
              title: "Distribution",
              text: "Deliver food to shelters, NGOs, and communities in need.",
              img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
            },
            {
              title: "Awareness",
              text: "Educate communities about food waste and responsible donation.",
              img: "https://images.unsplash.com/photo-1605902711622-cfb43c4438ca?auto=format&fit=crop&w=400&q=80",
            },
          ].map((card, idx) => (
            <div key={idx} style={styles.card}>
              <img src={card.img} alt={card.title} style={styles.cardImg} />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitleCenter}>Our Impact</h2>
        <div style={styles.counters}>
          <div style={styles.counter}>
            <h3>{meals.toLocaleString()}+</h3>
            <p>Meals Donated</p>
          </div>
          <div style={styles.counter}>
            <h3>{restaurants}+</h3>
            <p>Partner Restaurants</p>
          </div>
          <div style={styles.counter}>
            <h3>{communities}+</h3>
            <p>Communities Served</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    color: "#2c3e50",
  },
  hero: {
    textAlign: "center",
    padding: "100px 20px",
    background: "linear-gradient(135deg, #27ae60, #2ecc71)",
    color: "#fff",
  },
  heroTitle: {
    fontSize: "4rem",
    marginBottom: "20px",
  },
  heroSubtitle: {
    fontSize: "1.5rem",
  },
  section: {
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionAlt: {
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
  },
  sectionContent: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },
  text: {
    flex: 1,
    minWidth: "280px",
  },
  image: {
    flex: 1,
    minWidth: "280px",
  },
  img: {
    width: "100%",
    borderRadius: "12px",
    boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: "2rem",
    color: "#27ae60",
    marginBottom: "15px",
  },
  sectionTitleCenter: {
    fontSize: "2.5rem",
    color: "#27ae60",
    textAlign: "center",
    marginBottom: "40px",
  },
  cards: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    justifyContent: "center",
  },
  card: {
    flex: "1",
    minWidth: "250px",
    maxWidth: "300px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  cardImg: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  counter: {
    flex: "1",
    minWidth: "180px",
    maxWidth: "250px",
    backgroundColor: "#27ae60",
    color: "#fff",
    borderRadius: "12px",
    padding: "30px 20px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.2rem",
    boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
  },
  counters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    marginTop: "30px",
  },
};
