// Store the last calculated voltage drop values
let lastVoltageDropValues = null
let multipleVoltageDropValues = []
let isLoopMode = false
let currentLoopIndex = 0
let totalLoopCount = 0

// Initialize the global namespace
window.CableApp = window.CableApp || {}

function calculateVoltageDrop() {
  // If we're already in loop mode, continue with current calculation
  if (isLoopMode) {
    performLoopVoltageDropCalculation()
    return
  }

  const numCalculations = Number.parseInt(document.getElementById("num-calculations").value) || 1

  if (numCalculations === 1) {
    // Normal single calculation
    performSingleVoltageDropCalculation()
  } else if (numCalculations > 1) {
    // Enter loop mode
    startLoopMode(numCalculations)
  }
}

function startLoopMode(numCalculations) {
  isLoopMode = true
  currentLoopIndex = 1
  totalLoopCount = numCalculations
  multipleVoltageDropValues = []

  // Blur background elements (except R&X Finder)
  const blurableElements = document.querySelectorAll(".blurable-content")
  blurableElements.forEach((element) => {
    element.classList.add("blurred")
  })

  // Add body class for loop mode styling
  document.body.classList.add("loop-mode")

  // Show user guidance about R&X Finder availability
  setTimeout(() => {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].rxFinderAvailable
        : "מוצא r ו-x זמין לשימוש במהלך החישובים המרובים"

    // Create a temporary notification
    const notification = document.createElement("div")
    notification.className = "loop-notification"
    notification.textContent = message
    document.body.appendChild(notification)

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)
  }, 500)

  // Show loop controls
  const loopControls = document.getElementById("loop-controls")
  if (loopControls) {
    loopControls.style.display = "block"
    updateLoopProgress()
  }

  // Add escape key listener
  document.addEventListener("keydown", handleEscapeKey)

  // Perform first calculation
  performLoopVoltageDropCalculation()
}

function performLoopVoltageDropCalculation() {
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
    const phaseAngleDeg = Number.parseFloat(phaseAngleInput)
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
    alpha = phaseAngleDeg * (Math.PI / 180)
    angleSource = "direct"
  } else if (powerFactorInput && !isNaN(Number.parseFloat(powerFactorInput))) {
    const pf = Number.parseFloat(powerFactorInput)
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
    alpha = Math.acos(Math.abs(pf))
    angleSource = "power-factor"
    powerFactorUsed = pf
  } else {
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

    // Store the calculated values
    const calculationData = {
      voltageDrop,
      k,
      ib,
      l,
      n,
      r,
      x,
      alpha: alpha * (180 / Math.PI),
      cosAlpha,
      sinAlpha,
      impedanceComponent,
      phaseType,
      angleSource,
      powerFactor: powerFactorUsed,
      index: currentLoopIndex,
    }

    if (isLoopMode) {
      // Store this calculation in the array
      multipleVoltageDropValues.push(calculationData)

      // Show intermediate results after each calculation
      updateIntermediateVoltageDropResults(multipleVoltageDropValues)

      // Check if we need more calculations
      if (currentLoopIndex < totalLoopCount) {
        currentLoopIndex++
        updateLoopProgress()
        // Clear inputs for next calculation (optional)
        clearVoltageDropInputs()
      } else {
        // All calculations done, show final results and exit loop mode
        finishLoopMode()
      }
    } else {
      // Single calculation mode
      lastVoltageDropValues = calculationData
      updateVoltageDropResults(lastVoltageDropValues)
    }
  }, 100)
}

function performSingleVoltageDropCalculation() {
  isLoopMode = false
  performLoopVoltageDropCalculation()
}

function updateLoopProgress() {
  const progressText = document.getElementById("loop-progress-text")
  if (progressText) {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

    if (translations && translations[currentLang]) {
      progressText.textContent = translations[currentLang].loopProgress
        .replace("{current}", currentLoopIndex)
        .replace("{total}", totalLoopCount)
    } else {
      progressText.textContent = `מחשב ∆V${currentLoopIndex} מתוך ${totalLoopCount}`
    }
  }
}

function clearVoltageDropInputs() {
  // Optionally clear some inputs for the next calculation
  // You can customize which inputs to clear
  document.getElementById("load-current").value = ""
  document.getElementById("distance").value = ""
  document.getElementById("power-factor").value = ""
  document.getElementById("phase-angle").value = ""
}

function finishLoopMode() {
  isLoopMode = false

  // Remove blur effect
  const blurableElements = document.querySelectorAll(".blurable-content")
  blurableElements.forEach((element) => {
    element.classList.remove("blurred")
  })

  // Remove body class for loop mode styling
  document.body.classList.remove("loop-mode")

  // Hide loop controls
  const loopControls = document.getElementById("loop-controls")
  if (loopControls) {
    loopControls.style.display = "none"
  }

  // Remove escape key listener
  document.removeEventListener("keydown", handleEscapeKey)

  // Calculate total and display results
  const totalVoltageDrop = multipleVoltageDropValues.reduce((sum, calc) => sum + calc.voltageDrop, 0)

  // Update results display with multiple calculations
  updateMultipleVoltageDropResults(multipleVoltageDropValues, totalVoltageDrop)
}

function cancelLoopMode() {
  isLoopMode = false
  multipleVoltageDropValues = []

  // Remove blur effect
  const blurableElements = document.querySelectorAll(".blurable-content")
  blurableElements.forEach((element) => {
    element.classList.remove("blurred")
  })

  // Remove body class for loop mode styling
  document.body.classList.remove("loop-mode")

  // Hide loop controls
  const loopControls = document.getElementById("loop-controls")
  if (loopControls) {
    loopControls.style.display = "none"
  }

  // Remove escape key listener
  document.removeEventListener("keydown", handleEscapeKey)
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    cancelLoopMode()
  }
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

