document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    generateBtn.addEventListener("click", () => {
        const userInput = document.getElementById("user-input").value.trim();
        if (userInput) {
            alert(`Generating flashcards for: ${userInput}`);
            // You can replace this alert with actual AI API integration logic
        } else {
            alert("Please enter a topic or text.");
        }
    });
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
  themeToggle.textContent = body.dataset.theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
});