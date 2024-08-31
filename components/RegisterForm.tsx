"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/api/register", { name, email });
      if (response.data.alreadyRegistered) {
        setMessage("You are already registered with this email address."); // Updated message for already registered user
      } else {
        setMessage("You have been successfully registered!");
      }
      setSubmitted(true);
      setName("");
      setEmail("");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-container">
        <h1>Thank You! You have successfully registered!</h1>
        <p style={{ color: "green", fontSize: "18px" }}>
          {message} {/* Updated message */}
        </p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <Image
        src="/ri-startup-logo.png"
        alt="StartupWeek Rhode Island Logo"
        width={200}
        height={200}
        className="logo-image"
        priority
      />
      <h2>StartupWeek RI</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default RegisterForm;
