import React from "react";
import { useNavigate } from "react-router-dom";

const locations = [
  {
    name: "MindCare Therapy Center",
    address: "123 Wellness St, Cityville",
    phone: "555-123-4567",
  },
  {
    name: "Yuvadi Youth Center",
    address: "456 Hope Ave, Cityville",
    phone: "555-987-6543",
  },
  {
    name: "City Mental Health Clinic",
    address: "789 Calm Rd, Cityville",
    phone: "555-222-3333",
  },
];

const TherapistLocations = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-black animate-gradient-x">
      <div className="bg-gray-900 shadow-2xl rounded-2xl w-full max-w-md p-8 border-4 border-neon-pink text-white">
        <h2 className="text-3xl font-extrabold text-center mb-2 text-neon-pink tracking-wider uppercase">Therapist & Center Locations</h2>
        <div className="text-center mb-2 text-lg font-bold text-blue-400">Seeking help is strength, not weakness.</div>
        <div className="text-center mb-6 text-lg font-bold text-yellow-400 animate-pulse">You're not weak for seeking help. You're strong for taking action.</div>
        <ul className="mb-8">
          {locations.length === 0 ? (
            <li className="text-center text-red-500 font-bold">No locations found. But giving up is not an option!</li>
          ) : (
            locations.map((loc, idx) => (
              <li key={idx} className="mb-6 p-4 rounded-lg border-2 border-neon-pink bg-gray-800 animate-pulse">
                <div className="font-bold text-lg text-neon-pink">{loc.name}</div>
                <div className="text-sm text-blue-300">{loc.address}</div>
                <div className="text-sm text-blue-300">Phone: <a href={`tel:${loc.phone}`} className="underline text-blue-400">{loc.phone}</a></div>
                <div className="flex gap-2 mt-2">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`} target="_blank" rel="noopener noreferrer"
                    className="bg-blue-700 text-white px-4 py-2 rounded font-bold border-2 border-blue-400 hover:bg-blue-900 transition">Get Directions</a>
                  <a href={`tel:${loc.phone}`} className="bg-green-600 text-white px-4 py-2 rounded font-bold border-2 border-green-400 hover:bg-green-800 transition">Call Now</a>
                </div>
              </li>
            ))
          )}
        </ul>
        <button
          onClick={() => navigate("/chat")}
          className="w-full bg-neon-pink text-white py-3 px-8 text-lg rounded-lg font-extrabold animate-pulse shadow-lg hover:bg-pink-700 transition border-2 border-yellow-400"
        >
          Back to Chatbot
        </button>
      </div>
    </div>
  );
};

export default TherapistLocations; 