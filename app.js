// ================== CONFIG ==================
const BATCH_SIZE = 25;
const LOAD_THRESHOLD = 5;

// ================== STATE ==================
let allTones = [];
let currentList = [];
let currentIndex = 0;

// ================== ELEMENTS ==================
const container = document.getElementById('container');
const background = document.getElementById('background');
const tonesContainer = document.getElementById('tones');
const vibesContainer = document.getElementById('vibes-container');

// ================== HELPERS ==================
function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    return (((r * 299) + (g * 587) + (b * 114)) / 1000) >= 128
        ? '#1e293b'
        : '#ffffff';
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isColorDark(color) {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance < 128;
}


// ================== FETCH + INIT ==================
fetch('assets/data.json')
    .then(res => res.json())
    .then(data => {
        allTones = data.tones;

        for (let i = allTones.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allTones[i], allTones[j]] = [allTones[j], allTones[i]];
        }

        // Initialize current list and start loading batches
        currentList = allTones;
        loadMoreTones();

        vibes(allTones);
        return allTones;
    })
    .catch(err => console.error("Error fetching data:", err));


// ================== LOAD MORE LOGIC ==================
function loadMoreTones() {
    if (currentIndex >= currentList.length) return;

    const nextBatch = currentList.slice(currentIndex, currentIndex + BATCH_SIZE);
    toner(nextBatch);
    currentIndex += nextBatch.length;

    observeTrigger();
}

// ================== INTERSECTION OBSERVER ==================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            loadMoreTones();
        }
    });
}, {
    rootMargin: "0px 0px 200px 0px"
});

function observeTrigger() {
    // Only set observer if there is more data to load
    if (currentIndex >= currentList.length) return;

    const cards = document.querySelectorAll(".tone-card");
    if (cards.length >= LOAD_THRESHOLD) {
        const triggerCard = cards[cards.length - LOAD_THRESHOLD];
        observer.observe(triggerCard);
    }
}

