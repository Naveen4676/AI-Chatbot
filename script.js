document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    fetch("http://localhost:10000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        chatBox.innerHTML += `<p><strong>AI:</strong> ${data.reply}</p>`;
        document.getElementById("user-input").value = "";
    })
    .catch(error => console.error("Error:", error));
}

// Contact Modal Logic
const contactBtn = document.getElementById("contact-btn");
const contactModal = document.getElementById("contact-modal");
const closeModal = document.querySelector(".close");

contactBtn.onclick = () => contactModal.style.display = "block";
closeModal.onclick = () => contactModal.style.display = "none";
window.onclick = (event) => {
    if (event.target === contactModal) contactModal.style.display = "none";
};
