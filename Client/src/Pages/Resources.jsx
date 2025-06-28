import React from "react";

const Resources = () => (
  <div className="min-h-screen bg-black text-white px-10 py-16 font-mono relative overflow-hidden">
    {/* Background glow */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 blur-3xl opacity-25 w-[700px] h-[700px] bg-[#ff0055] rounded-full z-0"></div>

    <div className="relative z-10 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-6xl font-black uppercase text-[#ff0055] tracking-widest text-center mb-2">
        No Excuses.
      </h1>
      <h2 className="text-2xl uppercase font-bold text-center text-white mb-10 tracking-[0.3em]">
        Lock In. Get What You Need.
      </h2>

      {/* Sub */}
      <p className="text-center text-gray-400 text-md mb-10 max-w-xl mx-auto italic border-l-4 border-[#ff0055] pl-4">
        Direct access to tools, helplines, and truth. You’re here for change —
        we don’t sugarcoat it.
      </p>

      {/* Search */}
      <input
        type="text"
        className="w-full p-5 mb-8 rounded-md bg-[#111] text-white border-2 border-[#ff0055] placeholder-gray-500 shadow-[0_0_25px_#ff0055] focus:outline-none focus:ring-2 focus:ring-[#ff0055] text-lg transition-all"
        placeholder="Type: ANXIETY, TRAUMA, SOS, etc."
      />

      {/* Resource Placeholder */}
      <div className="bg-[#0e0e0e] border border-[#333] p-6 rounded-lg shadow-lg hover:shadow-[#ff0055]/30 transition">
        <div className="text-[#ff0055] font-semibold text-xl mb-4 uppercase tracking-widest">
          Incoming.
        </div>
        <p className="text-gray-300 text-md">
          You’ll see exactly what you need. Raw. Real. Ready.
        </p>

        <ul className="list-disc list-inside mt-4 space-y-1 text-sm text-gray-400">
          <li>🔥 Breathing + Reset Modules</li>
          <li>🧠 Rage Room (mental unload space)</li>
          <li>⚠️ Lifeline Contacts (24/7 support)</li>
          <li>📘 No BS Mental Health Guides</li>
        </ul>

        <p className="mt-6 text-center text-[#ff0055] font-bold animate-pulse">
          Resources loading. Hold tight.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-10 text-center text-sm text-gray-600 border-t border-[#222] pt-6">
        ⚠️ This platform cuts the fluff. If you are in danger or crisis, skip
        this — call a pro or a hotline. This is backup, not emergency response.
      </div>
    </div>
  </div>
);

export default Resources;
