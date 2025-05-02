const data = {
  copper: {
    single: {
      1.5: [14.8, 0.168],
      2.5: [8.91, 0.156],
      4: [5.57, 0.143],
      6: [3.71, 0.135],
      10: [2.24, 0.119],
      16: [1.41, 0.112],
      25: [0.889, 0.106],
      35: [0.641, 0.101],
      50: [0.473, 0.101],
      70: [0.328, 0.0965],
      95: [0.236, 0.0975],
      120: [0.188, 0.0939],
      150: [0.153, 0.0928],
      185: [0.123, 0.0908],
      240: [0.0943, 0.0902],
      300: [0.0761, 0.0895],
    },
    multi: {
      1.5: [15.1, 0.118],
      2.5: [9.08, 0.109],
      4: [5.68, 0.101],
      6: [3.78, 0.0955],
      10: [2.27, 0.0861],
      16: [1.43, 0.0817],
      25: [0.907, 0.0813],
      35: [0.654, 0.0783],
      50: [0.483, 0.0779],
      70: [0.334, 0.0751],
      95: [0.241, 0.0762],
      120: [0.191, 0.074],
      150: [0.157, 0.0745],
      185: [0.125, 0.0742],
      240: [0.0966, 0.0752],
      300: [0.078, 0.075],
    },
  },
  aluminium: {
    single: {
      1.5: [24.384, 0.168],
      2.5: [14.68, 0.156],
      4: [9.177, 0.143],
      6: [6.112, 0.135],
      10: [3.691, 0.119],
      16: [2.323, 0.112],
      25: [1.465, 0.106],
      35: [1.056, 0.101],
      50: [0.779, 0.101],
      70: [0.54, 0.0965],
      95: [0.389, 0.0975],
      120: [0.31, 0.0939],
      150: [0.252, 0.0928],
      185: [0.203, 0.0908],
      240: [0.155, 0.0902],
      300: [0.125, 0.0895],
    },
    multi: {
      1.5: [24.878, 0.118],
      2.5: [14.96, 0.109],
      4: [9.358, 0.101],
      6: [6.228, 0.0955],
      10: [3.74, 0.0861],
      16: [2.356, 0.0817],
      25: [1.494, 0.0813],
      35: [1.077, 0.0783],
      50: [0.796, 0.0779],
      70: [0.55, 0.0751],
      95: [0.397, 0.0762],
      120: [0.315, 0.074],
      150: [0.259, 0.0745],
      185: [0.206, 0.0742],
      240: [0.159, 0.0752],
      300: [0.129, 0.075],
    },
  },
}

// Store the last found r and x values
let lastFoundR = null
let lastFoundX = null

// Store the last calculated impedance values
let lastCalculatedValues = null