// ================== RENDER ==================
function toner(data) {
    // Array to keep track of new elements for animation
    const newCards = [];

    data.forEach(tone => {
        const toneCard = document.createElement('div');
        toneCard.classList.add('tone-card');
        toneCard.style.background = `linear-gradient(${tone.colors.theme}, ${tone.colors.accent})`;
        toneCard.style.color = tone.colors.color;

        const toneColors = document.createElement('div');
        toneColors.classList.add('tone-colors');

        Object.entries(tone.colors).forEach(([name, color]) => {
            const stripe = document.createElement('div');
            stripe.classList.add('stripe');
            stripe.style.backgroundColor = color;
            stripe.style.color = isColorDark(color) ? "white" : "black";

            const stripeName = document.createElement('span');
            stripeName.classList.add('name-display');
            stripeName.innerText = name;

            const stripeHex = document.createElement('span');
            stripeHex.classList.add('hex-display');
            stripeHex.innerText = color;

            stripe.append(stripeName, stripeHex);
            toneColors.appendChild(stripe);
        });

        const toneInfo = document.createElement('div');
        toneInfo.classList.add('tone-info');

        const toneDetail = document.createElement('div');
        toneDetail.classList.add('tone-detail');

        const toneTitle = document.createElement('div');
        toneTitle.classList.add('tone-title');
        toneTitle.innerText = tone.name;
        toneTitle.style.color = isColorDark(tone.colors.theme) ? "white" : "black";
        toneTitle.style.textShadow = isColorDark(tone.colors.theme) ? "1px 1px 2px black" : "3px 3px 6px rgba(0, 0, 0, 0.16)";

        const toneRating = document.createElement('div');
        toneRating.classList.add('tone-rating', 'btn');
        toneRating.innerText = tone.rating + "🌟";

        toneDetail.append(toneTitle);

        const toneAction = document.createElement('div');
        toneAction.classList.add('tone-action');

        const copyBtn = document.createElement('button');
        copyBtn.classList.add('btn', 'btn-primary');
        copyBtn.style.background = tone.colors.theme;
        copyBtn.style.color = isColorDark(tone.colors.theme) ? "white" : "black";
        // copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Palette`;
        copyBtn.innerHTML = `
         <div class="btn-content">
        <i data-lucide="code-2" width="18"></i>
        <span>Copy Palette</span>
      </div>
      <div class="btn-success">
        <i data-lucide="check" width="18"></i>
        <span>Copied!</span>
      </div>
        `;

        copyBtn.addEventListener('click', () => {
            const css = `:root {
             --background: ${tone.colors.background};
             --color:  ${tone.colors.color} ;
             --theme:  ${tone.colors.theme} ;
             --accent:  ${tone.colors.accent} ;
        }`;

            navigator.clipboard.writeText(css).then(() => {
                copyBtn.classList.add('copied');
                const oldBg = copyBtn.style.backgroundColor;
                copyBtn.style.backgroundColor = '#22C55E';
                copyBtn.style.color = '#fff';

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.style.backgroundColor = oldBg;
                    copyBtn.style.color = getContrastColor(oldBg);
                }, 2000);
            });
        });

        copyBtn.addEventListener('mouseenter', () => gsap.to(copyBtn, { scale: 1.05, duration: 0.2 }));
        copyBtn.addEventListener('mouseleave', () => gsap.to(copyBtn, { scale: 1, duration: 0.2 }));

        const demoBtn = document.createElement('button');
        demoBtn.classList.add('btn', 'btn-icon');
        demoBtn.style.background = tone.colors.theme;
        demoBtn.style.color = isColorDark(tone.colors.theme) ? "white" : "black";
        demoBtn.innerHTML = `<i class="fa-solid fa-up-right-from-square"></i>`;


        toneAction.append(copyBtn, demoBtn);
        toneInfo.append(toneDetail, toneAction);
        toneCard.append(toneColors, toneInfo);
        tonesContainer.appendChild(toneCard);

        newCards.push(toneCard);
    });

    // GSAP Entrance Animation for new cards
    if (newCards.length > 0) {
        gsap.fromTo(newCards,
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.2)" }
        );
    }
}

function vibes(data) {
    const vibes = [...new Set(data.map(item => item.vibe))];

    vibes.forEach((vibe, index) => {
        const vibeTag = document.createElement('div');
        vibeTag.classList.add('vibe-tag');
        vibeTag.innerText = vibe;

        vibeTag.addEventListener('click', () => {
            gsap.to(vibeTag, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => dataVibe(data, vibe)
            });
        });

        vibeTag.addEventListener('mouseenter', () => gsap.to(vibeTag, { y: -3, duration: 0.2 }));
        vibeTag.addEventListener('mouseleave', () => gsap.to(vibeTag, { y: 0, duration: 0.2 }));

        vibesContainer.appendChild(vibeTag);
    });

    // GSAP Stagger Entrance for Vibe Tags
    gsap.fromTo(".vibe-tag",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
    );
}

function dataVibe(data, vibe) {
    const vibePalette = data.filter(item => item.vibe === vibe);
    console.log(vibe, vibePalette.length);

    // Update state for pagination
    currentList = vibePalette;
    currentIndex = 0;

    // GSAP Exit Animation before clearing
    const currentCards = document.querySelectorAll('.tone-card');

    if (currentCards.length > 0) {
        gsap.to(currentCards, {
            opacity: 0,
            scale: 0.8,
            y: 20,
            duration: 0.3,
            stagger: 0.01,
            ease: "power2.in",
            onComplete: () => {
                tonesContainer.innerHTML = '';
                loadMoreTones(); // Start loading the filtered list
            }
        });
    } else {
        // Fallback if container is empty
        tonesContainer.innerHTML = '';
        loadMoreTones();
    }
}

document.getElementById("logo").addEventListener("click", function () {
    window.location.reload();
});
