async function fetchBotResponse(userMessage) {
  try {
      const response = await fetch("https://node-backend-fm9h.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      addMessage(data.reply || "⚠️ No response received.", "bot-message");

  } catch (error) {
      addMessage("❌ Error connecting to AI!", "bot-message");
      console.error("Chatbot Error:", error);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const contactModal = document.getElementById("contactModal");
  const closeModal = document.getElementById("closeModal");

  closeModal.addEventListener("click", function () {
      contactModal.style.display = "none";
  });

  // Close modal when clicking outside of it
  window.addEventListener("click", function (event) {
      if (event.target === contactModal) {
          contactModal.style.display = "none";
      }
  });
});
