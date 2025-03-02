const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins

// Keep-Alive settings to reduce latency
const http = require("http");
const server = http.createServer(app);
server.keepAliveTimeout = 60000; // 60 seconds

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Message cannot be empty!" });
    }

    try {
        // Start timing the API call
        console.time("API Response Time");

        // Send request to Gemini API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro-vision-latest:generateMessage?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: userMessage }] }],
            },
            { timeout: 5000 } // Set a timeout of 5 seconds
        );

        // Extract response faster
        const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I didn't get that.";

        console.timeEnd("API Response Time"); // End timing
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ reply: "⚠️ API Error: Please try again later." });
    }
});

// Start the server with optimized Keep-Alive
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
document.addEventListener("DOMContentLoaded", loadChatHistory);

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput.trim()) return;

    appendMessage("User", userInput, "user-message");
    document.getElementById("user-input").value = "";

    // Add Typing Indicator
    appendMessage("Bot", "Typing...", "bot-message", "typing");

    try {
        const response = await fetch("http://localhost:5000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        removeTypingIndicator();
        appendMessage("Bot", data.reply, "bot-message");

        saveToLocalStorage(userInput, data.reply);
    } catch (error) {
        console.error("Error:", error);
        removeTypingIndicator();
        appendMessage("Bot", "⚠️ Unable to fetch response.", "bot-message");
    }
}

function appendMessage(sender, message, className, id = "") {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", className);
    if (id) messageDiv.id = id;
    messageDiv.innerText = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing");
    if (typingIndicator) typingIndicator.remove();
}

function saveToLocalStorage(userMsg, botMsg) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ user: userMsg, bot: botMsg });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(chat => {
        appendMessage("User", chat.user, "user-message");
        appendMessage("Bot", chat.bot, "bot-message");
    });
}
