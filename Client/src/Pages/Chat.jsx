import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CHAT_HISTORY_KEY = "chatHistory";
const REMINDER_KEY = "reminderTime";
const LAST_CHECKIN_KEY = "lastCheckin";

const getChatHistory = () => {
  return JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || "[]");
};
const saveChatHistory = (history) => {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
};
const clearChatHistory = () => {
  localStorage.removeItem(CHAT_HISTORY_KEY);
};
const getReminderTime = () => localStorage.getItem(REMINDER_KEY) || "";
const setReminderTime = (time) => localStorage.setItem(REMINDER_KEY, time);
const getLastCheckin = () => localStorage.getItem(LAST_CHECKIN_KEY);
const setLastCheckin = (date) => localStorage.setItem(LAST_CHECKIN_KEY, date);

const hardcoreQuotes = [
  "Excuses don't get results. Action does.",
  "Discomfort is the price of progress.",
  "You're not tired, you're just uninspired. Prove me wrong.",
  "Winners don't whine. They work.",
  "You can rest later. Now, grind.",
  "Discipline over motivation. Every. Single. Day.",
  "If you want easy, you're in the wrong place.",
  "No one cares. Work harder.",
];

const negativeKeywords = [
  "can't",
  "cannot",
  "tired",
  "give up",
  "fail",
  "hopeless",
  "useless",
  "hate",
  "sad",
  "depressed",
  "anxious",
  "scared",
  "afraid",
  "lost",
  "weak",
];
const positiveKeywords = [
  "can",
  "able",
  "strong",
  "hope",
  "improve",
  "better",
  "happy",
  "excited",
  "motivated",
  "confident",
  "win",
  "progress",
  "success",
];
const toughLoveReplies = [
  "No excuses. You're stronger than you think. Every time you want to quit, remember why you started. The only way out is through. Get up and fight for your future, because nobody else will do it for you.",
  "Get up. You've got work to do. The world doesn't care about your comfort. It rewards those who show up, push through pain, and refuse to back down. Are you one of them, or just another excuse-maker?",
  "Pain is temporary. Quitting lasts forever. You can either suffer the pain of discipline now or the pain of regret later. Choose your pain, but don't you dare choose to give up.",
  "You want results? Push harder. The difference between ordinary and extraordinary is that little extra. Stop settling for average. Demand more from yourself, right now.",
  "Stop doubting. Start doing. Doubt kills more dreams than failure ever will. Action is the antidote. Prove your doubts wrong by taking relentless action, even when you don't feel like it.",
  "You're not done yet. Keep going. Champions are made in the moments when nobody is watching, when quitting would be easier. This is your test. Pass it.",
  "You think you're the only one struggling? Everyone fights. Winners don't quit. The difference is that they keep swinging, even when their arms are tired. Be a winner. Keep swinging.",
  "You want change? Then act like it. No more talking, more doing. The world is full of talkers. Be a doer. Let your actions drown out your excuses.",
  "You can whine, or you can win. Choose. Every second you spend complaining is a second you could spend improving. Winners don't have time for self-pity.",
  "Comfort is the enemy of progress. Get uncomfortable. Growth only happens when you step outside your comfort zone and embrace the grind.",
];
const brutalHonestyReplies = [
  "Stop whining. Winners don't complain. Life doesn't hand out trophies for feeling sorry for yourself. If you want something, get up and earn it. No one is coming to save you.",
  "You want sympathy? You won't get it here. Get moving. The world rewards action, not excuses. If you want to change your life, start by changing your habits—today, not tomorrow.",
  "Excuses are for the weak. Prove you're not one of them. Every time you make an excuse, you give away your power. Take it back. Own your choices and your results.",
  "You're not special. You have to earn it. The universe doesn't owe you anything. If you want respect, start by respecting yourself enough to do the hard things.",
  "Nobody's coming to save you. Save yourself. The sooner you accept that, the sooner you'll start making real progress. Stand up, take responsibility, and fight for your life.",
  "You're not done until you're proud. If you can look in the mirror and honestly say you gave it everything, then you can rest. Until then, keep grinding.",
];
const encouragementReplies = [
  "That's the spirit! Keep it up! Every step forward, no matter how small, is a victory. Celebrate your progress, but don't get comfortable. The journey isn't over yet.",
  "Proud of your progress. Don't stop now! Momentum is your friend—ride it. Remember, consistency beats intensity. Show up for yourself every single day.",
  "You're on the right track. Stay strong! Obstacles are just opportunities in disguise. Use them to build resilience and prove to yourself that you can handle anything.",
  "Every step counts. You're doing great! Don't let setbacks define you. Use them as fuel to push even harder. Your future self will thank you for not giving up.",
  "Keep that energy! You're unstoppable! The only limits that exist are the ones you accept. Break through them, and show the world what you're made of.",
];
const neutralReplies = [
  "I'm here. What's on your mind? Sometimes the hardest part is just starting the conversation. Lay it all out—no judgment, just truth.",
  "Let's keep moving forward. Progress is made one decision at a time. What are you willing to do today that your future self will thank you for?",
  "Tell me more. I'm listening. The more honest you are, the more powerful your next move will be. Don't hold back.",
  "Stay focused. You've got this. Distractions are everywhere, but your goals matter more. Lock in and take the next step.",
];
const fallbackReplies = [
  "No matter what you say, you get a reply. No excuses.",
  "You want answers? Keep pushing.",
  "Not sure what you mean, but giving up isn't an option.",
  "Stay focused. Every question is a step forward.",
  "If you're lost, keep moving. The path will show itself.",
];

