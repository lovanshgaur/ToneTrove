const BATCH_SIZE = 24;
let allTones = [];
let currentList = [];
let currentIndex = 0;

const tonesContainer = document.getElementById("tones");
const vibesContainer = document.getElementById("vibes-container");

function getContrast(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
}

fetch("assets/data.json")
  .then((res) => res.json())
  .then((data) => {
    allTones = data.tones.sort(() => Math.random() - 0.5);
    currentList = allTones;
    renderVibes();
    loadMoreTones();
  })
  .catch((err) => console.error("Error loading palettes:", err));

function loadMoreTones() {
  if (currentIndex >= currentList.length) return;
  const batch = currentList.slice(currentIndex, currentIndex + BATCH_SIZE);
  renderTones(batch);
  currentIndex += batch.length;
  observeLastCard();
}

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      observer.unobserve(entries[0].target);
      loadMoreTones();
    }
  },
  { rootMargin: "200px" }
);

function observeLastCard() {
  const cards = document.querySelectorAll(".tone-card");
  if (cards.length > 0) {
    observer.observe(cards[cards.length - 1]);
  }
}

function renderTones(tones) {
  tones.forEach((tone) => {
    const card = document.createElement("div");
    card.className = "tone-card";

    const colorsDiv = document.createElement("div");
    colorsDiv.className = "tone-colors";

    Object.values(tone.colors).forEach((color) => {
      const stripe = document.createElement("div");
      stripe.className = "stripe";
      stripe.style.backgroundColor = color;
      stripe.style.color = getContrast(color);

      const hex = document.createElement("span");
      hex.className = "hex-display";
      hex.innerText = color;

      stripe.appendChild(hex);
      colorsDiv.appendChild(stripe);
    });

    const infoDiv = document.createElement("div");
    infoDiv.className = "tone-header";
    infoDiv.innerHTML = `
                    <div class="tone-title">${tone.name}</div>
                    <div class="tone-vibe">${tone.vibe}</div>
                `;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "tone-actions";

    const copyBtn = document.createElement("button");
    copyBtn.className = "btn btn-copy";
    copyBtn.innerHTML = `<i class="fa-solid fa-code"></i> Copy CSS`;
    copyBtn.onclick = () => {
      const css = `:root {\n  --background: ${tone.colors.background};\n  --color: ${tone.colors.color};\n  --theme: ${tone.colors.theme};\n  --accent: ${tone.colors.accent};\n}`;
      navigator.clipboard.writeText(css);
      copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
      setTimeout(
        () => (copyBtn.innerHTML = `<i class="fa-solid fa-code"></i> Copy CSS`),
        1500
      );
    };

    const demoLink = document.name
      ? tone.name.replace(/\s+/g, "").toLowerCase()
      : "";
    const demoBtn = document.createElement("button");
    demoBtn.className = "btn btn-demo";
    demoBtn.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i>`;
    demoBtn.onclick = () => {
      window.location.href = `demo/index.html?data=${tone.name.replace(/\s+/g, "").toLowerCase()}`;
    };

    actionsDiv.append(copyBtn, demoBtn);
    card.append(colorsDiv, infoDiv, actionsDiv);
    tonesContainer.appendChild(card);
  });
}

function renderVibes() {
  const vibes = ["All", ...new Set(allTones.map((t) => t.vibe))];
  vibes.forEach((vibe) => {
    const tag = document.createElement("div");
    tag.className = `vibe-tag ${vibe === "All" ? "active" : ""}`;
    tag.innerText = vibe;
    tag.onclick = () => {
      document
        .querySelectorAll(".vibe-tag")
        .forEach((t) => t.classList.remove("active"));
      tag.classList.add("active");
      currentList =
        vibe === "All" ? allTones : allTones.filter((t) => t.vibe === vibe);
      currentIndex = 0;
      tonesContainer.innerHTML = "";
      loadMoreTones();
    };
    vibesContainer.appendChild(tag);
  });
}

document.getElementById("logo").onclick = () => window.location.reload();
