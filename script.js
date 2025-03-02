const API_URL = "https://node-backend-fm9h.onrender.com/chat"; // Replace with your actual Render backend URL

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");

// Dark Mode (Optional Toggle, if desired)
const darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Send message when Send button is clicked
sendBtn.addEventListener("click", () => {
  let userMessage = userInput.value.trim();
  if (userMessage !== "") {
    addMessage(userMessage, "user-message");
    userInput.value = "";
    fetchBotResponse(userMessage);
  }
});

// Allow "Enter" key to send message
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// Voice Input (Speech-to-Text)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

voiceBtn.addEventListener("click", () => {
  recognition.start();
});

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  userInput.value = transcript;
  sendBtn.click();
};

// Function to add messages to the chat box
function addMessage(text, className) {
  let message = document.createElement("p");
  message.className = className;
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing Indicator
function showTypingIndicator() {
  let typingIndicator = document.createElement("p");
  typingIndicator.className = "typing-indicator";
  typingIndicator.textContent = "Bot is typing...";
  chatBox.appendChild(typingIndicator);
  return typingIndicator;
}

// Fetch response from backend and update chat box
async function fetchBotResponse(userMessage) {
  const typingIndicator = showTypingIndicator();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    chatBox.removeChild(typingIndicator);

    const data = await response.json();
    if (data.reply) {
      let botMessage = addMessage(data.reply, "bot-message");
      speakText(data.reply); // Text-to-Speech: Bot speaks the reply
    } else {
      addMessage("⚠️ No response received. Check API!", "bot-message");
    }
  } catch (error) {
    chatBox.removeChild(typingIndicator);
    addMessage("❌ Error connecting to AI. Check console!", "bot-message");
    console.error("Chatbot Error:", error);
  }
}

// Text-to-Speech (Bot speaks)
const synth = window.speechSynthesis;

function speakText(text) {
  if (synth.speaking) {
    synth.cancel();
  }
  let utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  synth.speak(utterance);
}

// Event listener for chatbot response click
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("bot-message")) {
    speakText(event.target.textContent);
  }
});

// Event listener to stop speech when user types a new message
userInput.addEventListener("input", () => {
  if (synth.speaking) {
    synth.cancel();
  }
});

// Contact Modal Functionality
const contactBtn = document.getElementById("contact-btn");
const modal = document.getElementById("contact-modal");
const closeModal = document.getElementById("close-modal");

if (contactBtn) {
  contactBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });
}

if (closeModal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