// Language translations
const translations = {
  he: {
    appTitle: "מחשבון התנגדות והיגב כבלים",
    materialLabel: "חומר:",
    copper: "נחושת",
    aluminium: "אלומיניום",
    coreLabel: "סוג ליבה:",
    single: "חד-גידי",
    multi: "רב-גידי",
    areaLabel: "שטח חתך (A) [mm²]:",
    areaPlaceholder: "הזן או בחר שטח חתך",
    findBtn: "קבל r ו-x",
    calcTitle: "חישוב עכבת כבל",
    impedanceLegend: "Z # עכבה [Ω]",
    lengthLegend: "L # אורך כבל [km]",
    resistanceLegend: "r # התנגדות [Ω/km]",
    reactanceLegend: "x # היגב [Ω/km]",
    rValueLabel: "התנגדות (r) [Ω/km]:",
    rValuePlaceholder: "הזן ערך r",
    xValueLabel: "היגב (x) [Ω/km]:",
    xValuePlaceholder: "הזן ערך x",
    cableLengthLabel: "אורך כבל (L) [km]:",
    cableLengthPlaceholder: "הזן אורך כבל",
    copyBtn: "העתק מלמעלה",
    calcBtn: "חשב עכבה",
    noDataFound: "לא נמצאו נתונים עבור A = {0} mm²",
    resistance: "התנגדות (r):",
    reactance: "היגב (x):",
    format: "פורמט",
    ohms: "אוהם (Ω)",
    milliohms: "מיליאוהם (mΩ)",
    cartesian: "קרטזי",
    polar: "פולארי",
    findFirst: "אנא מצא ערכי r ו-x תחילה",
    enterValid: "אנא הזן מספרים תקינים עבור r, x ואורך כבל",
  },
  en: {
    appTitle: "Cable Resistance & Reactance Finder",
    materialLabel: "Material:",
    copper: "Copper",
    aluminium: "Aluminium",
    coreLabel: "Core Type:",
    single: "Single-core",
    multi: "Multi-core",
    areaLabel: "Cross-sectional area (A) [mm²]:",
    areaPlaceholder: "Enter or select cross-sectional area",
    findBtn: "Get r and x",
    calcTitle: "Calculate Cable Impedance",
    impedanceLegend: "Z # Impedance [Ω]",
    lengthLegend: "L # Cable length [km]",
    resistanceLegend: "r # Resistance [Ω/km]",
    reactanceLegend: "x # Reactance [Ω/km]",
    rValueLabel: "Resistance (r) [Ω/km]:",
    rValuePlaceholder: "Enter r value",
    xValueLabel: "Reactance (x) [Ω/km]:",
    xValuePlaceholder: "Enter x value",
    cableLengthLabel: "Cable Length (L) [km]:",
    cableLengthPlaceholder: "Enter cable length",
    copyBtn: "Copy from above",
    calcBtn: "Calculate Impedance",
    noDataFound: "No data found for A = {0} mm²",
    resistance: "Resistance (r):",
    reactance: "Reactance (x):",
    format: "Format",
    ohms: "Ohms (Ω)",
    milliohms: "Milliohms (mΩ)",
    cartesian: "Cartesian",
    polar: "Polar",
    findFirst: "Please find r and x values first",
    enterValid: "Please enter valid numbers for r, x, and cable length",
  },
}

// Current language
let currentLang = "he" // Default to Hebrew

// Theme toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeSwitch = document.getElementById("theme-switch")
  const langToggle = document.getElementById("lang-toggle")

  // Set initial state based on HTML class
  themeSwitch.checked = document.documentElement.classList.contains("light-mode")

  themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
      document.documentElement.classList.remove("dark-mode")
      document.documentElement.classList.add("light-mode")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.remove("light-mode")
      document.documentElement.classList.add("dark-mode")
      localStorage.setItem("theme", "dark")
    }
  })

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark-mode")
      document.documentElement.classList.add("light-mode")
      themeSwitch.checked = true
    } else {
      document.documentElement.classList.remove("light-mode")
      document.documentElement.classList.add("dark-mode")
      themeSwitch.checked = false
    }
  }

  // Language toggle functionality
  langToggle.addEventListener("click", () => {
    toggleLanguage()
  })

  // Check for saved language preference
  const savedLang = localStorage.getItem("lang")
  if (savedLang) {
    currentLang = savedLang
    updateLanguage()
  } else {
    // Default to Hebrew if no preference is saved
    currentLang = "he"
    updateLanguage()
  }
})

function toggleLanguage() {
  currentLang = currentLang === "he" ? "en" : "he"
  localStorage.setItem("lang", currentLang)
  updateLanguage()
}

