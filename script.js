document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    generateBtn.addEventListener("click", () => {
        const userInput = document.getElementById("user-input").value.trim();
        if (userInput) {
            alert(`Generating flashcards for: ${userInput}`);
            //we can replace this alert with actual AI API integration logic
        } else {
            alert("Please enter a topic or text.");
        }
    });
});

// Get the theme toggle button
const themeToggle = document.getElementById('theme-toggle');

// Function to set the theme
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Function to toggle the theme
function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Load the saved theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
}

// Toggle button
themeToggle.addEventListener('click', toggleTheme);

// Load the theme when the page loads
window.addEventListener('load', loadTheme);

const themeIcon = document.getElementById('theme-icon');

function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  themeIcon.textContent = newTheme === 'light' ? '☀️ Light' : '🌙 Dark';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  themeIcon.textContent = savedTheme === 'light' ? '☀️ Light' : '🌙 Dark';
}