let palettes = [];

const container = document.getElementById('container');
const tones = document.getElementById('tones');

fetch("assets/data.json")
  .then(response => response.json())
  .then(data => {
    palettes = data.tones;
    toner(palettes);
  })
  .catch(error => console.error("Error fetching data:", error));

function clearPalettes() {
  tones.innerHTML = '';
}

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

document.querySelectorAll('.vibe-tag').forEach(tag => {
  const vibeName = tag.textContent
    .trim()
    .split(' ')
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

  tag.addEventListener('click', () => {
    const vibe = tag.textContent.trim();
    const filtered = filterPalettesByVibe(palettes, vibe);
    clearPalettes();
    toner(filtered);

    container.className = '';
    // container.classList.add(vibeName);
  });
});

function filterPalettesByVibe(palettes, selectedVibe) {
  if (!Array.isArray(palettes) || !selectedVibe) return [];
  return palettes.filter(palette => palette.vibe === selectedVibe);
}

function toner(colors) {
  colors.forEach(data => {
    const card = document.createElement('div');
    card.className = 'card';

    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 20px 50px -12px ${data.colors.theme}40, 0 0 0 1px rgba(0,0,0,0.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.boxShadow =
        '0 0 0 1px rgba(0,0,0,0.04), 0 20px 40px -10px rgba(0,0,0,0.05)';
    });

    const frame = document.createElement('div');
    frame.className = 'palette-frame';

    const texture = document.createElement('div');
    texture.className = 'texture-overlay';
    frame.appendChild(texture);

    const colorKeys = Object.keys(data.colors);

    colorKeys.forEach(key => {
      const hex = data.colors[key];
      const band = document.createElement('div');
      band.className = 'color-band';
      band.style.backgroundColor = hex;

      const textColor = getContrastColor(hex);

      band.innerHTML = `
        <span class="name-display" style="color:${textColor}">${key}</span>
        <span class="hex-display" style="color:${textColor}">${hex}</span>
      `;

      band.addEventListener('mouseenter', () => {
        document.body.style.backgroundColor = hexToRgba(hex, 0.15);
      });

      band.addEventListener('mouseleave', () => {
        document.body.style.backgroundColor = 'var(--default-bg)';
      });

      band.addEventListener('click', e => {
        e.stopPropagation();
        navigator.clipboard.writeText(hex);
        const originalBg = band.style.backgroundColor;
        band.style.backgroundColor =
          textColor === '#ffffff' ? '#ffffff' : '#000000';
        setTimeout(() => {
          band.style.backgroundColor = originalBg;
        }, 150);
      });

      frame.appendChild(band);
    });

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    footer.innerHTML = `
      <div class="meta-row">
        <div>
          <h2 class="palette-title">${data.name}</h2>
          <span style="color:var(--text-muted); font-size:0.9rem; font-weight:500;">
            UI Kit Series
          </span>
        </div>
        <div class="rating-badge">
          <i data-lucide="star" class="star-fill"></i>
          <span>${data.rating}</span>
        </div>
      </div>
    `;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-primary';
    copyBtn.style.backgroundColor = data.colors.theme;
    copyBtn.style.color = getContrastColor(data.colors.theme);

    copyBtn.innerHTML = `
      <div class="btn-content">
        <i data-lucide="code-2" width="18"></i>
        <span>Copy CSS Variables</span>
      </div>
      <div class="btn-success">
        <i data-lucide="check" width="18"></i>
        <span>Copied!</span>
      </div>
    `;

    copyBtn.addEventListener('click', () => {
      const css = `:root {\n${colorKeys
        .map(k => `  --${k}: ${data.colors[k]};`)
        .join('\n')}\n}`;

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

    const demoBtn = document.createElement('button');
    demoBtn.className = 'btn btn-icon-only';
    demoBtn.innerHTML = `<i data-lucide="layout" width="20"></i>`;

    actions.appendChild(copyBtn);
    actions.appendChild(demoBtn);
    footer.appendChild(actions);

    card.appendChild(frame);
    card.appendChild(footer);
    tones.appendChild(card);
  });
}

lucide.createIcons();
