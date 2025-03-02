const API_URL = "https://node-backend-fm9h.onrender.com/chat"; // Ensure correct endpoint

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Send Message
sendBtn.addEventListener("click", () => sendMessage());
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    let userMessage = userInput.value.trim();
    if (userMessage === "") return;
    addMessage(userMessage, "user-message");
    userInput.value = "";
    fetchBotResponse(userMessage);
}

async function fetchBotResponse(userMessage) {
    addTypingIndicator();
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }),
        });
        removeTypingIndicator();
        
        if (!response.ok) throw new Error("API Error");
        const data = await response.json();
        addMessage(data.reply || "⚠️ No response received.", "bot-message");
    } catch (error) {
        removeTypingIndicator();
        addMessage("❌ Error: Unable to connect to AI.", "bot-message");
        console.error("Chatbot Error:", error);
    }
}

function addMessage(text, className) {
    let message = document.createElement("p");
    message.className = className;
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addTypingIndicator() {
    let indicator = document.createElement("p");
    indicator.id = "typing-indicator";
    indicator.textContent = "Bot is typing...";
    chatBox.appendChild(indicator);
}

function removeTypingIndicator() {
    let indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
}
