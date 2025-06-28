import React, { useState, useEffect } from "react";

const CHALLENGE_PROGRESS_KEY = "challengeProgress";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getProgress = () => {
  const data = JSON.parse(localStorage.getItem(CHALLENGE_PROGRESS_KEY) || "{}");
  const today = getTodayDate();

  // Reset daily if outdated
  if (data.lastDailyDate !== today) data.daily = false;
  if (data.lastWeeklyDate !== today) data.weekly = false;

  return {
    daily: data.daily || false,
    weekly: data.weekly || false,
    streak: data.streak || 0,
    lastDailyDate: data.lastDailyDate || null,
    lastWeeklyDate: data.lastWeeklyDate || null,
  };
};

const saveProgress = (progress) =>
  localStorage.setItem(CHALLENGE_PROGRESS_KEY, JSON.stringify(progress));

const clearProgress = () => localStorage.removeItem(CHALLENGE_PROGRESS_KEY);

const motivationalQuotes = [
  "Discipline = Freedom.",
  "You don’t rise to the level of your goals, you fall to the level of your systems.",
  "Small steps. Brutal consistency.",
  "The grind doesn't care how you feel.",
  "Reset. Refocus. Reload.",
];

const getRandomQuote = () =>
  motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

const Challenges = () => {
  const [progress, setProgress] = useState(getProgress());
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    const data = getProgress();
    setProgress(data);
  }, []);

  const completeDaily = () => {
    const today = getTodayDate();
    const newStreak = progress.daily ? progress.streak : progress.streak + 1;

    const newProgress = {
      ...progress,
      daily: true,
      lastDailyDate: today,
      streak: newStreak,
    };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const completeWeekly = () => {
    const today = getTodayDate();
    const newProgress = {
      ...progress,
      weekly: true,
      lastWeeklyDate: today,
    };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const handleClear = () => {
    clearProgress();
    setProgress({
      daily: false,
      weekly: false,
      streak: 0,
      lastDailyDate: null,
      lastWeeklyDate: null,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white px-10 py-14 font-mono relative overflow-hidden">
      {/* Neon Glow */}
      <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2 blur-3xl opacity-20 w-[600px] h-[600px] bg-[#ff0055] rounded-full z-0 animate-ping" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl font-black uppercase text-[#ff0055] text-center tracking-widest mb-6 drop-shadow-lg">
          Challenge Mode
        </h1>

        {/* Motivational Quote */}
        <p className="text-center text-gray-400 text-lg italic mb-10">
          “{quote}”
        </p>

        {/* DAILY CHALLENGE */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-red-500 uppercase tracking-widest">
            🔥 Today’s Non-Negotiable
          </h2>
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-xl flex justify-between items-center">
            <p className="text-lg text-gray-300">
              10 min of silent, mindful reset. No phone. No noise.
            </p>
            <button
              onClick={completeDaily}
              disabled={progress.daily}
              className={`ml-6 px-5 py-2 rounded font-bold uppercase ${
                progress.daily
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-[#ff0055] text-white hover:bg-[#e60045] shadow-[0_0_15px_#ff0055]"
              }`}
            >
              {progress.daily ? "✅ Done" : "Mark Done"}
            </button>
          </div>
        </section>

        {/* WEEKLY CHALLENGE */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-400 uppercase tracking-widest">
            💪 Weekly Grind
          </h2>
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-xl flex justify-between items-center">
            <p className="text-lg text-gray-300">
              1 hour offline. Journal, reflect, and recalibrate.
            </p>
            <button
              onClick={completeWeekly}
              disabled={progress.weekly}
              className={`ml-6 px-5 py-2 rounded font-bold uppercase ${
                progress.weekly
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-[0_0_15px_#60a5fa]"
              }`}
            >
              {progress.weekly ? "✅ Done" : "Mark Done"}
            </button>
          </div>
        </section>

        {/* PROGRESS STATS */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-[#ff0055] uppercase tracking-widest">
            🧠 Mental Discipline Log
          </h2>
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-lg">
            <p className="text-lg mb-2">
              <span className="text-green-400 font-bold">Daily:</span>{" "}
              {progress.daily ? "✅ Locked In" : "❌ Incomplete"}
            </p>
            <p className="text-lg mb-2">
              <span className="text-green-400 font-bold">Weekly:</span>{" "}
              {progress.weekly ? "✅ Crushed It" : "❌ Missed"}
            </p>
            <p className="text-lg mb-2">
              🔁 <span className="text-yellow-400 font-bold">Streak:</span>{" "}
              {progress.streak} {progress.streak > 0 ? "🔥" : ""}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last Daily Completion:{" "}
              {progress.lastDailyDate || "– Not yet completed"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Last Weekly Completion:{" "}
              {progress.lastWeeklyDate || "– Not yet completed"}
            </p>
            <button
              onClick={handleClear}
              className="mt-4 bg-red-600 px-5 py-2 rounded font-bold uppercase hover:bg-red-700 shadow-md"
            >
              ⚠️ Reset Everything
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Challenges;
