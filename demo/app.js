const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("data");

function getContrast(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
}

fetch("../assets/data.json")
  .then((res) => res.json())
  .then((data) => {
    if (query) {
      const match = data.tones.find(
        (t) => t.name.replace(/\s+/g, "").toLowerCase() === query
      );
      if (match) applyColors(match);
    }
  });

function applyColors(palette) {
  document.getElementById("p-name").innerText = palette.name;

  const root = document.documentElement;
  const bg = palette.colors.background;
  const text = palette.colors.color;
  const theme = palette.colors.theme;
  const accent = palette.colors.accent;

  root.style.setProperty("--mock-bg", bg);
  root.style.setProperty("--mock-text", text);
  root.style.setProperty("--mock-theme", theme);
  root.style.setProperty("--mock-accent", accent);
  root.style.setProperty("--mock-btn-text", getContrast(theme));

  const swatchesContainer = document.getElementById("swatches");
  [bg, theme, accent, text].forEach((color) => {
    const div = document.createElement("div");
    div.className = "swatch";
    div.style.backgroundColor = color;
    swatchesContainer.appendChild(div);
  });

  document.getElementById("copyBtn").onclick = function () {
    const css = `:root {\n  --background: ${bg};\n  --color: ${text};\n  --theme: ${theme};\n  --accent: ${accent};\n}`;
    navigator.clipboard.writeText(css);
    this.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
    setTimeout(
      () => (this.innerHTML = `<i class="fa-solid fa-code"></i> Copy CSS`),
      1500
    );
  };
}
