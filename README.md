# ⚡ Cable Resistance & Impedance Calculator

A bilingual web tool for electrical engineers to quickly find the resistance (`r`) and reactance (`x`) of various copper and aluminum cables, and to calculate total impedance using:

\[
Z = \frac{L}{n} \times (r + jx)
\]

Supports **Hebrew** 🇮🇱 and **English** 🇬🇧, **light/dark mode**, and **mobile responsiveness**.

---

## 📦 Features

- 🔎 Lookup resistance (`r`) and reactance (`x`) by:
  - Material: Copper / Aluminium
  - Core type: Single / Multi
  - Cross-sectional area (mm²)

- 🧮 Calculate cable impedance:
  - Custom length (km)
  - Parallel cables (`n`)
  - Results in **Cartesian** & **Polar** form (Ohms & mΩ)

- 🌍 Language toggle: Hebrew ↔ English
- 🌗 Theme toggle: Light / Dark
- 📱 Fully responsive design

---

## 🧰 Tech Stack

- HTML, CSS (custom themed with variables)
- Vanilla JavaScript (modular: `fetch_rx.js`, `impedance.js`, etc.)
- No frameworks, no dependencies

---