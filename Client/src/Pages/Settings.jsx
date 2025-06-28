import React from "react";

const handleClearChat = () => {
  localStorage.removeItem("chatHistory");
  window.location.reload();
};
const handleClearSensitive = () => {
  localStorage.removeItem("sensitiveConversations");
  window.location.reload();
};
const handleToggleHardcore = () => {
  const current = localStorage.getItem("hardcoreMode") === "true";
  localStorage.setItem("hardcoreMode", !current);
  window.location.reload();
};
const handleDeleteAccount = () => {
  if (window.confirm("This will erase ALL your data from this device. No recovery. Are you sure?")) {
    localStorage.clear();
    window.location.reload();
  }
};

const Settings = () => (
  <div className="min-h-screen flex items-center justify-center bg-black p-4">
    <div className="bg-gray-900 border-4 border-neon-pink rounded-2xl shadow-2xl w-full max-w-lg p-8 text-white">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-neon-pink uppercase tracking-widest">Settings: No Excuses</h2>
      <div className="mb-8 text-center text-lg font-bold text-red-500">Take control. Change your environment. No more comfort zones.</div>
      <div className="flex flex-col gap-6">
        <button onClick={handleToggleHardcore} className="w-full bg-neon-pink text-white py-3 px-8 text-lg rounded-lg font-extrabold animate-pulse shadow-lg hover:bg-pink-700 transition border-2 border-yellow-400">Toggle Hardcore Mode</button>
        <button onClick={handleClearChat} className="w-full bg-red-700 text-white py-3 px-8 text-lg rounded-lg font-extrabold hover:bg-red-900 transition border-2 border-red-400">Clear All Chat History</button>
        <button onClick={handleClearSensitive} className="w-full bg-yellow-500 text-black py-3 px-8 text-lg rounded-lg font-extrabold hover:bg-yellow-600 transition border-2 border-yellow-700">Reset Sensitive Data Log</button>
        <button onClick={handleDeleteAccount} className="w-full bg-red-900 text-yellow-200 py-3 px-8 text-lg rounded-lg font-extrabold animate-pulse shadow-lg hover:bg-black transition border-4 border-red-600">Delete Account & Erase All Data</button>
      </div>
      <div className="mt-8 text-center text-gray-400 text-sm">This is your reality. Face it. Take action.</div>
    </div>
  </div>
);

export default Settings; 