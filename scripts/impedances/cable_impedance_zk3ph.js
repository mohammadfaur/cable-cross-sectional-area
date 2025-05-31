// Cable Impedance Calculator Module for Zk3ph - Enhanced with equation selection and fractional resistivity
window.CableApp = window.CableApp || {}

function createCableInputSection(index, currentLang, translations) {
  const section = document.createElement("div")
  section.className = "impedance-input-section"
  section.id = `zl-${index}-inputs`

  const displayName = currentLang === "he" ? "עכבת כבל" : "Cable Impedance"

  const title = document.createElement("h4")
  const quantity = document.getElementById("zl-cables")?.value || 1
  title.textContent = quantity > 1 ? `${displayName} ${index}` : displayName
  section.appendChild(title)

  // Instructions for equation selection
  const instructions = document.createElement("p")
  instructions.className = "calculation-instructions"
  instructions.id = `zl-${index}-instructions`
  instructions.textContent =
    currentLang === "he" ? "בחר משוואה אחת לחישוב עכבת הכבל:" : "Select one equation to calculate cable impedance:"
  section.appendChild(instructions)

  // Create equation selection interface
  createCableEquationSelectionInterface(section, index, currentLang, translations)

  // Add individual calculate button for this impedance
  const calculateBtn = document.createElement("button")
  calculateBtn.type = "button"
  calculateBtn.className = "calculate-impedance-btn"
  calculateBtn.id = `calculate-zl-${index}-btn`
  calculateBtn.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].calculateImpedance || "חשב עכבה"
      : "Calculate Impedance"
  calculateBtn.onclick = () => calculateCableImpedanceForZk3ph(index)
  calculateBtn.disabled = true // Disabled until an equation is selected
  section.appendChild(calculateBtn)

  // Add result container for this impedance
  const resultDiv = document.createElement("div")
  resultDiv.className = "impedance-result"
  resultDiv.id = `zl-${index}-result`
  section.appendChild(resultDiv)

  return section
}