function updateMultipleVoltageDropResults(calculations, totalVoltageDrop) {
  const voltageDropOutput = document.getElementById("voltage-drop-output")
  if (!voltageDropOutput) {
    return
  }

  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  let tableHTML = ""

  if (translations && translations[currentLang]) {
    tableHTML = `
      <table class="voltage-drop-table">
        <thead>
          <tr>
            <th colspan="2">${translations[currentLang].multipleVoltageDropResults}</th>
          </tr>
        </thead>
        <tbody>
    `

    // Add individual calculations
    calculations.forEach((calc, index) => {
      tableHTML += `
        <tr>
          <td><strong>∆V<sub>${index + 1}</sub></strong></td>
          <td class="ltr-content">${calc.voltageDrop.toFixed(3)} V</td>
        </tr>
      `
    })

    // Add total
    const rangeText = calculations.length > 1 ? `∆V<sub>1→${calculations.length}</sub>` : `∆V<sub>T</sub>`
    tableHTML += `
        <tr class="total-row">
          <td><strong>${rangeText}</strong></td>
          <td class="ltr-content"><strong>${totalVoltageDrop.toFixed(3)} V</strong></td>
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
            <th colspan="2">תוצאות מפל מתח מרובות</th>
          </tr>
        </thead>
        <tbody>
    `

    calculations.forEach((calc, index) => {
      tableHTML += `
        <tr>
          <td><strong>∆V<sub>${index + 1}</sub></strong></td>
          <td class="ltr-content">${calc.voltageDrop.toFixed(3)} V</td>
        </tr>
      `
    })

    const rangeText = calculations.length > 1 ? `∆V<sub>1→${calculations.length}</sub>` : `∆V<sub>T</sub>`
    tableHTML += `
        <tr class="total-row">
          <td><strong>${rangeText}</strong></td>
          <td class="ltr-content"><strong>${totalVoltageDrop.toFixed(3)} V</strong></td>
        </tr>
      </tbody>
    </table>
    `
  }

  voltageDropOutput.innerHTML = tableHTML
}

function updateIntermediateVoltageDropResults(calculations) {
  const voltageDropOutput = document.getElementById("voltage-drop-output")
  if (!voltageDropOutput) {
    return
  }

  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Calculate current total
  const currentTotal = calculations.reduce((sum, calc) => sum + calc.voltageDrop, 0)

  let tableHTML = ""

  if (translations && translations[currentLang]) {
    tableHTML = `
      <table class="voltage-drop-table">
        <thead>
          <tr>
            <th colspan="2">${translations[currentLang].multipleVoltageDropResults}</th>
          </tr>
        </thead>
        <tbody>
    `

    // Add completed calculations
    calculations.forEach((calc, index) => {
      tableHTML += `
        <tr>
          <td><strong>∆V<sub>${index + 1}</sub></strong></td>
          <td class="ltr-content">${calc.voltageDrop.toFixed(3)} V</td>
        </tr>
      `
    })

    // Add pending calculations
    for (let i = calculations.length; i < totalLoopCount; i++) {
      tableHTML += `
        <tr class="pending-row">
          <td><strong>∆V<sub>${i + 1}</sub></strong></td>
          <td class="ltr-content">---</td>
        </tr>
      `
    }

    // Add current total if more than one calculation
    if (calculations.length > 1) {
      const rangeText = `∆V<sub>1→${calculations.length}</sub>`
      tableHTML += `
        <tr class="partial-total-row">
          <td><strong>${rangeText}</strong></td>
          <td class="ltr-content"><strong>${currentTotal.toFixed(3)} V</strong></td>
        </tr>
      `
    }

    tableHTML += `
      </tbody>
    </table>
    `
  } else {
    // Hebrew fallback
    tableHTML = `
      <table class="voltage-drop-table">
        <thead>
          <tr>
            <th colspan="2">תוצאות מפל מתח מרובות</th>
          </tr>
        </thead>
        <tbody>
    `

    calculations.forEach((calc, index) => {
      tableHTML += `
        <tr>
          <td><strong>∆V<sub>${index + 1}</sub></strong></td>
          <td class="ltr-content">${calc.voltageDrop.toFixed(3)} V</td>
        </tr>
      `
    })

    for (let i = calculations.length; i < totalLoopCount; i++) {
      tableHTML += `
        <tr class="pending-row">
          <td><strong>∆V<sub>${i + 1}</sub></strong></td>
          <td class="ltr-content">---</td>
        </tr>
      `
    }

    if (calculations.length > 1) {
      const rangeText = `∆V<sub>1→${calculations.length}</sub>`
      tableHTML += `
        <tr class="partial-total-row">
          <td><strong>${rangeText}</strong></td>
          <td class="ltr-content"><strong>${currentTotal.toFixed(3)} V</strong></td>
        </tr>
      `
    }

    tableHTML += `
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
window.CableApp.updateIntermediateVoltageDropResults = updateIntermediateVoltageDropResults
window.CableApp.lastVoltageDropValues = () => lastVoltageDropValues
window.CableApp.copyVDRValue = copyVDRValue
window.CableApp.copyVDXValue = copyVDXValue

// Make functions available globally for HTML onclick handlers
window.calculateVoltageDrop = calculateVoltageDrop
window.copyVDRValue = copyVDRValue
window.copyVDXValue = copyVDXValue
window.cancelLoopMode = cancelLoopMode

console.log("Enhanced voltage drop module loaded successfully!")
