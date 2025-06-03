# ⚡ Cable Cross-Sectional Area & Impedance Calculators

A modular, responsive, and bilingual web app for electrical engineers and technicians. This tool helps estimate cable resistance (r), reactance (x), voltage drop, impedance under various scenarios (transformer, generator, system), and short-circuit current calculations — all in a clean interface that supports both Hebrew 🇮🇱 and English EN.

---

## 🌍 Live Demo

🔗 [View it on GitHub Pages](https://mohammadfaur.github.io/cable-cross-sectional-area/)

---

## ✨ Features

- 🔎 **Cable Lookup** – get `r` and `x` from known materials and cross-section
- 📐 **Impedance Calculators**:
  - General cable impedance
  - Transformer impedance
  - Generator impedance
  - System impedance
- ⚡ **Voltage Drop & Fault Calculators**:
  - Voltage drop based on load and cable parameters
  - 3-phase short-circuit (Zk3ph) estimation
- 🌗 **Dark/Light mode**
- 🌍 **Language toggle** (RTL Hebrew ↔ LTR English)
- 📱 **Mobile responsive layout**

---

## 🗂 Folder Structure

```
cable-cross-sectional-area/
├── index.html                  # Main app shell
├── script.js                   # Core logic loader
├── styles/                     # Organized CSS files
│   ├── base.css
│   ├── theme.css
│   └── animations.css
├── scripts/
│   ├── fetch_rx.js             # r/x lookup
│   ├── impedance.js            # Generic impedance calculator
│   ├── voltage_drop.js         # Voltage drop estimation
│   ├── zk3ph.js                # 3-phase short-circuit calc
│   ├── three_phase_fault.js    # Related fault logic
│   ├── calculators.js          # Controller for toggling calculators
│   ├── impedances/             # Specialized impedance tools
│   │   ├── cable_impedance_zk3ph.js
│   │   ├── generator_impedance.js
│   │   ├── impedance_reflection.js
│   │   ├── system_impedance.js
│   │   └── transformer_impedance.js
│   ├── localized/
│   │   ├── lang.js             # Language state manager
│   │   └── translate.js        # Translations for labels
│   └── styles/
│       └── theme.js            # Theme toggle logic
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/mohammadfaur/cable-cross-sectional-area.git
cd cable-cross-sectional-area
```

### 2. Open in Browser

No server required — just open `index.html` in your browser.

---

## ⚡ 3-Phase Short-Circuit Calculation (Zk3ph)

To compute the 3-phase short-circuit current at a specific point in the system:

1. **Enter all contributing impedances** that make up the total system impedance $` Z_{total} `$, including cables, transformers, generators, and other components.
2. **Provide individual parameters** required to calculate each impedance (e.g., length, cross-section, etc..).
3. **Combine the impedances**, including support for handling parallel configurations where needed.
4. **Apply impedance reflection** if required — the system allows reflecting any impedance across transformer windings or other boundaries.
5. Finally, the total impedance is used in the formula:
 
   $`
   I_{k3\phi} = \frac{U_n}{\sqrt{3} \cdot Z_{total}}
   `$
   
   to compute the initial symmetrical short-circuit current.

---

## 🧪 Development Notes

- Built entirely with **vanilla JavaScript**
- Easy to extend — every feature lives in its script file
- All language-dependent labels update via `translate.js`

---

## 👨‍💻 Author

Developed by **Me + AI**  
---