function createCableEquationSelectionInterface(container, index, currentLang, translations) {
  const equationsContainer = document.createElement("div")
  equationsContainer.className = "equations-container"

  // Define the two equations
  const equations = [
    {
      id: "rx_method",
      nameHe: "חישוב לפי היגב והתנגדות ליחידת אורך",
      nameEn: "r and x per unit length method",
      formula: `
        <div class="equation-content">
          <span class="equation-variable"><i>Z</i></span><sub>L</sub>
          <span class="equation-equals">=</span>
          <div class="equation-fraction">
            <div class="fraction-numerator">
              <span class="equation-variable">L</span>
            </div>
            <div class="fraction-line"></div>
            <div class="fraction-denominator">
              <span class="equation-variable">n</span>
            </div>
          </div>
          <span class="equation-dot">×</span>
          <span class="equation-parenthesis">(</span>
          <span class="equation-variable">r</span>
          <span class="equation-plus">+</span>
          <span class="equation-variable">j</span>
          <span class="equation-variable">x</span>
          <span class="equation-parenthesis">)</span>
        </div>
      `,
      inputs: [
        {
          id: "length",
          labelHe: "אורך כבל (L) [km]:",
          labelEn: "Cable Length (L) [km]:",
          placeholderHe: "הזן אורך",
          placeholderEn: "Enter length",
          step: "0.01",
        },
        {
          id: "cables",
          labelHe: "מספר כבלים במקביל (n):",
          labelEn: "Number of parallel cables (n):",
          placeholderHe: "הזן מספר כבלים",
          placeholderEn: "Enter number of cables",
          step: "1",
          min: "1",
          defaultValue: "1",
        },
        {
          id: "r",
          labelHe: "התנגדות (r) [Ω/km]:",
          labelEn: "Resistance (r) [Ω/km]:",
          placeholderHe: "הזן r",
          placeholderEn: "Enter r",
          step: "0.001",
        },
        {
          id: "x",
          labelHe: "היגב (x) [Ω/km]:",
          labelEn: "Reactance (x) [Ω/km]:",
          placeholderHe: "הזן x",
          placeholderEn: "Enter x",
          step: "0.001",
        },
      ],
    },
    {
      id: "resistivity_method",
      nameHe: "חישוב לפי שטח חתך והתנגדות סגולית",
      nameEn: "Resistivity and cross-sectional area method",
      formula: `
<div class="equation-content">
  <span class="equation-variable"><i>Z</i></span><sub>L</sub>
  <span class="equation-equals">=</span>
  <div class="equation-fraction">
    <div class="fraction-numerator">
      <span class="equation-variable">ρ</span>
      <span class="equation-dot">·</span>
      <span class="equation-variable">L</span>
    </div>
    <div class="fraction-line"></div>
    <div class="fraction-denominator">
      <span class="equation-variable">n</span>
      <span class="equation-dot">·</span>
      <span class="equation-variable">A</span>
    </div>
  </div>
  <span class="equation-plus">+</span>
  <span class="equation-variable">j</span>
  <div class="equation-fraction">
    <div class="fraction-numerator">
      <span class="equation-variable">X</span><sub>0</sub>
      <span class="equation-dot">·</span>
      <span class="equation-variable">L</span>
    </div>
    <div class="fraction-line"></div>
    <div class="fraction-denominator">
      <span>1000</span>
      <span class="equation-dot">·</span>
      <span class="equation-variable">n</span>
    </div>
  </div>
</div>
`,
      inputs: [
        {
          id: "resistivity",
          labelHe: "התנגדות סגולית (ρ) [Ω⋅mm²/m]:",
          labelEn: "Resistivity (ρ) [Ω⋅mm²/m]:",
          placeholderHe: "הזן ρ (למשל: 0.0175 או 1/57)",
          placeholderEn: "Enter ρ (e.g.: 0.0175 or 1/57)",
          step: "0.000001",
        },
        {
          id: "length_m",
          labelHe: "אורך כבל (L) [m]:",
          labelEn: "Cable Length (L) [m]:",
          placeholderHe: "הזן אורך במטרים",
          placeholderEn: "Enter length in meters",
          step: "0.1",
        },
        {
          id: "cables",
          labelHe: "מספר כבלים במקביל (n):",
          labelEn: "Number of parallel cables (n):",
          placeholderHe: "הזן מספר כבלים",
          placeholderEn: "Enter number of cables",
          step: "1",
          min: "1",
          defaultValue: "1",
        },
        {
          id: "area",
          labelHe: "שטח חתך (A) [mm²]:",
          labelEn: "Cross-sectional area (A) [mm²]:",
          placeholderHe: "הזן שטח חתך",
          placeholderEn: "Enter cross-sectional area",
          step: "0.1",
        },
        {
          id: "x0",
          labelHe: "היגב (X₀) [Ω/km]:",
          labelEn: "Reactance (X₀) [Ω/km]:",
          placeholderHe: "הזן X₀",
          placeholderEn: "Enter X₀",
          step: "0.001",
        },
      ],
    },
  ]

  // Create equation selection sections
  equations.forEach((equation, equationIndex) => {
    const equationSection = document.createElement("div")
    equationSection.className = "equation-section"

    // Checkbox and equation name
    const headerDiv = document.createElement("div")
    headerDiv.className = "equation-header"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = `zl-${index}-${equation.id}-enabled`
    checkbox.onchange = () => handleCableEquationToggle(index, equation.id)

    const label = document.createElement("label")
    label.htmlFor = checkbox.id
    label.textContent = currentLang === "he" ? equation.nameHe : equation.nameEn

    headerDiv.appendChild(checkbox)
    headerDiv.appendChild(label)
    equationSection.appendChild(headerDiv)

    // Formula display
    const formulaDiv = document.createElement("div")
    formulaDiv.className = "equation-formula"
    formulaDiv.innerHTML = equation.formula
    equationSection.appendChild(formulaDiv)

    // Input fields (hidden by default)
    const inputsDiv = document.createElement("div")
    inputsDiv.className = "equation-inputs"
    inputsDiv.id = `zl-${index}-${equation.id}-inputs`
    inputsDiv.style.display = "none"

    equation.inputs.forEach((input) => {
      const inputLabel = document.createElement("label")
      inputLabel.textContent = currentLang === "he" ? input.labelHe : input.labelEn
      inputsDiv.appendChild(inputLabel)

      const inputField = document.createElement("input")
      inputField.type = input.id === "resistivity" ? "text" : "number" // Allow text input for resistivity to support fractions
      inputField.id = `zl-${index}-${input.id}`
      if (input.id !== "resistivity") {
        inputField.step = input.step
        if (input.min) inputField.min = input.min
      }
      if (input.defaultValue) inputField.value = input.defaultValue
      inputField.placeholder = currentLang === "he" ? input.placeholderHe : input.placeholderEn
      inputsDiv.appendChild(inputField)
    })

    // Add copy button for rx_method equation only
    if (equation.id === "rx_method") {
      const integrationRow = document.createElement("div")
      integrationRow.className = "integration-buttons"
      integrationRow.style.marginTop = "15px"
      integrationRow.style.marginBottom = "10px"

      const copyFromRXBtn = document.createElement("button")
      copyFromRXBtn.type = "button"
      copyFromRXBtn.className = "integration-btn"
      copyFromRXBtn.id = `zl-${index}-copy-rx-btn`
      copyFromRXBtn.textContent =
        translations && translations[currentLang]
          ? translations[currentLang].copyFromRX || "העתק מ-R&X Finder"
          : "העתק מ-R&X Finder"
      copyFromRXBtn.onclick = () => copyFromRXFinder(index)
      integrationRow.appendChild(copyFromRXBtn)

      inputsDiv.appendChild(integrationRow)
    }

    equationSection.appendChild(inputsDiv)
    equationsContainer.appendChild(equationSection)
  })

  container.appendChild(equationsContainer)
}

