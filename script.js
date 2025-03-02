const API_URL = "https://node-backend-fm9h.onrender.com/chat";
 // Change this for deployment

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", () => {
  let userMessage = userInput.value.trim();
  if (userMessage !== "") {
    addMessage(userMessage, "user-message");
    userInput.value = "";
    fetchBotResponse(userMessage);
  }
});

async function fetchBotResponse(userMessage) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();
    addMessage(data.reply, "bot-message");
  } catch (error) {
    addMessage("❌ Error connecting to AI!", "bot-message");
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