const redFlagKeywords = [
  "suicide",
  "kill myself",
  "end it all",
  "can't go on",
  "self-harm",
  "cut myself",
  "worthless",
  "no way out",
  "hopeless",
  "give up on life",
  "want to die",
  "ending my life",
  "overdose",
  "jump off",
  "hang myself",
  "ending it",
  "life is pointless",
  "no reason to live",
  "can't take it anymore",
  "ending everything",
  "want to disappear",
  "erase myself",
  "erase my existence",
  "can't escape",
  "can't survive",
  "want to vanish",
];
const expandedNegativeKeywords = [
  ...negativeKeywords,
  "alone",
  "nobody cares",
  "pointless",
  "overwhelmed",
  "broken",
  "cry",
  "pain",
  "hurting",
  "lost hope",
  "no one understands",
  "failure",
  "ashamed",
  "regret",
  "guilt",
  "anxiety",
  "panic",
  "fear",
  "worthless",
  "helpless",
  "stuck",
  "can't sleep",
  "nightmare",
  "dark thoughts",
  "hate myself",
  "can't focus",
  "can't eat",
  "can't breathe",
  "exhausted",
  "burned out",
  "no motivation",
  "can't cope",
  "can't handle",
  "unloved",
  "unwanted",
  "abandoned",
  "rejected",
  "invisible",
  "ignored",
  "not enough",
  "not good enough",
  "disappointed",
  "disappointing",
  "hopelessness",
  "despair",
  "lost cause",
  "no future",
  "no energy",
  "can't move",
  "can't try",
  "can't succeed",
  "always fail",
  "always wrong",
  "always alone",
  "numb",
  "empty",
  "void",
  "meaningless",
  "no purpose",
  "can't trust",
  "betrayed",
  "let down",
  "can't win",
  "can't change",
  "can't fix",
  "can't recover",
  "can't heal",
  "can't forgive",
  "can't forget",
  "can't believe",
  "can't love",
  "can't be loved",
  "can't talk",
  "can't share",
  "can't open up",
  "can't connect",
  "can't relate",
  "can't belong",
  "can't fit in",
  "can't find help",
  "can't get help",
  "can't escape my mind",
  "can't stop thinking",
  "can't stop crying",
  "can't stop hurting",
];
const expandedPositiveKeywords = [
  ...positiveKeywords,
  "grateful",
  "thankful",
  "joy",
  "peace",
  "calm",
  "relief",
  "hopeful",
  "healing",
  "growth",
  "resilient",
  "proud",
  "accomplished",
  "supported",
  "courage",
  "brave",
  "determined",
  "focused",
  "rested",
  "energized",
  "clear mind",
  "optimistic",
  "loved",
  "valued",
  "appreciated",
  "included",
  "accepted",
  "safe",
  "secure",
  "confident",
  "empowered",
  "uplifted",
  "motivated",
  "inspired",
  "encouraged",
  "stronger",
  "improving",
  "making progress",
  "moving forward",
  "learning",
  "growing",
  "healing",
  "recovering",
  "forgiving",
  "connecting",
  "belonging",
  "finding purpose",
  "finding meaning",
  "finding hope",
  "finding help",
  "finding support",
  "finding peace",
  "finding joy",
  "finding love",
  "finding strength",
  "finding courage",
  "finding clarity",
  "finding balance",
  "finding happiness",
  "finding comfort",
  "finding relief",
  "finding acceptance",
  "finding trust",
  "finding faith",
  "finding light",
  "finding direction",
  "finding motivation",
  "finding inspiration",
];
const escalationReplies = [
  "Enough negativity. You need to take action. If you need real help, reach out now: 988 Suicide & Crisis Lifeline.",
  "This is serious. If you're in crisis, call a professional or a trusted person immediately.",
  "You've been negative for a while. It's time to break the cycle. Here's a resource: https://988lifeline.org/",
];
const redFlagReplies = [
  "If you're in crisis, reach out for real help now. Call 988 or visit https://988lifeline.org/.",
  "This is urgent. Please talk to someone you trust or call a crisis line: 988.",
  "You matter. If you're thinking about self-harm, call 988 or reach out to a professional immediately.",
];