function handleCableEquationToggle(index, equationId) {
  const currentCheckbox = document.getElementById(`zl-${index}-${equationId}-enabled`)

  if (currentCheckbox.checked) {
    // Uncheck the other equation
    const otherEquationId = equationId === "rx_method" ? "resistivity_method" : "rx_method"
    const otherCheckbox = document.getElementById(`zl-${index}-${otherEquationId}-enabled`)

    if (otherCheckbox && otherCheckbox.checked) {
      otherCheckbox.checked = false
      toggleCableEquationInputs(index, otherEquationId)
    }
  }

  // Toggle current equation inputs
  toggleCableEquationInputs(index, equationId)

  // Update copy button visibility
  updateCopyButtonVisibility(index, equationId, currentCheckbox.checked)

  // Update calculate button state
  updateCableCalculateButtonState(index)
}

function toggleCableEquationInputs(index, equationId) {
  const checkbox = document.getElementById(`zl-${index}-${equationId}-enabled`)
  const inputsDiv = document.getElementById(`zl-${index}-${equationId}-inputs`)

  if (checkbox && inputsDiv) {
    inputsDiv.style.display = checkbox.checked ? "block" : "none"
  }
}

function updateCopyButtonVisibility(index, equationId, isChecked) {
  const copyBtn = document.getElementById(`zl-${index}-copy-rx-btn`)
  if (copyBtn) {
    // Show copy button only for rx_method equation
    copyBtn.style.display = equationId === "rx_method" && isChecked ? "inline-block" : "none"
  }
}

function updateCableCalculateButtonState(index) {
  const calculateBtn = document.getElementById(`calculate-zl-${index}-btn`)
  const rxMethodChecked = document.getElementById(`zl-${index}-rx_method-enabled`)?.checked || false
  const resistivityMethodChecked = document.getElementById(`zl-${index}-resistivity_method-enabled`)?.checked || false

  if (calculateBtn) {
    calculateBtn.disabled = !(rxMethodChecked || resistivityMethodChecked)
  }
}

