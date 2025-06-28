import React, { useEffect, useState } from "react";

const CHALLENGE_PROGRESS_KEY = "challengeProgress";

const getProgress = () =>
  JSON.parse(
    localStorage.getItem(CHALLENGE_PROGRESS_KEY) ||
      '{"daily":false,"weekly":false,"streak":0,"lastDailyDate":null,"lastWeeklyDate":null}'
  );

const motivationalQuotes = [
  "Discipline = Freedom.",
  "You earn respect by showing up.",
  "No shortcuts. No mercy. Just results.",
  "Consistency kills doubt.",
  "Excuses don’t count. Effort does.",
];

const getRandomQuote = () =>
  motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

const Progress = () => {
  const [progress, setProgress] = useState({
    daily: false,
    weekly: false,
    streak: 0,
    lastDailyDate: null,
    lastWeeklyDate: null,
  });
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    const stored = getProgress();
    setProgress(stored);
  }, []);

  // Badge logic
  const dailyBadge =
    progress.streak >= 10 ? "🔥" : progress.daily ? "🏅" : "⚪";
  const weeklyBadge = progress.weekly ? "🥇" : "⚪";

  const streakLevel =
    progress.streak >= 30
      ? "Beast Mode"
      : progress.streak >= 10
      ? "Locked In"
      : progress.streak > 0
      ? "Warming Up"
      : "Inactive";

  const completionRate = `${
    progress.daily && progress.weekly
      ? 100
      : progress.daily || progress.weekly
      ? 50
      : 0
  }%`;

  return (
    <div className="min-h-screen bg-black text-white p-10 font-mono relative">
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 blur-3xl opacity-20 w-[600px] h-[600px] bg-[#ff0055] rounded-full animate-pulse z-0" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-2 text-[#ff0055] uppercase tracking-widest text-center">
          Progress Tracker
        </h1>
        <h2 className="text-xl font-semibold text-blue-400 uppercase text-center mb-8">
          Prove Your Streak. Earn Your Respect.
        </h2>

        {/* Quote */}
        <p className="text-center text-gray-400 italic mb-10 text-lg">
          “{quote}”
        </p>

        {/* Stats */}
        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg mb-6 border border-zinc-700">
          <h3 className="text-2xl font-bold text-[#ff0055] mb-4">
            🔎 Current Metrics
          </h3>
          <p className="text-lg text-white mb-2">
            🔁 <span className="font-bold text-yellow-400">Streak:</span>{" "}
            {progress.streak} day(s)
          </p>
          <p className="text-lg text-white mb-2">
            🧠 <span className="font-bold text-green-400">Level:</span>{" "}
            {streakLevel}
          </p>
          <p className="text-lg text-white mb-2">
            📊 <span className="font-bold text-blue-400">Completion Rate:</span>{" "}
            {completionRate}
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Last Daily:{" "}
            {progress.lastDailyDate ? progress.lastDailyDate : "N/A"}
            <br />
            Last Weekly:{" "}
            {progress.lastWeeklyDate ? progress.lastWeeklyDate : "N/A"}
          </p>
        </div>

        {/* Achievements */}
        <div className="bg-zinc-900 p-6 rounded shadow-lg flex flex-col items-center border border-zinc-700">
          <h3 className="text-xl font-bold mb-4 text-[#ff0055] uppercase">
            🏅 Achievements & Badges
          </h3>
          <div className="flex gap-12 text-center">
            <div className="flex flex-col items-center">
              <span className="text-5xl">{dailyBadge}</span>
              <span className="mt-2 text-sm text-gray-300">
                Daily Challenge
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl">{weeklyBadge}</span>
              <span className="mt-2 text-sm text-gray-300">
                Weekly Challenge
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-10">
          <h4 className="text-lg font-semibold text-gray-300 mb-2">
            Overall Progress
          </h4>
          <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                completionRate === "100%"
                  ? "bg-green-400"
                  : completionRate === "50%"
                  ? "bg-yellow-400"
                  : "bg-red-500"
              }`}
              style={{
                width: completionRate,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