function updateLanguage() {
  const isHebrew = currentLang === "he"

  // Update HTML direction
  if (isHebrew) {
    document.documentElement.classList.add("rtl")
    document.documentElement.classList.remove("ltr")
    document.documentElement.setAttribute("lang", "he")
  } else {
    document.documentElement.classList.add("ltr")
    document.documentElement.classList.remove("rtl")
    document.documentElement.setAttribute("lang", "en")
  }

  // Update toggle button text
  const langToggle = document.getElementById("lang-toggle")
  langToggle.textContent = isHebrew ? "EN" : "עב"

  // Update all text elements
  document.getElementById("app-title").textContent = translations[currentLang].appTitle
  document.getElementById("material-label").textContent = translations[currentLang].materialLabel
  document.getElementById("copper-label").textContent = translations[currentLang].copper
  document.getElementById("aluminium-label").textContent = translations[currentLang].aluminium
  document.getElementById("core-label").textContent = translations[currentLang].coreLabel
  document.getElementById("single-label").textContent = translations[currentLang].single
  document.getElementById("multi-label").textContent = translations[currentLang].multi
  document.getElementById("area-label").textContent = translations[currentLang].areaLabel
  document.getElementById("surface").placeholder = translations[currentLang].areaPlaceholder
  document.getElementById("find-btn").textContent = translations[currentLang].findBtn
  document.getElementById("calc-title").textContent = translations[currentLang].calcTitle
  document.getElementById("impedance-legend").textContent = translations[currentLang].impedanceLegend
  document.getElementById("length-legend").textContent = translations[currentLang].lengthLegend
  document.getElementById("resistance-legend").textContent = translations[currentLang].resistanceLegend
  document.getElementById("reactance-legend").textContent = translations[currentLang].reactanceLegend
  document.getElementById("r-value-label").textContent = translations[currentLang].rValueLabel
  document.getElementById("r-value").placeholder = translations[currentLang].rValuePlaceholder
  document.getElementById("x-value-label").textContent = translations[currentLang].xValueLabel
  document.getElementById("x-value").placeholder = translations[currentLang].xValuePlaceholder
  document.getElementById("cable-length-label").textContent = translations[currentLang].cableLengthLabel
  document.getElementById("cable-length").placeholder = translations[currentLang].cableLengthPlaceholder
  document.getElementById("copy-r-btn").textContent = translations[currentLang].copyBtn
  document.getElementById("copy-x-btn").textContent = translations[currentLang].copyBtn
  document.getElementById("calc-btn").textContent = translations[currentLang].calcBtn

  // Update document title
  document.title = isHebrew ? "מחשבון כבלים" : "Cable Calculator"

  // If there are results displayed, update them
  if (lastFoundR !== null && lastFoundX !== null) {
    updateResults()
  }

  // If there's an impedance table, update it
  const impedanceOutput = document.getElementById("impedance-output")
  if (impedanceOutput.innerHTML.trim() !== "" && lastCalculatedValues) {
    updateImpedanceTable(lastCalculatedValues)
  }
}

function findRX() {
  const material = document.querySelector('input[name="material"]:checked').value
  const core = document.querySelector('input[name="core"]:checked').value
  const s = document.getElementById("surface").value
  const result = data[material][core][s]

  const output = document.getElementById("output")
  if (result) {
    lastFoundR = result[0]
    lastFoundX = result[1]
    updateResults()
  } else {
    lastFoundR = null
    lastFoundX = null
    output.innerHTML = translations[currentLang].noDataFound.replace("{0}", s)
  }
}

function updateResults() {
  const output = document.getElementById("output")
  const isHebrew = currentLang === "he"

  if (isHebrew) {
    output.innerHTML = `<div class="result-content"><strong>${translations[currentLang].resistance}</strong> ${lastFoundR} Ω/km<br><strong>${translations[currentLang].reactance}</strong> ${lastFoundX} Ω/km</div>`
  } else {
    output.innerHTML = `<div class="ltr-content"><strong>${translations[currentLang].resistance}</strong> ${lastFoundR} Ω/km<br><strong>${translations[currentLang].reactance}</strong> ${lastFoundX} Ω/km</div>`
  }
}

function copyRValue() {
  const rInput = document.getElementById("r-value")
  if (lastFoundR !== null) {
    rInput.value = lastFoundR
    highlightInput(rInput)
  } else {
    alert(translations[currentLang].findFirst)
  }
}