function getBotReply(userMsg, brutal, negativeStreak) {
  const msg = userMsg.toLowerCase();
  if (redFlagKeywords.some((word) => msg.includes(word))) {
    logSensitiveConversation(userMsg);
    return {
      text: redFlagReplies[Math.floor(Math.random() * redFlagReplies.length)],
      suggestTherapist: true,
    };
  }
  if (expandedNegativeKeywords.some((word) => msg.includes(word))) {
    if (negativeStreak >= 3) {
      return {
        text: escalationReplies[
          Math.floor(Math.random() * escalationReplies.length)
        ],
      };
    }
    if (brutal)
      return {
        text: brutalHonestyReplies[
          Math.floor(Math.random() * brutalHonestyReplies.length)
        ],
      };
    return {
      text: toughLoveReplies[
        Math.floor(Math.random() * toughLoveReplies.length)
      ],
    };
  }
  if (expandedPositiveKeywords.some((word) => msg.includes(word))) {
    return {
      text: encouragementReplies[
        Math.floor(Math.random() * encouragementReplies.length)
      ],
    };
  }
  if (msg.trim().length > 0) {
    return {
      text: neutralReplies[Math.floor(Math.random() * neutralReplies.length)],
    };
  }
  return {
    text: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)],
  };
}

const playSendSound = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "square";
  o.frequency.value = 880;
  g.gain.value = 0.1;
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.1);
};
const vibrate = () => {
  if (navigator.vibrate) navigator.vibrate(100);
};

const isSpeechRecognitionSupported =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

const speak = (text) => {
  if (window.speechSynthesis) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 1.1;
    window.speechSynthesis.speak(utter);
  }
};

const SENSITIVE_LOG_KEY = "sensitiveConversations";
function logSensitiveConversation(msg) {
  const log = JSON.parse(localStorage.getItem(SENSITIVE_LOG_KEY) || "[]");
  log.push({ text: msg, date: new Date().toISOString() });
  localStorage.setItem(SENSITIVE_LOG_KEY, JSON.stringify(log));
}