function getSelectedCableEquation(index) {
  const rxMethodChecked = document.getElementById(`zl-${index}-rx_method-enabled`)?.checked || false
  const resistivityMethodChecked = document.getElementById(`zl-${index}-resistivity_method-enabled`)?.checked || false

  if (rxMethodChecked) return "rx_method"
  if (resistivityMethodChecked) return "resistivity_method"
  return null
}

// Function to parse resistivity input (supports fractions like 1/57)
function parseResistivityInput(input) {
  const trimmedInput = input.trim()

  // Check if input contains a fraction (e.g., "1/57")
  if (trimmedInput.includes("/")) {
    const parts = trimmedInput.split("/")
    if (parts.length === 2) {
      const numerator = Number.parseFloat(parts[0])
      const denominator = Number.parseFloat(parts[1])

      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        return numerator / denominator
      }
    }
  }

  // Otherwise, try to parse as a regular number
  const numericValue = Number.parseFloat(trimmedInput)
  return isNaN(numericValue) ? null : numericValue
}

// Integration functions with R&X Finder
function copyFromRXFinder(index) {
  const lastFoundR = window.CableApp.lastFoundR ? window.CableApp.lastFoundR() : null
  const lastFoundX = window.CableApp.lastFoundX ? window.CableApp.lastFoundX() : null

  if (lastFoundR !== null && lastFoundX !== null) {
    const rInput = document.getElementById(`zl-${index}-r`)
    const xInput = document.getElementById(`zl-${index}-x`)

    if (rInput && xInput) {
      rInput.value = lastFoundR
      xInput.value = lastFoundX
      window.CableApp.highlightInput(rInput)
      window.CableApp.highlightInput(xInput)
    }
  } else {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].findRXFirst || "אנא מצא ערכי r ו-x תחילה"
        : "אנא מצא ערכי r ו-x תחילה"
    alert(message)
  }
}

function calculateCableImpedanceForZk3ph(index) {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  const selectedEquation = getSelectedCableEquation(index)

  if (!selectedEquation) {
    const message = currentLang === "he" ? "אנא בחר משוואה לחישוב" : "Please select an equation for calculation"
    alert(message)
    return
  }

  let calculationResults
  let details

  if (selectedEquation === "rx_method") {
    calculationResults = calculateUsingRXMethod(index, currentLang, translations)
  } else if (selectedEquation === "resistivity_method") {
    calculationResults = calculateUsingResistivityMethod(index, currentLang, translations)
  }

  if (!calculationResults) {
    return // Error already shown in the specific calculation function
  }

  // For short circuit calculations, we use magnitude
  const impedanceValue = calculationResults.magnitude
  details = calculationResults.details

  // Store the full calculation results for potential future use
  const fullResults = {
    ...calculationResults,
    details,
    magnitude: impedanceValue,
  }

  // Display the result
  displayCableResult(index, fullResults, currentLang, translations)

  // Disable the calculate button for this impedance
  const calculateBtn = document.getElementById(`calculate-zl-${index}-btn`)
  if (calculateBtn) {
    calculateBtn.disabled = true
  }

  // Register with main calculator (using real and imaginary parts for complex representation)
  const realPartOhms = calculationResults.realPart
  const imagPartOhms = calculationResults.imagPart

  window.CableApp.registerImpedanceCalculation("ZL", index, impedanceValue, details, realPartOhms, imagPartOhms)

  // Mark section as calculated
  const section = document.getElementById(`zl-${index}-inputs`)
  if (section) {
    section.classList.add("calculated")
  }
}

function calculateUsingRXMethod(index, currentLang, translations) {
  const length = Number.parseFloat(document.getElementById(`zl-${index}-length`).value)
  const cables = Number.parseInt(document.getElementById(`zl-${index}-cables`).value) || 1
  const r = Number.parseFloat(document.getElementById(`zl-${index}-r`).value)
  const x = Number.parseFloat(document.getElementById(`zl-${index}-x`).value)

  if (isNaN(length) || isNaN(r) || isNaN(x) || length <= 0 || cables <= 0) {
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].enterValidCableData || "אנא הזן נתוני כבל תקינים"
        : "אנא הזן נתוני כבל תקינים"
    alert(message)
    return null
  }

  // Use the existing cable impedance calculation logic from impedance.js
  const calculationResults = window.CableApp.calculateCableImpedanceCore(r, x, length, cables)
  calculationResults.details = `L=${length} km, n=${cables}, r=${r} Ω/km, x=${x} Ω/km`

  return calculationResults
}

