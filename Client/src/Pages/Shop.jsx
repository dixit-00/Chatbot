import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const botResponses = [
  {
    keywords: [/\b(hi|hello|hey|greetings|good (morning|afternoon|evening))\b/i],
    response: "Hello! 👋 How can I support your mental well-being today?",
  },
  {
    keywords: [/\b(thank(s| you)?|appreciate|grateful)\b/i],
    response: "You're very welcome! If you need anything else, I'm here for you.",
  },
  {
    keywords: [/\b(sad|depress(ed|ion)?|unhappy|down|cry|blue)\b/i],
    response: "I'm sorry you're feeling this way. Remember, it's okay to ask for help. Would you like some tips to feel better or talk to someone?",
  },
  {
    keywords: [/\b(anxious|anxiety|nervous|worried|panic)\b/i],
    response: "Anxiety can be tough. Try taking deep breaths and grounding yourself. Would you like a guided breathing exercise?",
  },
  {
    keywords: [/\b(stress(ed)?|overwhelm(ed)?|burnout|pressure)\b/i],
    response: "Stress and burnout are common. Taking breaks and self-care are important. Would you like some stress management tips?",
  },
  {
    keywords: [/\b(lonely|alone|isolated|no one|nobody)\b/i],
    response: "Feeling lonely can be hard. Remember, you're not alone. Would you like ideas for connecting with others or self-care activities?",
  },
  {
    keywords: [/\b(motivat(e|ion)|inspire|can't do|give up|hopeless)\b/i],
    response: "Motivation can fluctuate. Setting small goals can help. Would you like a motivational quote or some goal-setting tips?",
  },
  {
    keywords: [/\b(sleep|insomnia|can't sleep|restless|tired|fatigue|exhaust(ed|ion)?)\b/i],
    response: "Sleep is vital for mental health. Would you like some sleep hygiene tips or a relaxation exercise?",
  },
  {
    keywords: [/\b(help|support|talk|counsel(or|ling)|therapist|doctor|emergency)\b/i],
    response: "I'm here to listen. If you need professional help, consider reaching out to a counselor, therapist, or trusted person. If this is an emergency, please contact a helpline or emergency services.",
  },
  {
    keywords: [/\b(happy|good|great|awesome|fantastic|positive|joy)\b/i],
    response: "That's wonderful to hear! Keep focusing on the positive moments. 😊",
  },
  {
    keywords: [/\b(bored|nothing to do|dull)\b/i],
    response: "Boredom can be an opportunity to try something new. Would you like some activity suggestions?",
  },
  {
    keywords: [/\b(angry|mad|frustrated|upset|irritated)\b/i],
    response: "Anger is a natural emotion. Would you like some techniques to manage anger or calm down?",
  },
  {
    keywords: [/\b(tired|exhausted|sleepy|fatigued)\b/i],
    response: "Rest is important. Would you like some tips for relaxation or better sleep?",
  },
  {
    keywords: [/\b(bye|goodbye|see you|later)\b/i],
    response: "Take care! Remember, I'm always here if you want to talk again.",
  },
  {
    keywords: [
      /\b(therapist|counsel(l)?or|counseling|mental health center|youth center|yuvadi|support center|clinic|doctor near|help near|find (help|support|center|doctor|therapist|counselor))\b/i,
      /\b(location|address|number|contact|phone)\b/i
    ],
    response:
      `Here are some example resources near you:\n\n- MindCare Therapy Center: 123 Wellness St, Cityville. Phone: 555-123-4567\n- Yuvadi Youth Center: 456 Hope Ave, Cityville. Phone: 555-987-6543\n- City Mental Health Clinic: 789 Calm Rd, Cityville. Phone: 555-222-3333\n\nFor more resources and verified contacts, please visit our Resources page. If this is an emergency, call your local helpline or 112/911 immediately.`,
  },
  {
    keywords: [
      /\b(setback|fail(ed|ure)?|mistake|mess(ed)? up|screwed up|regret|relapse|slip(ped)?|lost|can't win|can't succeed)\b/i
    ],
    response:
      "Setbacks are not the end. They're a test of your resolve. Every champion has failed more times than most people have tried. Get up, learn, and attack your goals again. No more self-pity—just action.",
  },
  {
    keywords: [
      /\b(worthless|not good enough|unlovable|hate myself|can't love myself|no value|no worth|no purpose)\b/i
    ],
    response:
      "You are not worthless. Your mind is lying to you. Prove it wrong by taking one positive action right now. Worth is built, not given. Start building yours—one step, one choice at a time.",
  },
  {
    keywords: [
      /\b(social anxiety|afraid of people|can't talk|can't socialize|awkward|shy|embarrassed|nervous in public)\b/i
    ],
    response:
      "Social anxiety is tough, but it doesn't define you. Start small—one hello, one conversation. The more you face it, the less power it has. You are stronger than your fear.",
  },
  {
    keywords: [
      /\b(procrastinat(e|ion)|can't start|keep delaying|put off|lazy|no motivation|can't focus|can't finish)\b/i
    ],
    response:
      "Procrastination is a habit, not a life sentence. Break it by taking one small action right now. Momentum is built, not found. Start, even if it's ugly. Winners finish what they start.",
  },
  {
    keywords: [
      /\b(self[- ]?care|take care of myself|pamper|treat myself|rest|recharge|me time)\b/i
    ],
    response:
      "Self-care is not selfish—it's survival. You can't pour from an empty cup. Schedule time for yourself and defend it like your life depends on it—because it does.",
  },
  {
    keywords: [
      /\b(breakup|heartbreak|relationship|partner|ex|divorce|fight with|argue with|lost friend|friendship|betrayed|cheated)\b/i
    ],
    response:
      "Relationships can hurt, but they also teach. Use the pain as fuel to grow stronger and wiser. You can't control others, but you can control your response. Heal, then rise.",
  },
  {
    keywords: [
      /\b(burnout|burned out|exhausted|can't keep up|overworked|drained|worn out|fatigued)\b/i
    ],
    response:
      "Burnout is a warning, not a weakness. Rest is part of the process. Step back, recharge, and then come back swinging. You can't win if you never recover.",
  },
  {
    keywords: [
      /\b(perfect|perfectionist|never good enough|must be perfect|can't make mistakes|fear of failure)\b/i
    ],
    response:
      "Perfection is a myth. Progress is real. Stop chasing flawless and start chasing finished. Mistakes are proof you're trying. Done is better than perfect.",
  },
  {
    keywords: [
      /\b(guilt|ashamed|shame|embarrassed|can't forgive myself|regret)\b/i
    ],
    response:
      "Guilt is a sign you care. Shame is a liar. Forgive yourself, learn, and move forward. You can't change the past, but you can own your future. Start now.",
  },
  {
    keywords: [
      /\b(hope|resilience|bounce back|never give up|keep going|stronger|survivor|fighter|warrior)\b/i
    ],
    response:
      "Hope is a weapon. Resilience is your armor. Every time you get knocked down and get back up, you prove you are a fighter. Keep swinging. You are not done yet.",
  }
];

const moodMap = [
  { keywords: ["happy", "good", "great", "awesome", "fine", "well"], label: "Happy", emoji: "😊" },
  { keywords: ["sad", "depressed", "unhappy", "down", "cry"], label: "Sad", emoji: "😢" },
  { keywords: ["anxious", "anxiety", "nervous", "worried", "panic"], label: "Anxious", emoji: "😰" },
  { keywords: ["angry", "mad", "frustrated", "upset"], label: "Angry", emoji: "😡" },
  { keywords: ["tired", "exhausted", "sleepy", "fatigued"], label: "Tired", emoji: "😴" },
  { keywords: ["help", "support", "talk"], label: "Seeking Support", emoji: "🤝" },
];

// Add red-flag/urgent keywords for crisis detection
const redFlagKeywords = [
  "suicide", "kill myself", "end it all", "can't go on", "self-harm", "cut myself", "worthless", "no way out", "hopeless", "give up on life", "want to die", "ending my life", "overdose", "jump off", "hang myself", "ending it", "life is pointless", "no reason to live", "can't take it anymore", "ending everything", "want to disappear", "erase myself", "erase my existence", "can't escape", "can't survive", "want to vanish"
];
const crisisResponse = `⚠️ URGENT: If you are in crisis or thinking about self-harm, please reach out for real help now. Call 988 (Suicide & Crisis Lifeline) or visit https://988lifeline.org/. You are not alone. If you need a therapist, here are some options:\n- MindCare Therapy Center: 123 Wellness St, Cityville. Phone: 555-123-4567\n- Yuvadi Youth Center: 456 Hope Ave, Cityville. Phone: 555-987-6543\n- City Mental Health Clinic: 789 Calm Rd, Cityville. Phone: 555-222-3333`;

function getBotResponse(message) {
  // Crisis detection
  const lower = message.toLowerCase();
  if (redFlagKeywords.some((kw) => lower.includes(kw))) {
    return crisisResponse;
  }
  for (const entry of botResponses) {
    let match = false;
    for (const kw of entry.keywords) {
      if (typeof kw === "string" && lower.includes(kw)) match = true;
      if (kw instanceof RegExp && kw.test(message)) match = true;
    }
    if (match) return entry.response;
  }
  // Hardcore fallback
  return "No more excuses. I'm here for you, but you have to take the next step. Be honest, be bold, and if you need real help, reach out now.";
}

function detectMood(messages) {
  if (!messages.length) return { label: "Neutral", emoji: "🙂" };
  const lastUserMsg = [...messages].reverse().find((m) => m.sender === "user");
  if (!lastUserMsg) return { label: "Neutral", emoji: "🙂" };
  const lower = lastUserMsg.text.toLowerCase();
  for (const mood of moodMap) {
    if (mood.keywords.some((kw) => lower.includes(kw))) return { label: mood.label, emoji: mood.emoji };
  }
  return { label: "Neutral", emoji: "🙂" };
}

function summarizeConversation(messages) {
  // Simple summary: list user moods and main topics
  const userMsgs = messages.filter((m) => m.sender === "user");
  const topics = Array.from(new Set(userMsgs.map((m) => detectMood([m]).label)));
  return `Summary:\n- Moods detected: ${topics.join(", ")}\n- Total exchanges: ${messages.length / 2}`;
}

const Chatbot = () => {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your mental health chatbot. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("chatbot_dark") === "true");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const [tts, setTts] = useState(true);
  const [stt, setStt] = useState(true);
  useEffect(() => {
    setTts(localStorage.getItem("chatbot_tts") !== "false");
    setStt(localStorage.getItem("chatbot_stt") !== "false");
  }, []);
  useEffect(() => {
    localStorage.setItem("chatbot_dark", darkMode);
  }, [darkMode]);

  // Text-to-Speech for bot messages
  const speak = (text) => {
    if (tts && window.speechSynthesis) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = 1;
      window.speechSynthesis.speak(utter);
    }
  };

  // Handle sending message
  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    const botText = getBotResponse(input);
    const botMsg = { sender: "bot", text: botText };
    setMessages((msgs) => [...msgs, userMsg, botMsg]);
    setInput("");
    setTimeout(() => speak(botText), 400); // Speak bot reply
  };

  // Speech-to-Text (Voice Input)
  const handleVoiceInput = () => {
    if (!stt) return;
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
      };
      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
    setListening(true);
    recognitionRef.current.start();
  };

  // Text-to-Speech for last bot message
  const handleSpeakLastBot = () => {
    if (!tts) return;
    const lastBotMsg = [...messages].reverse().find((msg) => msg.sender === "bot");
    if (lastBotMsg) speak(lastBotMsg.text);
  };

  // Conversation summary
  const handleShowSummary = () => setShowSummary(true);
  const handleCloseSummary = () => setShowSummary(false);

  // Clear chat
  const handleClearChat = () => {
    setMessages([{ sender: "bot", text: "Hello! I'm your mental health chatbot. How are you feeling today?" }]);
  };

  // Download chat
  const handleDownloadChat = () => {
    const text = messages.map((m) => `${m.sender === "user" ? "You" : "Bot"}: ${m.text}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chatbot_conversation.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Mood detection
  const mood = detectMood(messages);
  const username = userData?.name || "Developer";

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-blue-50"} transition-colors font-mono`}> 
      <div className={`w-full max-w-lg sm:max-w-md mx-2 sm:mx-0 p-2 sm:p-6 rounded-2xl border-2 shadow-xl ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-blue-200"} transition-colors relative flex flex-col`}>
        {/* Personalized Greeting */}
        <div className="flex items-center justify-center mb-3 gap-2">
          <span className={`text-xl sm:text-2xl font-extrabold tracking-wide ${darkMode ? "text-yellow-300" : "text-blue-700"}`}>Hey {username}!<span className="ml-1">👋🏻</span></span>
        </div>
        {/* Top Controls */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => setDarkMode((d) => !d)}
            className={`p-2 rounded-full border ${darkMode ? "bg-yellow-400 border-gray-800" : "bg-gray-200 border-blue-700"} hover:bg-yellow-300 transition`}
            title="Toggle Dark Mode"
          >
            <span role="img" aria-label="dark-mode" className="text-xl">{darkMode ? "🌙" : "☀️"}</span>
          </button>
          <span className={`text-base font-bold tracking-wide ${darkMode ? "text-yellow-300" : "text-blue-700"}`}>{mood.emoji} {mood.label}</span>
          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-full border bg-blue-700 text-white hover:bg-blue-900 transition border-white shadow"
            title="Settings"
          >
            <span role="img" aria-label="settings" className="text-xl">⚙️</span>
          </button>
        </div>
        {/* Advanced Controls */}
        <div className="flex gap-2 mb-2">
          <button
            onClick={handleShowSummary}
            className={`flex-1 py-1 rounded font-semibold text-xs ${darkMode ? "bg-gray-700 text-yellow-200 hover:bg-gray-600" : "bg-blue-100 text-blue-800 hover:bg-blue-200"} transition`}
            title="Show Conversation Summary"
          >
            📝 Summary
          </button>
          <button
            onClick={handleClearChat}
            className={`flex-1 py-1 rounded font-semibold text-xs ${darkMode ? "bg-gray-700 text-yellow-200 hover:bg-gray-600" : "bg-blue-100 text-blue-800 hover:bg-blue-200"} transition`}
            title="Clear Chat"
          >
            🗑️ Clear
          </button>
          <button
            onClick={handleDownloadChat}
            className={`flex-1 py-1 rounded font-semibold text-xs ${darkMode ? "bg-gray-700 text-yellow-200 hover:bg-gray-600" : "bg-blue-100 text-blue-800 hover:bg-blue-200"} transition`}
            title="Download Chat"
          >
            ⬇️ Download
          </button>
        </div>
        {/* Chat Window */}
        <div className={`flex-1 h-72 sm:h-80 overflow-y-auto border rounded p-2 sm:p-3 mb-2 ${darkMode ? "border-gray-600 bg-gray-900" : "border-blue-100 bg-gray-50"} transition-colors`}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[80%] text-sm sm:text-base font-semibold shadow flex flex-col items-end`}
                style={{ alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}
              >
                {msg.sender === "user" && (
                  <span className={`text-xs font-bold mb-1 ${darkMode ? "text-yellow-300" : "text-blue-700"}`}>{username}</span>
                )}
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        {/* Therapists Button */}
        <button
          onClick={() => navigate("/therapists")}
          className={`w-full mb-2 py-2 rounded font-bold text-base ${darkMode ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" : "bg-blue-700 text-white hover:bg-blue-800"} transition shadow`}
        >
          🏥 Find Therapists & Centers
        </button>
        {/* Input and Voice Controls */}
        <form onSubmit={handleSend} className="flex gap-2 items-center mb-1">
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2 rounded-full border ${darkMode ? "border-yellow-400 bg-gray-700 hover:bg-gray-600" : "border-blue-600 bg-blue-100 hover:bg-blue-200"} transition shadow ${listening ? 'animate-pulse border-red-500' : ''}`}
            title="Voice to Text"
            disabled={!stt}
          >
            <span role="img" aria-label="mic" className="text-xl">🎤</span>
          </button>
          <input
            type="text"
            className={`flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 text-base ${darkMode ? "border-yellow-400 focus:ring-yellow-300 bg-gray-900 text-yellow-100" : "border-blue-400 focus:ring-blue-300"}`}
            placeholder={listening ? "Listening..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={listening}
            autoComplete="off"
          />
          <button
            type="submit"
            className={`bg-blue-700 text-white px-4 py-2 rounded font-bold hover:bg-blue-800 transition shadow ${darkMode ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" : ""}`}
          >
            Send
          </button>
          <button
            type="button"
            onClick={handleSpeakLastBot}
            className={`p-2 rounded-full border ${darkMode ? "border-yellow-400 bg-gray-700 hover:bg-gray-600" : "border-blue-600 bg-blue-100 hover:bg-blue-200"} transition shadow`}
            title="Text to Speech (Bot)"
            disabled={!tts}
          >
            <span role="img" aria-label="speaker" className="text-xl">🔊</span>
          </button>
        </form>
        <div className={`text-xs text-center mt-1 ${darkMode ? "text-yellow-300" : "text-blue-400"}`}>
          <span className="font-bold">Tip:</span> Use <span className="font-mono">🎤</span> for voice input, <span className="font-mono">🔊</span> to hear the bot, <span className="font-mono">⚙️</span> for settings.
        </div>
        {/* Summary Modal */}
        {showSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className={`p-6 rounded-xl shadow-2xl max-w-sm w-full ${darkMode ? "bg-gray-800 text-yellow-100" : "bg-white text-blue-900"}`}>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">📝 Conversation Summary</h3>
              <pre className="whitespace-pre-wrap text-xs mb-4">{summarizeConversation(messages)}</pre>
              <button
                onClick={handleCloseSummary}
                className={`w-full py-2 rounded font-bold ${darkMode ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" : "bg-blue-700 text-white hover:bg-blue-800"} transition`}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
