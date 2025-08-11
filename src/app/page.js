"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [id, setId] = useState("");
  const [verified, setVerified] = useState(false);
  const [userDetails, setUserDetails] = useState({
    id: "",
    name: "",
    parentCount: 0
  });
  const [accompanyingCount, setAccompanyingCount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle the submission logic here, e.g., send the admissionId to the server
    try {
      const response = await fetch("/api/verifyId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("ID submitted successfully");
        setUserDetails(data.details); // Set user details with the returned details
        setVerified(true); // Set verified to true after submission
      } else {
        console.error("Failed to submit ID");
      }
      setId(""); // Clear the input field after submission
    } catch (error) {
      console.error("Error submitting ID:", error);
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/updateId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userDetails.id, accompanyingCount: Number(accompanyingCount) }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserDetails((prev) => ({
          ...prev,
          parentCount: data.parentCount
        }));
        setAccompanyingCount("");
        console.log("Accompanying count updated");
      } else {
        console.error("Failed to update accompanying count");
      }
    } catch (error) {
      console.error("Error updating accompanying count:", error);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 mt-12 md:mt-20">
      <div className="text-center mb-12 flex flex-col items-center mt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sairam Induction 2025
          </h1>
         { !verified ? (
             <div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to Induction Day 2025, Enter your Admission Id !
          </p>
          {/* Admission Id input and submit button */}
            <input
              type="text"
              placeholder="Admission Id"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="admissionId"
              required
              value={id || ""}
              onChange={(e) => setId(e.target.value)}
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
          ) : (
            <div className="w-auto">
            <p className="text-lg text-gray-700">{userDetails.name} 
            </p>
            <input
              type="number"
              min={0}
              max={10}
              placeholder="Number of People Accompanying"
              className="border  w-1/2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="accompanyingCount"
              required
              value={accompanyingCount || ""}
              onChange={(e) => setAccompanyingCount(e.target.value)}
            />
            <button
              type="submit"
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
            </div>
          )}
        </div>
      
    </div>
  );
}
