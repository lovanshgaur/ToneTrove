console.log('Developed and Designed by Lovesh Gaur');

const urlParams = new URLSearchParams(window.location.search);
const paletteQuery = urlParams.get("data")?.trim().replace(/\s+/g, '').toLowerCase() || null;

const colorPalettes = {};
let load = document.getElementById("load");
let paletteContainer = document.querySelector(".palette-container");
let infoContainer = document.querySelector(".info-container");
let infoContent = document.querySelector(".info-content");
let infoLogo = document.getElementById("paletteName");
let infoText = document.getElementById("paletteDescription");
let infoBtn = document.getElementById("load");
let copyBtn = document.getElementById("copy");
let svgContainer = document.getElementById("svg-container");

fetch("../assets/data.json")
    .then((response) => response.json())
    .then((data) => {
        colorPalettes.colorPalettes = data.colorPalettes;
        console.log(data);

        if (paletteQuery) {
            renderPaletteByName(paletteQuery);
        } else {
            fetchRandomPalette();
        }
    })
    .catch((error) => console.error("Error fetching data:", error));

load.addEventListener("click", () => {
    const link = `../index.html`;
    window.location.href = link;
});

function renderPaletteByName(paletteName) {
    const match = colorPalettes.colorPalettes.find(
        (p) => p.paletteName.trim().replace(/\s+/g, '').toLowerCase() === paletteName
    );

    if (!match) {
        console.warn(`Palette not found: ${paletteName}`);
        return;
    }

    const paletteColors = match.colors;

    elementColor(paletteColors);
    createSvg(paletteColors);

    copyBtn.addEventListener("click", () => copyColor(paletteColors));

    infoContainer.style.backgroundColor = paletteColors[1];

    infoLogo.textContent = match.paletteName;
    infoLogo.style.color = paletteColors[2];
    infoLogo.style.textShadow = `0 0 1px ${paletteColors[3]}`;

    infoText.textContent = paletteColors.join(", ");
    infoText.style.color = isColorDark(paletteColors[0]) ? "white" : "black";
    infoText.style.textShadow = `0 0 1px ${paletteColors[3]}`;

    infoBtn.style.backgroundColor = paletteColors[0];
    infoBtn.style.color = isColorDark(paletteColors[0]) ? "white" : "black";

    copyBtn.style.backgroundColor = paletteColors[1];
    copyBtn.style.color = isColorDark(paletteColors[1]) ? "white" : "black";

    paletteContainer.innerHTML = "";

    paletteColors.forEach((color, index) => {
        let transition = document.querySelectorAll(".transition");

        let paletteDiv = document.createElement("div");
        paletteDiv.classList.add("palette");
        paletteDiv.style.backgroundColor = color;
        paletteContainer.appendChild(paletteDiv);

        let colorNameDiv = document.createElement("div");
        colorNameDiv.classList.add("color-text");
        colorNameDiv.textContent = color;
        colorNameDiv.style.color = isColorDark(color) ? "white" : "black";
        paletteDiv.appendChild(colorNameDiv);

        gsap.fromTo(
            paletteDiv,
            { opacity: 0, x: 100 },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                delay: index * 0.2,
                onComplete: () => {
                    transition.forEach((t, i) => {
                        t.dataset.index = i + 1;
                        t.style.backgroundColor = paletteColors[i % 4];
                    });
                },
            }
        );
    });
}

function createSvg(colors) {
    if (colors.length < 4) {
        console.error("Please provide an array of at least 4 colors.");
        return;
    }

    const [color1, color2, color3, color4] = colors;

    let svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <polygon points="160,10 350,140 210,289 50,300"
        style="fill: ${color1}; stroke: ${color4}; stroke-width: 2;" />
      <rect x="50" y="150" width="90" height="90"
        style="fill: ${color1}; stroke: ${color4}; stroke-width: 3;" />
      <circle cx="250" cy="100" r="60"
        stroke="${color4}" stroke-width="3" fill="${color2}" fill-opacity="0.6" />
      <ellipse cx="140" cy="310" rx="90" ry="20"
        style="fill: ${color4};" />
      <ellipse cx="120" cy="280" rx="110" ry="20"
        style="fill: ${color1}; fill-opacity: 0.5;" />
      <polyline points="220,200 240,180 260,200 280,180 300,200 320,180 340,200"
        style="fill: none; stroke: ${color2}; stroke-width: 6;" />
    </svg>`;
    svgContainer.innerHTML = svg;
}

function isColorDark(color) {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 128;
}

function elementColor(colors) {
    const elements = document.querySelectorAll(".element");
    const container = document.querySelector(".elements-container");

    const clipPaths = [
        "circle(50% at 50% 50%)",
        "polygon(50% 0%, 0% 100%, 100% 100%)",
        "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        "polygon(50% 0%, 0% 100%, 100% 100%)",
    ];

    const numElements = 5;

    for (let i = 0; i < numElements; i++) {
        const element = elements[i % elements.length];
        const width = Math.floor(Math.random() * 1) + 50;
        const height = Math.floor(Math.random() * 1) + 50;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;

        element.style.backgroundColor = colors[i % colors.length];

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        let randomX, randomY;
        let isOverlapping;

        do {
            randomX = Math.floor(Math.random() * (containerWidth - width));
            randomY = Math.floor(Math.random() * (containerHeight - height));
            isOverlapping = false;

            elements.forEach((otherElement) => {
                if (otherElement !== element) {
                    const otherX = parseInt(otherElement.style.left, 10);
                    const otherY = parseInt(otherElement.style.top, 10);
                    const otherWidth = otherElement.clientWidth;
                    const otherHeight = otherElement.clientHeight;

                    if (
                        randomX < otherX + otherWidth &&
                        randomX + width > otherX &&
                        randomY < otherY + otherHeight &&
                        randomY + height > otherY
                    ) {
                        isOverlapping = true;
                    }
                }
            });
        } while (isOverlapping);

        element.style.position = "absolute";
        element.style.left = `${randomX}px`;
        element.style.top = `${randomY}px`;
        element.style.display = "none";

        const borderRadius = Math.floor(Math.random() * 50);
        element.style.borderRadius = `${borderRadius}%`;

        element.style.clipPath = clipPaths[i % clipPaths.length];
    }
}

function copyColor(colors) {
    const [color1, color2, color3, color4] = colors;

    navigator.clipboard.writeText(`
  :root {
    --background: ${color1};
    --text: ${color2};
    --accent: ${color3};
    --theme: ${color4};
  }
  `);

    let comment = document.getElementById("comment");
    comment.style.opacity = 1;
    comment.textContent = "Copied!";
    setTimeout(() => {
        comment.style.opacity = 0;
    }, 1500);
}
