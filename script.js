
// ================= GET ELEMENTS =================
const passwordEl = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthVal = document.getElementById("lengthVal");
const historyList = document.getElementById("history");

const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");

const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

// ================= CHAR SETS =================
const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+";

// ================= SLIDER =================
lengthSlider.oninput = () => {
  lengthVal.innerText = lengthSlider.value;
};

// ================= GENERATE PASSWORD =================
function generatePassword() {
  let chars = "";
  let password = "";

  if (uppercaseEl.checked) chars += upper;
  if (lowercaseEl.checked) chars += lower;
  if (numbersEl.checked) chars += numbers;
  if (symbolsEl.checked) chars += symbols;

  if (!chars) {
    alert("Please select at least one option!");
    return;
  }

  // Ensure at least one from each selected type
  if (uppercaseEl.checked) password += randomChar(upper);
  if (lowercaseEl.checked) password += randomChar(lower);
  if (numbersEl.checked) password += randomChar(numbers);
  if (symbolsEl.checked) password += randomChar(symbols);

  // Fill remaining
  while (password.length < lengthSlider.value) {
    password += randomChar(chars);
  }

  // Shuffle password
  password = shuffle(password);

  passwordEl.value = password;

  updateStrength(password);
  addHistory(password);
}

// ================= HELPERS =================
function randomChar(set) {
  return set[Math.floor(Math.random() * set.length)];
}

function shuffle(str) {
  return str.split('').sort(() => Math.random() - 0.5).join('');
}

// ================= COPY =================
function copyPassword() {
  if (!passwordEl.value) return;

  navigator.clipboard.writeText(passwordEl.value);
  alert("Password copied!");
}

// ================= STRENGTH =================
function updateStrength(pass) {
  let score = 0;

  if (pass.length >= 8) score++;
  if (pass.length >= 12) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  const widths = ["20%", "40%", "60%", "80%", "100%"];
  const colors = ["red", "orange", "yellow", "lightgreen", "green"];
  const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];

  strengthBar.style.width = widths[score - 1] || "20%";
  strengthBar.style.background = colors[score - 1] || "red";
  strengthText.innerText = "Strength: " + (labels[score - 1] || "Weak");
}

// ================= HISTORY =================
function addHistory(pass) {
  const li = document.createElement("li");
  li.innerText = pass;
  historyList.prepend(li);

  // limit history
  if (historyList.children.length > 5) {
    historyList.removeChild(historyList.lastChild);
  }
}

// ================= THEME TOGGLE =================
const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  toggleBtn.innerText = "🌞";
}

toggleBtn.onclick = () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    toggleBtn.innerText = "🌞";
  } else {
    localStorage.setItem("theme", "dark");
    toggleBtn.innerText = "🌙";
  }
};

// ================= WOW BACKGROUND =================
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3,
    dx: (Math.random() - 0.5) * 2,
    dy: (Math.random() - 0.5) * 2
  });
}

function animate() {
  ctx.fillStyle = "rgba(15,12,41,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,0,255,0.7)";
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  requestAnimationFrame(animate);
}

animate();

// resize fix
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});