function copyXValue() {
  const xInput = document.getElementById("x-value")
  if (lastFoundX !== null) {
    xInput.value = lastFoundX
    highlightInput(xInput)
  } else {
    alert(translations[currentLang].findFirst)
  }
}

function highlightInput(inputElement) {
  inputElement.classList.add("highlight-input")
  setTimeout(() => {
    inputElement.classList.remove("highlight-input")
  }, 1000)
}

function calculateImpedance() {
  const r = Number.parseFloat(document.getElementById("r-value").value)
  const x = Number.parseFloat(document.getElementById("x-value").value)
  const length = Number.parseFloat(document.getElementById("cable-length").value)

  if (isNaN(r) || isNaN(x) || isNaN(length)) {
    alert(translations[currentLang].enterValid)
    return
  }

  // Calculate impedance using the formula Z = L * (r + jx)
  const realPart = length * r
  const imagPart = length * x

  // Calculate magnitude and angle
  const magnitude = Math.sqrt(realPart * realPart + imagPart * imagPart)
  const angleRad = Math.atan2(imagPart, realPart)
  const angleDeg = angleRad * (180 / Math.PI)

  // Convert to milliohms
  const realPartMilliohm = realPart * 1000
  const imagPartMilliohm = imagPart * 1000
  const magnitudeMilliohm = magnitude * 1000

  // Store the calculated values for language switching
  lastCalculatedValues = {
    realPart,
    imagPart,
    magnitude,
    angleDeg,
    realPartMilliohm,
    imagPartMilliohm,
    magnitudeMilliohm,
  }

  updateImpedanceTable(lastCalculatedValues)
}

function updateImpedanceTable(values) {
  const { realPart, imagPart, magnitude, angleDeg, realPartMilliohm, imagPartMilliohm, magnitudeMilliohm } = values
  const impedanceOutput = document.getElementById("impedance-output")

  // Format cartesian form
  let cartesianOhm = ""
  let cartesianMilliohm = ""

  if (realPart === 0 && imagPart === 0) {
    cartesianOhm = "0"
    cartesianMilliohm = "0"
  } else if (imagPart === 0) {
    cartesianOhm = `${realPart.toFixed(4)}`
    cartesianMilliohm = `${realPartMilliohm.toFixed(2)}`
  } else if (realPart === 0) {
    cartesianOhm = `j${imagPart.toFixed(4)}`
    cartesianMilliohm = `j${imagPartMilliohm.toFixed(2)}`
  } else {
    cartesianOhm = `${realPart.toFixed(4)} + j${imagPart.toFixed(4)}`
    cartesianMilliohm = `${realPartMilliohm.toFixed(2)} + j${imagPartMilliohm.toFixed(2)}`
  }

  // Format polar form
  const polarOhm = `${magnitude.toFixed(4)} ∠ ${angleDeg.toFixed(2)}°`
  const polarMilliohm = `${magnitudeMilliohm.toFixed(2)} ∠ ${angleDeg.toFixed(2)}°`

  // Create table output with proper language and LTR formatting
  const tableHTML = `
    <table class="impedance-table">
      <thead>
        <tr>
          <th>${translations[currentLang].format}</th>
          <th>${translations[currentLang].ohms}</th>
          <th>${translations[currentLang].milliohms}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${translations[currentLang].cartesian}</strong></td>
          <td class="ltr-content">${cartesianOhm} Ω</td>
          <td class="ltr-content">${cartesianMilliohm} mΩ</td>
        </tr>
        <tr>
          <td><strong>${translations[currentLang].polar}</strong></td>
          <td class="ltr-content">${polarOhm} Ω</td>
          <td class="ltr-content">${polarMilliohm} mΩ</td>
        </tr>
      </tbody>
    </table>
  `

  impedanceOutput.innerHTML = tableHTML
}
