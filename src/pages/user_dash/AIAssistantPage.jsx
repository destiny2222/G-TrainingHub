// src/components/AIAssistantPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { ArrowUp, Bot, User, LoaderCircle } from "lucide-react";
import "../../components/AIAssistantPage.css";

function cleanMarkdown(text) {
  return (
    text
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/_(.*?)_/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(
        /`([^`]+)`/g,
        '<code style="background:#f3f4f6;padding:2px 4px;border-radius:4px;font-size:0.85em;font-family:monospace;">$1</code>'
      )
      .replace(/```[\s\S]*?```/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/^\s*>\s?/gm, "")
      .replace(/^\s*[-*+] ?/gm, "• ")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/^\s*[-=_]{3,}\s*$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result.split(",")[1]);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

const examplePrompts = [
  "How do I enroll in a course?",
  "What is the certificate process?",
  "How do I track my progress?",
  "How do I access the library?",
];

const systemInstruction = `
You are the GritinAI Training Hub Assistant, an AI designed to help users navigate, understand, and make the most of the GritinAI Training Hub platform.

Core Responsibilities:
- Answer questions about platform features, course enrollment, certificates, and user progress
- Provide clear, practical, and friendly guidance for learners and administrators
- Help troubleshoot common issues and explain how to use different parts of the platform

Guidelines:
- Always be professional, concise, and supportive
- Use simple, direct language (no markdown formatting)
- Focus on actionable, helpful advice for users of all backgrounds
`;

function AIAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]); // {text, sender, file?}
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genAI, setGenAI] = useState(null);

  const chatRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
    //   console.error("Missing REACT_APP_GEMINI_API_KEY in .env");
      return;
    }
    try {
      const client = new GoogleGenAI({ apiKey });
      setGenAI(client);
    } catch (err) {
    //   console.error("Failed to create GoogleGenAI client:", err);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  const handleExampleClick = (text) => {
    setPrompt(text);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size too large. Please select a file smaller than 10MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid file: JPEG, PNG, GIF, WebP, or PDF.");
      return;
    }

    setSelectedFile(file);
  };

  const handlePlusClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

const handleSend = async (e) => {
  e.preventDefault();
  if ((!prompt.trim() && !selectedFile) || !genAI || isLoading) return;

  const userText = prompt.trim();
  const userMessage = {
    text: userText || (selectedFile ? "[File attached]" : ""),
    sender: "user",
    file: selectedFile || undefined,
  };

  setMessages((prev) => [...prev, userMessage]);
  setPrompt("");
  setIsLoading(true);

  try {
    const historyContents = messages.map((m) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const messageParts = [];
    if (userText) {
      messageParts.push({ text: userText });
    }
    if (selectedFile) {
      const filePart = await fileToGenerativePart(selectedFile);
      messageParts.push(filePart);
    }

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...historyContents,
        { role: "user", parts: messageParts },
      ],
      config: {
        systemInstruction,
      },
    });

    setSelectedFile(null);

    // 👉 Robust reply extraction
    let replyText = "";

    if (result && result.response && typeof result.response.text === "function") {
      try {
        replyText = (result.response.text() || "").trim();
      } catch (e) {
        // ignore
      }
    }

    if (!replyText) {
      const responseObj = result.response || result;
      const candidate = responseObj?.candidates?.[0];
      const parts = candidate?.content?.parts || [];
      replyText = parts
        .map((p) => p.text || "")
        .join("\n")
        .trim();
    }

    if (!replyText) {
      replyText = "Sorry, I couldn't generate a response.";
    }

    setMessages((prev) => [...prev, { text: replyText, sender: "ai" }]);
  } catch (err) {
    // console.error("Error talking to Gemini:", err);
    setMessages((prev) => [
      ...prev,
      {
        text:
          "Sorry, I encountered an error talking to the AI. Please check your API key and try again.",
        sender: "ai",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};


  const handleCopyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="ai-assistant-container">
      {/* Header */}
      <div className="ai-assistant-header">
        <Bot size={24} />
        <span className="ai-assistant-title">Project Assistant – Ask about GritinAI Training Hub</span>
      </div>

      {/* Chat area */}
      <div ref={chatRef} className="ai-assistant-chat">
        {messages.length === 0 && (
          <div className="ai-assistant-empty">
            <p style={{ fontSize: 20, fontWeight: 700 }}>Welcome to the GritinAI Training Hub Assistant!</p>
            <p>Ask questions about the platform, features, usage, or get help with your training journey.</p>
            <div className="ai-assistant-example-row">
              <button
                className="ai-assistant-example-btn"
                onClick={() => setPrompt(examplePrompts[0])}
              >{examplePrompts[0]}</button>
              <button
                className="ai-assistant-example-btn"
                onClick={() => setPrompt(examplePrompts[1])}
              >{examplePrompts[1]}</button>
              <button
                className="ai-assistant-example-btn"
                onClick={() => setPrompt(examplePrompts[2])}
              >{examplePrompts[2]}</button>
            </div>
            <div style={{ marginTop: 18, color: "#6b7280", fontSize: 14 }}>
              💡 You can also ask about features, troubleshooting, or platform tips.
            </div>
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`ai-assistant-message-row${m.sender === "user" ? " user" : ""}`}
          >
            {m.sender === "ai" && (
              <div className="ai-assistant-avatar">
                <Bot size={20} />
              </div>
            )}

            <div className={`ai-assistant-message${m.sender === "user" ? " user" : ""}`}
              dangerouslySetInnerHTML={{
                __html: m.text
                  .replace(/\n/g, '<br />')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/__(.*?)__/g, '<strong>$1</strong>')
                  .replace(/_(.*?)_/g, '<em>$1</em>')
              }}
            />

            {m.sender === "user" && (
              <div className="ai-assistant-avatar user">
                <User size={20} />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="ai-assistant-loading">
            <LoaderCircle size={20} className="animate-spin" />
            <span>Assistant is thinking...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="ai-assistant-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about GritinAI Training Hub..."
          rows={1}
          className="ai-assistant-textarea"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="ai-assistant-send-btn"
        >
          {isLoading ? <LoaderCircle size={20} className="animate-spin" /> : <ArrowUp size={20} />}
        </button>
      </form>
    </div>
  );
}

export default AIAssistantPage;