const downloadChatHistory = () => {
  const history = getChatHistory();
  if (!history.length) return;
  const lines = history.map(
    (msg) => `[${msg.sender === "user" ? "You" : "Bot"}] ${msg.text}`
  );
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chat_history.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const Chat = () => {
  const [mode, setMode] = useState("tough");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [brutal, setBrutal] = useState(false);
  const [reminder, setReminder] = useState(getReminderTime());
  const [listening, setListening] = useState(false);
  const [negativeStreak, setNegativeStreak] = useState(0);
  const [showTherapists, setShowTherapists] = useState(false);
  let recognition = null;
  const navigate = useNavigate();
  if (isSpeechRecognitionSupported) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  }

  useEffect(() => {
    setMessages(getChatHistory());
    // Check for missed check-in
    const last = getLastCheckin();
    if (reminder && last) {
      const now = new Date();
      const lastDate = new Date(last);
      if (
        now.toDateString() !== lastDate.toDateString() &&
        now > new Date(now.toDateString() + "T" + reminder)
      ) {
        toast.error("You missed your check-in! Get back on track!", {
          theme: "dark",
          style: { fontWeight: "bold", textTransform: "uppercase" },
        });
      }
    }
  }, []);

  useEffect(() => {
    setReminder(getReminderTime());
  }, []);

  const startListening = () => {
    if (!recognition) return;
    setListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };
  const stopListening = () => {
    if (!recognition) return;
    recognition.stop();
    setListening(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    playSendSound();
    vibrate();
    const userMsg = { sender: "user", text: input };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    saveChatHistory(newHistory);
    setInput("");
    setLastCheckin(new Date().toISOString());
    // Show hardcore quote every 5 user messages
    const userMsgCount = newHistory.filter((m) => m.sender === "user").length;
    if (userMsgCount % 5 === 0) {
      const quote =
        hardcoreQuotes[Math.floor(Math.random() * hardcoreQuotes.length)];
      toast.info(quote, {
        theme: "dark",
        style: { fontWeight: "bold", textTransform: "uppercase" },
      });
    }
    // Bot reply logic
    setTimeout(() => {
      let streak = negativeStreak;
      const msg = userMsg.text.toLowerCase();
      if (redFlagKeywords.some((word) => msg.includes(word))) {
        streak = 0;
      } else if (expandedNegativeKeywords.some((word) => msg.includes(word))) {
        streak += 1;
      } else {
        streak = 0;
      }
      setNegativeStreak(streak);
      const botReply = getBotReply(userMsg.text, brutal, streak);
      const botMsg = {
        sender: "bot",
        text: botReply.text,
        sensitive: redFlagKeywords.some((word) => msg.includes(word)),
        suggestTherapist: botReply.suggestTherapist,
      };
      const updatedHistory = [...newHistory, botMsg];
      setMessages(updatedHistory);
      saveChatHistory(updatedHistory);
      speak(botReply.text);
    }, 700);
  };

  const handleClear = () => {
    clearChatHistory();
    setMessages([]);
  };

  const handleReminderChange = (e) => {
    setReminder(e.target.value);
    setReminderTime(e.target.value);
  };

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <h1 className="text-4xl font-extrabold mb-6 text-neon-pink uppercase tracking-widest drop-shadow-lg">
        No More Excuses. Take Control Now.
      </h1>
      <div className="mb-4 p-4 bg-gray-100 rounded shadow text-xl font-bold text-red-600 uppercase tracking-wider border-2 border-red-400">
        This is your reality. Face it. Take action.
      </div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode("tough")}
          className={`px-6 py-2 rounded-full font-bold uppercase border-2 border-neon-pink shadow-lg ${mode === "tough" ? "bg-neon-pink text-white" : "bg-white text-neon-pink"}`}
        >
          You Want Change? Prove It.
        </button>
        <button
          onClick={() => setMode("compassionate")}
          className={`px-6 py-2 rounded-full font-bold uppercase border-2 border-neon-pink shadow-lg ${mode === "compassionate" ? "bg-neon-pink text-white" : "bg-white text-neon-pink"}`}
        >
          Struggling? Fight Back.
        </button>
        <button
          onClick={() => setBrutal((b) => !b)}
          className={`px-6 py-2 rounded-full font-bold uppercase border-2 border-yellow-400 shadow-lg ${brutal ? "bg-yellow-400 text-black" : "bg-white text-yellow-500"}`}
        >
          {brutal ? "Brutal Honesty ON" : "Brutal Honesty OFF"}
        </button>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <label className="font-bold">Set Daily Reminder:</label>
        <input
          type="time"
          value={reminder}
          onChange={handleReminderChange}
          className="bg-gray-100 text-black p-2 rounded border-2 border-neon-pink"
        />
      </div>
      <div className="bg-white p-6 rounded shadow-lg min-h-[300px] mb-8 border-4 border-neon-pink">
        <div className="mb-4 max-h-60 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-400">No chat history yet. Start fighting back.</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${msg.sensitive ? "bg-red-100 text-red-700 font-bold p-2 rounded border-2 border-red-400" : ""} text-${msg.sender === "user" ? "neon-pink" : "blue-600"}`}
              >
                <span className="font-bold">
                  {msg.sender === "user" ? "You" : "Bot"}:
                </span>{" "}
                {msg.text}
                {msg.suggestTherapist && (
                  <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-lg animate-pulse">
                    <div className="text-lg font-bold text-neon-pink mb-2">
                      Take Action: Reach Out to a Professional
                    </div>
                    <button
                      onClick={() => navigate("/therapists")}
                      className="mt-2 px-6 py-2 bg-neon-pink text-white font-bold rounded-full border-2 border-yellow-400 hover:bg-pink-700 transition animate-pulse"
                    >
                      View All Therapist Locations
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded bg-gray-100 text-black border-2 border-neon-pink focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your next move..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-neon-pink px-4 py-2 rounded font-bold animate-pulse border-4 border-neon-pink text-white shadow-lg"
          >
            Send It
          </button>
          <button
            onClick={handleClear}
            className="bg-red-600 px-4 py-2 rounded font-bold text-white border-2 border-red-400 shadow-lg"
          >
            Clear All
          </button>
          <button
            onClick={listening ? stopListening : startListening}
            className={`ml-2 px-3 py-2 rounded-full font-bold border-2 border-yellow-400 shadow-lg ${listening ? "bg-yellow-400 text-black animate-pulse" : "bg-white text-yellow-500"}`}
            title="Speech to Text"
            disabled={!isSpeechRecognitionSupported}
          >
            {listening ? "🎤 Listening..." : "🎤"}
          </button>
          <button
            onClick={downloadChatHistory}
            className="bg-blue-700 text-white px-4 py-2 rounded font-bold border-4 border-blue-400 hover:bg-blue-900 transition shadow-lg"
          >
            Download Chat
          </button>
        </div>
      </div>
      <div className="mt-8 text-center text-lg text-neon-pink font-bold animate-pulse">
        More Features Coming Soon!
      </div>
      <div className="mt-8 flex justify-center"></div>
      <div id="n8n-chat"></div>
    </div>
  );
};

const N8nHardcoreChatWidget = () => {
  useEffect(() => {
    // Inject n8n chat CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css";
    document.head.appendChild(link);

    // Inject n8n chat script
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
      createChat({
        webhookUrl: 'http://localhost:5678/webhook/624c7637-20b4-46f7-884c-40fc6b7f7a3f/chat'
      });
    `;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-extrabold text-neon-pink uppercase mb-6 tracking-widest animate-pulse">
        No Excuses. Get Real Help. Now.
      </h1>
      <div className="mb-4 text-lg text-red-500 font-bold uppercase animate-bounce">
        This is your reality. Face it. Take action. No more comfort zones.
      </div>
      <div className="mb-6 text-yellow-400 font-bold text-center animate-pulse">
        Warning: This chat is for the strong. If you're ready to change, start
        now. If you're in crisis, don't wait—call 988 or reach out to a
        professional.
      </div>
      <div
        id="n8n-chat"
        className="w-full max-w-xl border-4 border-neon-pink rounded-xl shadow-2xl bg-gray-900 p-4"
      ></div>
    </div>
  );
};

export default Chat;
