# 🎨 ToneTrove V3

**ToneTrove** is a premium, minimal web application that provides designers and developers with curated, mathematically-balanced color palettes. 

With a focus on clean UI and functional previews, ToneTrove doesn't just show you colors—it lets you visualize exactly how they will perform on a real website.

## ✨ Features

- **Premium & Minimal UI:** Built with smooth CSS-grid layouts, glassmorphism navbars, and elegant micro-interactions (like expanding color pillars).
- **Realistic UI Preview (Demo Mode):** Test any palette inside a mock SaaS dashboard layout. See how your background, text, theme, and accent colors interact in real-time.
- **One-Click CSS Copy:** Instantly copy the CSS `:root` variables for any palette to paste directly into your project.
- **Smart Filtering:** Browse palettes by "Vibes" (e.g., Minimal, Cyberpunk, Earthy, Luxury, Retro).
- **Auto-Contrast Calculation:** The text on top of color swatches automatically calculates whether it should be black or white for optimal readability based on color luminance.
- **Zero Dependencies:** Built entirely with Vanilla HTML, CSS, and JavaScript. No heavy frameworks or build tools required.

## 🛠 Tech Stack

- **HTML5** (Semantic structure)
- **CSS3** (CSS Variables, Grid, Flexbox, Glassmorphism, Responsive Design)
- **Vanilla JavaScript** (DOM manipulation, Fetch API, Intersection Observer for infinite scrolling/lazy rendering)
- **Fonts:** [Google Fonts (Funnel Display & Funnel Sans)](https://fonts.google.com/)
- **Icons:** FontAwesome

## 📂 Project Structure

```text
/
├── index.html          # Main gallery and filtering page
├── style.css           # Styling for the main gallery
├── html/
│   └── demo.html       # Realistic mock UI to preview palettes
├── assets/
│   └── data.json       # JSON file containing all color palette data
```

## 🚀 Getting Started

Since ToneTrove is built with static web technologies, getting started is incredibly simple:

1. **Clone or Download** the repository to your local machine.
2. Ensure all files (`index.html`, `html/demo.html`, `assets/data.json`) are in their correct relative directories.
3. Open `index.html` in any modern web browser.
   *(Note: If you run into CORS issues fetching the local `data.json`, simply open the folder using a local development server like VS Code's "Live Server" extension).*

## 📊 Adding New Palettes

Palettes are loaded dynamically from `assets/data.json`. To add a new palette, simply append a new object to the `"tones"` array using the following structure:

```json
{
  "id": "min-quiet-white",
  "name": "Quiet White",
  "colors": {
    "background": "#FFFFFF",
    "color": "#111111",
    "theme": "#F5F5F7",
    "accent": "#E1E1E1"
  },
  "rating": 5,
  "vibe": "Minimal",
  "keywords": ["silence", "pure", "essential", "bright", "airy"]
}
```

### Color Roles Definition:
- **`background`**: The primary background color of the webpage.
- **`color`**: The primary text color (used for paragraphs and headings).
- **`theme`**: The primary brand color (used for main buttons, active states, and dominant icons).
- **`accent`**: The secondary color (used for borders, subtle highlights, badge backgrounds, and secondary buttons).

## 👨‍💻 Author

Designed and Developed by **Lovansh Gaur**.