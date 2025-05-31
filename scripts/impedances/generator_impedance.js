// Generator Impedance Calculator Module
window.CableApp = window.CableApp || {}

function createGeneratorInputSection(index, currentLang, translations) {
  const section = document.createElement("div")
  section.className = "impedance-input-section"
  section.id = `zg-${index}-inputs`

  const displayName = currentLang === "he" ? "עכבת גנרטור" : "Generator Impedance"

  const title = document.createElement("h4")
  title.textContent = displayName
  section.appendChild(title)

  // Generator impedance equation - Updated with Ux% and Sg instead of Sn
  const equation = document.createElement("div")
  equation.className = "impedance-equation"
  equation.innerHTML = `
  <div class="equation-content">
    <span class="equation-variable"><i>Z</i></span><sub>G</sub>
    <span class="equation-equals">=</span>
    <div class="equation-fraction">
      <div class="fraction-numerator">
        <span class="equation-variable">U</span><sub>x%</sub>
        <span class="equation-dot">×</span>
        <span class="equation-variable">U</span><sub>n</sub><sup>2</sup>
      </div>
      <div class="fraction-line"></div>
      <div class="fraction-denominator">
        <span>100</span>
        <span class="equation-dot">×</span>
        <span class="equation-variable">S</span><sub>g</sub>
      </div>
    </div>
  </div>
`
  section.appendChild(equation)

  // Un input for generator impedance calculation
  const unLabel = document.createElement("label")
  unLabel.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].nominalVoltage + " (Un) [V]:" || "מתח נומינלי (Un) [V]:"
      : "מתח נומינלי (Un) [V]:"
  section.appendChild(unLabel)

  const unInput = document.createElement("input")
  unInput.type = "number"
  unInput.id = `zg-${index}-un`
  unInput.step = "0.1"
  unInput.placeholder =
    translations && translations[currentLang]
      ? translations[currentLang].enterNominalVoltage || "הזן מתח נומינלי"
      : "הזן מתח נומינלי"
  // Pre-fill with the main nominal voltage if available
  unInput.value = document.getElementById("nominal-voltage")?.value || ""
  section.appendChild(unInput)

  const powerLabel = document.createElement("label")
  powerLabel.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].generatorPower || "הספק הגנרטור (Sg) [kVA]:"
      : "הספק הגנרטור (Sg) [kVA]:"
  section.appendChild(powerLabel)

  const powerInput = document.createElement("input")
  powerInput.type = "number"
  powerInput.id = `zg-${index}-power`
  powerInput.step = "0.1"
  powerInput.placeholder =
    translations && translations[currentLang] ? translations[currentLang].enterPower || "הזן הספק" : "הזן הספק"
  section.appendChild(powerInput)

  const reactanceLabel = document.createElement("label")
  reactanceLabel.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].subtransientReactanceGenerator || "מפל מתח היגבי של הגנרטור (Ux%) [%]:"
      : "מפל מתח היגבי של הגנרטור (Ux%) [%]:"
  section.appendChild(reactanceLabel)

  const reactanceInput = document.createElement("input")
  reactanceInput.type = "number"
  reactanceInput.id = `zg-${index}-ux`
  reactanceInput.step = "0.1"
  reactanceInput.placeholder = currentLang === "he" ? "הזן Ux%" : "Enter Ux%"
  section.appendChild(reactanceInput)

  // Add individual calculate button for this impedance
  const calculateBtn = document.createElement("button")
  calculateBtn.type = "button"
  calculateBtn.className = "calculate-impedance-btn"
  calculateBtn.id = `calculate-zg-${index}-btn`
  calculateBtn.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].calculateImpedance || "חשב עכבה"
      : "Calculate Impedance"
  calculateBtn.onclick = () => calculateGeneratorImpedance(index)
  section.appendChild(calculateBtn)

  // Add result container for this impedance
  const resultDiv = document.createElement("div")
  resultDiv.className = "impedance-result"
  resultDiv.id = `zg-${index}-result`
  section.appendChild(resultDiv)

  return section
}

function calculateGeneratorImpedance(index) {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
  const nominalVoltage = Number.parseFloat(document.getElementById(`zg-${index}-un`).value)

  if (isNaN(nominalVoltage) || nominalVoltage <= 0) {
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].enterNominalVoltage || "אנא הזן מתח נומינלי תקין"
        : "אנא הזן מתח נומינלי תקין"
    alert(message)
    return
  }

  const power = Number.parseFloat(document.getElementById(`zg-${index}-power`).value)
  const ux = Number.parseFloat(document.getElementById(`zg-${index}-ux`).value)

  if (!isNaN(power) && !isNaN(ux) && power > 0 && ux > 0) {
    // ZG = (Ux% × Un²) / (100 × Sg) - Updated comment to reflect Sg
    const impedanceValue = (ux * nominalVoltage * nominalVoltage) / (100 * power * 1000)
    const details = `Un=${nominalVoltage}V, Sg=${power} kVA, Ux%=${ux}%` // Updated to show Sg

    // Display the result
    displayGeneratorResult(index, impedanceValue, details, currentLang, translations)

    // Disable the calculate button for this impedance
    const calculateBtn = document.getElementById(`calculate-zg-${index}-btn`)
    if (calculateBtn) {
      calculateBtn.disabled = true
    }

    // Register with main calculator (generator impedance is purely reactive)
    window.CableApp.registerImpedanceCalculation("ZG", index, impedanceValue, details, 0, impedanceValue)

    // Mark section as calculated
    const section = document.getElementById(`zg-${index}-inputs`)
    if (section) {
      section.classList.add("calculated")
    }
  } else {
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].enterValidGeneratorData || "אנא הזן נתוני גנרטור תקינים"
        : "אנא הזן נתוני גנרטור תקינים"
    alert(message)
  }
}

function displayGeneratorResult(index, impedanceValue, details, currentLang, translations) {
  const resultDiv = document.getElementById(`zg-${index}-result`)
  if (!resultDiv) return

  const componentName =
    translations && translations[currentLang]
      ? translations[currentLang].generatorImpedance || "עכבת גנרטור"
      : "עכבת גנרטור"

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
window.CableApp.createGeneratorInputSection = createGeneratorInputSection
window.CableApp.calculateGeneratorImpedance = calculateGeneratorImpedance

// Make functions available globally for HTML onclick handlers
window.calculateGeneratorImpedance = calculateGeneratorImpedance

console.log("Generator impedance module with reflection loaded successfully!")
