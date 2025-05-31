// System Impedance Calculator Module with debugging
window.CableApp = window.CableApp || {}

function createSystemInputSection(index, currentLang, translations) {
  console.log(`=== CREATING SYSTEM INPUT SECTION ${index} ===`)

  const section = document.createElement("div")
  section.className = "impedance-input-section"
  section.id = `zsystem-${index}-inputs`

  console.log(`Created section with ID: ${section.id}`)

  const displayName = currentLang === "he" ? "עכבת מערכת" : "System Impedance"

  const title = document.createElement("h4")
  title.textContent = displayName
  section.appendChild(title)

  // System impedance equation
  const equation = document.createElement("div")
  equation.className = "impedance-equation"
  equation.innerHTML = `
  <div class="equation-content">
    <span class="equation-variable"><i>Z</i></span><sub>System</sub>
    <span class="equation-equals">=</span>
    <div class="equation-fraction">
      <div class="fraction-numerator">
        <span class="equation-variable">U</span><sub>n</sub><sup>2</sup>
      </div>
      <div class="fraction-line"></div>
      <div class="fraction-denominator">
        <span class="equation-variable">S</span><sub>k</sub>
      </div>
    </div>
  </div>
`
  section.appendChild(equation)

  // Un input for system impedance calculation
  const unLabel = document.createElement("label")
  unLabel.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].nominalVoltage + " (Un) [V]:" || "מתח נומינלי (Un) [V]:"
      : "מתח נומינלי (Un) [V]:"
  section.appendChild(unLabel)

  const unInput = document.createElement("input")
  unInput.type = "number"
  unInput.id = `zsystem-${index}-un`
  unInput.step = "0.1"
  unInput.placeholder =
    translations && translations[currentLang]
      ? translations[currentLang].enterNominalVoltage || "הזן מתח נומינלי"
      : "הזן מתח נומינלי"
  // Pre-fill with the main nominal voltage if available
  unInput.value = document.getElementById("nominal-voltage")?.value || ""
  section.appendChild(unInput)

  // Update the label for Short Circuit Power in createSystemInputSection function
  const skLabel = document.createElement("label")
  skLabel.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].shortCircuitPowerSystem || "הספק הקצר של המערכת (Sk) [MVA]:"
      : "הספק הקצר של המערכת (Sk) [MVA]:"
  section.appendChild(skLabel)

  const skInput = document.createElement("input")
  skInput.type = "number"
  skInput.id = `zsystem-${index}-sk`
  skInput.step = "0.1"
  skInput.placeholder =
    translations && translations[currentLang] ? translations[currentLang].enterSk || "הזן הספק קצר" : "הזן הספק קצר"
  section.appendChild(skInput)

  // Add individual calculate button for this impedance
  const calculateBtn = document.createElement("button")
  calculateBtn.type = "button"
  calculateBtn.className = "calculate-impedance-btn"
  calculateBtn.id = `calculate-zsystem-${index}-btn`
  calculateBtn.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].calculateImpedance || "חשב עכבה"
      : "Calculate Impedance"
  calculateBtn.onclick = () => calculateSystemImpedance(index)
  section.appendChild(calculateBtn)

  // Add result container for this impedance
  const resultDiv = document.createElement("div")
  resultDiv.className = "impedance-result"
  resultDiv.id = `zsystem-${index}-result`
  section.appendChild(resultDiv)

  // Ensure section is visible
  section.style.display = "block"

  console.log(`System section ${index} created successfully`)
  console.log(`Section display style: ${section.style.display}`)

  return section
}

function calculateSystemImpedance(index) {
  console.log(`=== CALCULATING SYSTEM IMPEDANCE ${index} ===`)

  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
  const nominalVoltage = Number.parseFloat(document.getElementById(`zsystem-${index}-un`).value)

  if (isNaN(nominalVoltage) || nominalVoltage <= 0) {
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].enterNominalVoltage || "אנא הזן מתח נומינלי תקין"
        : "אנא הזן מתח נומינלי תקין"
    alert(message)
    return
  }

  const sk = Number.parseFloat(document.getElementById(`zsystem-${index}-sk`).value)

  if (!isNaN(sk) && sk > 0) {
    // ZSystem = Un² / Sk
    const impedanceValue = (nominalVoltage * nominalVoltage) / (sk * 1000000)
    const details = `Un=${nominalVoltage}V, Sk=${sk} MVA`

    // Display the result
    displaySystemResult(index, impedanceValue, details, currentLang, translations)

    // Disable the calculate button for this impedance
    const calculateBtn = document.getElementById(`calculate-zsystem-${index}-btn`)
    if (calculateBtn) {
      calculateBtn.disabled = true
    }

    console.log(`About to register impedance calculation for ZSystem-${index}`)

    // Register with main calculator (system impedance is purely reactive)
    // Pass 0 for real part and impedanceValue for imaginary part to show as jX
    window.CableApp.registerImpedanceCalculation("ZSystem", index, impedanceValue, details, 0, impedanceValue)

    // Mark section as calculated
    const section = document.getElementById(`zsystem-${index}-inputs`)
    if (section) {
      section.classList.add("calculated")
      console.log(`Marked section zsystem-${index}-inputs as calculated`)
    }
  } else {
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].enterValidSystemData || "אנא הזן נתוני מערכת תקינים"
        : "אנא הזן נתוני מערכת תקינים"
    alert(message)
  }
}

function displaySystemResult(index, impedanceValue, details, currentLang, translations) {
  const resultDiv = document.getElementById(`zsystem-${index}-result`)
  if (!resultDiv) return

  const componentName =
    translations && translations[currentLang] ? translations[currentLang].systemImpedance || "עכבת מערכת" : "עכבת מערכת"

  // Simple confirmation message instead of full table
  const confirmationHTML = `
    <div class="calculation-confirmation">
      <p><strong>✓ ${componentName} ${translations && translations[currentLang] ? translations[currentLang].calculated || "חושב" : "חושב"}</strong></p>
      <p class="ltr-content">${details}</p>
      <p class="ltr-content"><strong>${impedanceValue.toFixed(6)} Ω</strong></p>
    </div>
  `

  resultDiv.innerHTML = confirmationHTML
}

// Expose functions to global scope
window.CableApp.createSystemInputSection = createSystemInputSection
window.CableApp.calculateSystemImpedance = calculateSystemImpedance

// Make functions available globally for HTML onclick handlers
window.calculateSystemImpedance = calculateSystemImpedance

console.log("System impedance module with debugging loaded successfully!")