function calculateUsingResistivityMethod(index, currentLang, translations) {
  const resistivityInput = document.getElementById(`zl-${index}-resistivity`).value
  const resistivity = parseResistivityInput(resistivityInput)
  const lengthM = Number.parseFloat(document.getElementById(`zl-${index}-length_m`).value)
  const cables = Number.parseInt(document.getElementById(`zl-${index}-cables`).value) || 1
  const area = Number.parseFloat(document.getElementById(`zl-${index}-area`).value)
  const x0 = Number.parseFloat(document.getElementById(`zl-${index}-x0`).value)

  if (
    resistivity === null ||
    isNaN(lengthM) ||
    isNaN(area) ||
    isNaN(x0) ||
    resistivity <= 0 ||
    lengthM <= 0 ||
    cables <= 0 ||
    area <= 0
  ) {
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].enterValidCableData || "אנא הזן נתוני כבל תקינים"
        : "אנא הזן נתוני כבל תקינים"
    alert(message)
    return null
  }

  // Calculate using the resistivity method
  // ZL = (ρ*L)/(n*A) + j((X0*L)/(1000*n))
  const realPart = (resistivity * lengthM) / (cables * area)
  const imagPart = (x0 * lengthM) / (1000 * cables)

  // Calculate magnitude and angle
  const magnitude = Math.sqrt(realPart * realPart + imagPart * imagPart)
  const angleRad = Math.atan2(imagPart, realPart)
  const angleDeg = angleRad * (180 / Math.PI)

  // Convert to milliohms for display consistency
  const realPartMilliohm = realPart * 1000
  const imagPartMilliohm = imagPart * 1000
  const magnitudeMilliohm = magnitude * 1000

  return {
    realPart,
    imagPart,
    magnitude,
    angleDeg,
    realPartMilliohm,
    imagPartMilliohm,
    magnitudeMilliohm,
    details: `ρ=${resistivityInput} Ω⋅mm²/m, L=${lengthM} m, n=${cables}, A=${area} mm², X₀=${x0} Ω/km`,
  }
}

function displayCableResult(index, calculationResults, currentLang, translations) {
  const resultDiv = document.getElementById(`zl-${index}-result`)
  if (!resultDiv) return

  const componentName =
    translations && translations[currentLang] ? translations[currentLang].cableImpedance || "עכבת כבל" : "עכבת כבל"

  const indexText = index > 1 ? ` ${index}` : ""
  const { magnitude } = calculationResults

  // Simple confirmation message instead of full table
  const confirmationHTML = `
    <div class="calculation-confirmation">
      <p><strong>✓ ${componentName}${indexText} ${translations && translations[currentLang] ? translations[currentLang].calculated || "חושב" : "חושב"}</strong></p>
      <p class="ltr-content">${calculationResults.details}</p>
      <p class="ltr-content"><strong>${magnitude.toFixed(6)} Ω</strong></p>
    </div>
  `

  resultDiv.innerHTML = confirmationHTML
}

// Expose functions to global scope
window.CableApp.createCableInputSection = createCableInputSection
window.CableApp.calculateCableImpedanceForZk3ph = calculateCableImpedanceForZk3ph
window.CableApp.copyFromRXFinder = copyFromRXFinder

// Make functions available globally for HTML onclick handlers
window.calculateCableImpedanceForZk3ph = calculateCableImpedanceForZk3ph
window.copyFromRXFinder = copyFromRXFinder

console.log("Enhanced cable impedance for Zk3ph module with fractional resistivity support loaded successfully!")
