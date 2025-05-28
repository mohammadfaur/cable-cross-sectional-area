// Store the last calculated voltage drop values
let lastVoltageDropValues = null

// Initialize the global namespace
window.CableApp = window.CableApp || {}

function calculateVoltageDrop() {
  // Get input values
  const phaseType = document.querySelector('input[name="phase-type"]:checked').value
  const ib = Number.parseFloat(document.getElementById("load-current").value)
  const l = Number.parseFloat(document.getElementById("distance").value)
  const n = Number.parseInt(document.getElementById("num-conductors").value) || 1
  const r = Number.parseFloat(document.getElementById("vd-r-value").value)
  const x = Number.parseFloat(document.getElementById("vd-x-value").value)

  // Get phase angle and power factor inputs
  const phaseAngleInput = document.getElementById("phase-angle").value
  const powerFactorInput = document.getElementById("power-factor").value

  let alpha = 0
  let angleSource = ""
  let powerFactorUsed = null

  // Logic: Phase angle takes priority, then PF, then error
  if (phaseAngleInput && !isNaN(Number.parseFloat(phaseAngleInput))) {
    // Use phase angle directly
    const phaseAngleDeg = Number.parseFloat(phaseAngleInput)

    // Validate phase angle range: 0 <= Phase Angle <= 360
    if (phaseAngleDeg < 0 || phaseAngleDeg > 360) {
      setTimeout(() => {
        const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
        const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
        const message =
          translations && translations[currentLang]
            ? translations[currentLang].invalidPhaseAngleRange
            : "זווית פאזה חייבת להיות בין 0 ל-360 מעלות"
        alert(message)
      }, 100)
      return
    }

    alpha = phaseAngleDeg * (Math.PI / 180) // Convert degrees to radians
    angleSource = "direct"
  } else if (powerFactorInput && !isNaN(Number.parseFloat(powerFactorInput))) {
    // Use power factor to calculate phase angle
    const pf = Number.parseFloat(powerFactorInput)

    // Validate PF range: -1 <= PF <= 1
    if (pf < -1 || pf > 1) {
      setTimeout(() => {
        const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
        const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
        const message =
          translations && translations[currentLang]
            ? translations[currentLang].invalidPowerFactor
            : "ערך Power Factor חייב להיות בין -1 ל-1"
        alert(message)
      }, 100)
      return
    }

    alpha = Math.acos(Math.abs(pf)) // α = cos^-1(|PF|)
    angleSource = "power-factor"
    powerFactorUsed = pf
  } else {
    // Neither input provided
    setTimeout(() => {
      const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
      const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
      const message =
        translations && translations[currentLang]
          ? translations[currentLang].enterAngleValue
          : "אנא הזן ערך Power Factor או זווית פאזה"
      alert(message)
    }, 100)
    return
  }

  setTimeout(() => {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

    // Validate other inputs
    if (isNaN(ib) || isNaN(l) || isNaN(n) || isNaN(r) || isNaN(x) || n <= 0 || ib < 0 || l < 0) {
      const message =
        translations && translations[currentLang]
          ? translations[currentLang].enterValidVD
          : "אנא הזן מספרים תקינים עבור כל השדות"
      alert(message)
      return
    }

    // Calculate k factor
    const k = phaseType === "single" ? 2 : Math.sqrt(3)

    // Calculate voltage drop using the formula: ∆V = k * Ib * (L/n) * (r*cos(α) + x*sin(α))
    const cosAlpha = Math.cos(alpha)
    const sinAlpha = Math.sin(alpha)
    const impedanceComponent = r * cosAlpha + x * sinAlpha
    const voltageDrop = k * ib * (l / n) * impedanceComponent

    // Store the calculated values for language switching
    lastVoltageDropValues = {
      voltageDrop,
      k,
      ib,
      l,
      n,
      r,
      x,
      alpha: alpha * (180 / Math.PI), // Convert back to degrees for display
      cosAlpha,
      sinAlpha,
      impedanceComponent,
      phaseType,
      angleSource,
      powerFactor: powerFactorUsed,
    }

    updateVoltageDropResults(lastVoltageDropValues)
  }, 100)
}

function updateVoltageDropResults(values) {
  const voltageDropOutput = document.getElementById("voltage-drop-output")
  if (!voltageDropOutput) {
    return
  }

  const { voltageDrop } = values
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Create simplified results table showing only voltage drop
  let tableHTML = ""

  if (translations && translations[currentLang]) {
    tableHTML = `
      <table class="voltage-drop-table">
        <thead>
          <tr>
            <th colspan="2">${translations[currentLang].voltageDropResults}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${translations[currentLang].voltageDrop}</strong></td>
            <td class="ltr-content">${voltageDrop.toFixed(3)} V</td>
          </tr>
        </tbody>
      </table>
    `
  } else {
    // Hebrew fallback
    tableHTML = `
      <table class="voltage-drop-table">
        <thead>
          <tr>
            <th colspan="2">תוצאות מפל מתח</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>מפל מתח (∆V)</strong></td>
            <td class="ltr-content">${voltageDrop.toFixed(3)} V</td>
          </tr>
        </tbody>
      </table>
    `
  }

  voltageDropOutput.innerHTML = tableHTML
}

function copyVDRValue() {
  const rInput = document.getElementById("vd-r-value")
  const lastFoundR = window.CableApp.lastFoundR ? window.CableApp.lastFoundR() : null

  if (lastFoundR !== null) {
    rInput.value = lastFoundR
    highlightVDInput(rInput)
  } else {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
    const message =
      translations && translations[currentLang] ? translations[currentLang].findFirst : "אנא מצא ערכי r ו-x תחילה"
    alert(message)
  }
}

function copyVDXValue() {
  const xInput = document.getElementById("vd-x-value")
  const lastFoundX = window.CableApp.lastFoundX ? window.CableApp.lastFoundX() : null

  if (lastFoundX !== null) {
    xInput.value = lastFoundX
    highlightVDInput(xInput)
  } else {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
    const message =
      translations && translations[currentLang] ? translations[currentLang].findFirst : "אנא מצא ערכי r ו-x תחילה"
    alert(message)
  }
}

function highlightVDInput(inputElement) {
  inputElement.classList.add("highlight-input")
  setTimeout(() => {
    inputElement.classList.remove("highlight-input")
  }, 1000)
}

// Expose functions to global scope
window.CableApp.calculateVoltageDrop = calculateVoltageDrop
window.CableApp.updateVoltageDropResults = updateVoltageDropResults
window.CableApp.lastVoltageDropValues = () => lastVoltageDropValues
window.CableApp.copyVDRValue = copyVDRValue
window.CableApp.copyVDXValue = copyVDXValue

// Make functions available globally for HTML onclick handlers
window.calculateVoltageDrop = calculateVoltageDrop
window.copyVDRValue = copyVDRValue
window.copyVDXValue = copyVDXValue

console.log("Voltage drop module loaded successfully!")
