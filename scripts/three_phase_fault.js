// Three-phase fault calculator functionality
let lastShortCircuitValues = null

// Initialize the global namespace
window.CableApp = window.CableApp || {}

function calculateShortCircuit3Ph() {
  const un = Number.parseFloat(document.getElementById("nominal-voltage").value)
  const zk3phValue = document.getElementById("zk3ph-value").value

  // Parse the Zk3ph value (it might be a string from the calculation)
  const zk3ph = Number.parseFloat(zk3phValue)

  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  if (isNaN(un) || isNaN(zk3ph) || un <= 0 || zk3ph <= 0) {
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].enterValidSC3ph || "אנא הזן מספרים תקינים עבור מתח נומינלי ועכבת קצר"
        : "אנא הזן מספרים תקינים עבור מתח נומינלי ועכבת קצר"
    alert(message)
    return
  }

  // Show calculation method selection modal
  showCalculationMethodModal(un, zk3ph, currentLang, translations)
}

function showCalculationMethodModal(un, zk3ph, currentLang, translations) {
  // Create modal overlay
  const modalOverlay = document.createElement("div")
  modalOverlay.className = "modal-overlay"
  modalOverlay.id = "calculation-method-modal"

  // Create modal content
  const modalContent = document.createElement("div")
  modalContent.className = "modal-content"

  // Modal header
  const modalHeader = document.createElement("div")
  modalHeader.className = "modal-header"

  const modalTitle = document.createElement("h3")
  modalTitle.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].calculationMethodTitle || "בחר שיטת חישוב"
      : "בחר שיטת חישוב"
  modalHeader.appendChild(modalTitle)

  const closeBtn = document.createElement("button")
  closeBtn.className = "modal-close"
  closeBtn.innerHTML = "&times;"
  closeBtn.onclick = () => closeCalculationMethodModal()
  modalHeader.appendChild(closeBtn)

  modalContent.appendChild(modalHeader)

  // Modal body
  const modalBody = document.createElement("div")
  modalBody.className = "modal-body"

  const instructions = document.createElement("p")
  instructions.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].calculationMethodInstructions || "בחר את שיטת החישוב המתאימה:"
      : "בחר את שיטת החישוב המתאימה:"
  modalBody.appendChild(instructions)

  // Radio button options
  const optionsContainer = document.createElement("div")
  optionsContainer.className = "calculation-options"

  // Option 1: Standard calculation
  const option1Container = document.createElement("div")
  option1Container.className = "calculation-option"

  const option1Radio = document.createElement("input")
  option1Radio.type = "radio"
  option1Radio.name = "calculation-method"
  option1Radio.value = "standard"
  option1Radio.id = "standard-calculation"
  option1Radio.checked = true

  const option1Label = document.createElement("label")
  option1Label.htmlFor = "standard-calculation"
  option1Label.className = "calculation-option-label"

  const option1Title = document.createElement("div")
  option1Title.className = "option-title"
  option1Title.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].standardCalculation || "חישוב סטנדרטי"
      : "חישוב סטנדרטי"

  const option1Formula = document.createElement("div")
  option1Formula.className = "option-formula"
  option1Formula.innerHTML = `
    <div class="equation-content">
      <span class="equation-variable">I</span><sub>k3ph</sub>
      <span class="equation-equals">=</span>
      <div class="equation-fraction">
        <div class="fraction-numerator">
          <span class="equation-variable">U</span><sub>n</sub>
        </div>
        <div class="fraction-line"></div>
        <div class="fraction-denominator">
          <span class="equation-variable">√3</span>
          <span class="equation-dot">×</span>
          <span class="equation-variable">Z</span><sub>k3ph</sub>
        </div>
      </div>
    </div>
  `

  const option1Description = document.createElement("div")
  option1Description.className = "option-description"
  option1Description.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].standardCalculationDesc || "חישוב זרם קצר בסיסי ללא מקדמי בטיחות"
      : "חישוב זרם קצר בסיסי ללא מקדמי בטיחות"

  option1Label.appendChild(option1Title)
  option1Label.appendChild(option1Formula)
  option1Label.appendChild(option1Description)

  option1Container.appendChild(option1Radio)
  option1Container.appendChild(option1Label)

  // Option 2: Safety factor calculation
  const option2Container = document.createElement("div")
  option2Container.className = "calculation-option"

  const option2Radio = document.createElement("input")
  option2Radio.type = "radio"
  option2Radio.name = "calculation-method"
  option2Radio.value = "safety"
  option2Radio.id = "safety-calculation"

  const option2Label = document.createElement("label")
  option2Label.htmlFor = "safety-calculation"
  option2Label.className = "calculation-option-label"

  const option2Title = document.createElement("div")
  option2Title.className = "option-title"
  option2Title.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].safetyCalculation || "חישוב עם מקדם בטיחות"
      : "חישוב עם מקדם בטיחות"

  const option2Formula = document.createElement("div")
  option2Formula.className = "option-formula"
  option2Formula.innerHTML = `
    <div class="equation-content">
      <span class="equation-variable">I</span><sub>k3ph</sub>
      <span class="equation-equals">=</span>
      <div class="equation-fraction">
        <div class="fraction-numerator">
          <span class="equation-variable">1.1</span>
          <span class="equation-dot">×</span>
          <span class="equation-variable">U</span><sub>n</sub>
        </div>
        <div class="fraction-line"></div>
        <div class="fraction-denominator">
          <span class="equation-variable">√3</span>
          <span class="equation-dot">×</span>
          <span class="equation-variable">Z</span><sub>k3ph</sub>
        </div>
      </div>
    </div>
  `

  const option2Description = document.createElement("div")
  option2Description.className = "option-description"
  option2Description.textContent =
    translations && translations[currentLang]
      ? translations[currentLang].safetyCalculationDesc || "חישוב זרם קצר עם מקדם בטיחות 1.1 (מומלץ לתכנון)"
      : "חישוב זרם קצר עם מקדם בטיחות 1.1 (מומלץ לתכנון)"

  option2Label.appendChild(option2Title)
  option2Label.appendChild(option2Formula)
  option2Label.appendChild(option2Description)

  option2Container.appendChild(option2Radio)
  option2Container.appendChild(option2Label)

  optionsContainer.appendChild(option1Container)
  optionsContainer.appendChild(option2Container)
  modalBody.appendChild(optionsContainer)

  modalContent.appendChild(modalBody)

  // Modal buttons
  const modalButtons = document.createElement("div")
  modalButtons.className = "modal-buttons"

  const calculateBtn = document.createElement("button")
  calculateBtn.textContent =
    translations && translations[currentLang] ? translations[currentLang].calculateBtn || "חשב" : "חשב"
  calculateBtn.onclick = () => performSelectedCalculation(un, zk3ph, currentLang, translations)

  const cancelBtn = document.createElement("button")
  cancelBtn.textContent =
    translations && translations[currentLang] ? translations[currentLang].cancelBtn || "ביטול" : "ביטול"
  cancelBtn.onclick = () => closeCalculationMethodModal()

  modalButtons.appendChild(calculateBtn)
  modalButtons.appendChild(cancelBtn)
  modalContent.appendChild(modalButtons)

  modalOverlay.appendChild(modalContent)
  document.body.appendChild(modalOverlay)

  // Add click outside to close
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeCalculationMethodModal()
    }
  })
}

function performSelectedCalculation(un, zk3ph, currentLang, translations) {
  const selectedMethod = document.querySelector('input[name="calculation-method"]:checked').value
  const sqrt3 = Math.sqrt(3)

  let ik3ph, calculationMethod, formula

  if (selectedMethod === "standard") {
    // Standard calculation: Ik3ph = Un / (√3 × Zk3ph)
    ik3ph = un / (sqrt3 * zk3ph)
    calculationMethod =
      translations && translations[currentLang]
        ? translations[currentLang].standardCalculation || "חישוב סטנדרטי"
        : "חישוב סטנדרטי"
    formula = `Un / (√3 × Zk3ph) = ${un} / (${sqrt3.toFixed(3)} × ${zk3ph.toFixed(6)})`
  } else {
    // Safety factor calculation: Ik3ph = 1.1 × Un / (√3 × Zk3ph)
    ik3ph = (1.1 * un) / (sqrt3 * zk3ph)
    calculationMethod =
      translations && translations[currentLang]
        ? translations[currentLang].safetyCalculation || "חישוב עם מקדם בטיחות"
        : "חישוב עם מקדם בטיחות"
    formula = `1.1 × Un / (√3 × Zk3ph) = 1.1 × ${un} / (${sqrt3.toFixed(3)} × ${zk3ph.toFixed(6)})`
  }

  // Store the calculated values
  lastShortCircuitValues = {
    un,
    zk3ph,
    ik3ph,
    sqrt3,
    calculationMethod,
    formula,
    safetyFactor: selectedMethod === "safety" ? 1.1 : 1.0,
  }

  // Close modal with fade effect
  closeCalculationMethodModal(() => {
    // Update results after modal closes
    updateShortCircuitResults(lastShortCircuitValues)
  })
}

function closeCalculationMethodModal(callback) {
  const modal = document.getElementById("calculation-method-modal")
  if (modal) {
    modal.style.opacity = "0"
    setTimeout(() => {
      modal.remove()
      if (callback) callback()
    }, 300)
  }
}

function updateShortCircuitResults(values) {
  const shortCircuitOutput = document.getElementById("short-circuit-3ph-output")
  if (!shortCircuitOutput) {
    return
  }

  const { un, zk3ph, ik3ph, calculationMethod, formula, safetyFactor } = values
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  let tableHTML = ""

  if (translations && translations[currentLang]) {
    tableHTML = `
      <table class="short-circuit-table">
        <thead>
          <tr>
            <th colspan="2">${translations[currentLang].shortCircuitResults || "תוצאות קצר תלת-פאזי"}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${translations[currentLang].calculationMethod || "שיטת חישוב"}</strong></td>
            <td class="ltr-content">${calculationMethod}</td>
          </tr>
          <tr>
            <td><strong>${translations[currentLang].nominalVoltage || "מתח נומינלי"} (Un)</strong></td>
            <td class="ltr-content">${un.toFixed(1)} V</td>
          </tr>
          <tr>
            <td><strong>${translations[currentLang].shortCircuitImpedance || "עכבת קצר"} (Zk3ph)</strong></td>
            <td class="ltr-content">${zk3ph.toFixed(6)} Ω</td>
          </tr>
          ${
            safetyFactor > 1.0
              ? `
          <tr>
            <td><strong>${translations[currentLang].safetyFactor || "מקדם בטיחות"}</strong></td>
            <td class="ltr-content">${safetyFactor}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td><strong>${translations[currentLang].calculationFormula || "נוסחת חישוב"}</strong></td>
            <td class="ltr-content">${formula}</td>
          </tr>
          <tr class="result-row">
            <td><strong>${translations[currentLang].shortCircuitCurrent || "זרם קצר תלת-פאזי"} (Ik3ph)</strong></td>
            <td class="ltr-content"><strong>${ik3ph.toFixed(2)} A</strong></td>
          </tr>
        </tbody>
      </table>
    `
  } else {
    // Hebrew fallback
    tableHTML = `
      <table class="short-circuit-table">
        <thead>
          <tr>
            <th colspan="2">תוצאות קצר תלת-פאזי</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>שיטת חישוב</strong></td>
            <td class="ltr-content">${calculationMethod}</td>
          </tr>
          <tr>
            <td><strong>מתח נומינלי (Un)</strong></td>
            <td class="ltr-content">${un.toFixed(1)} V</td>
          </tr>
          <tr>
            <td><strong>עכבת קצר (Zk3ph)</strong></td>
            <td class="ltr-content">${zk3ph.toFixed(6)} Ω</td>
          </tr>
          ${
            safetyFactor > 1.0
              ? `
          <tr>
            <td><strong>מקדם בטיחות</strong></td>
            <td class="ltr-content">${safetyFactor}</td>
          </tr>
          `
              : ""
          }
          <tr>
            <td><strong>נוסחת חישוב</strong></td>
            <td class="ltr-content">${formula}</td>
          </tr>
          <tr class="result-row">
            <td><strong>זרם קצר תלת-פאזי (Ik3ph)</strong></td>
            <td class="ltr-content"><strong>${ik3ph.toFixed(2)} A</strong></td>
          </tr>
        </tbody>
      </table>
    `
  }

  shortCircuitOutput.innerHTML = tableHTML
}

// Expose functions to global scope
window.CableApp.calculateShortCircuit3Ph = calculateShortCircuit3Ph
window.CableApp.updateShortCircuitResults = updateShortCircuitResults
window.CableApp.lastShortCircuitValues = () => lastShortCircuitValues

// Make functions available globally for HTML onclick handlers
window.calculateShortCircuit3Ph = calculateShortCircuit3Ph

console.log("Three-phase fault calculator loaded successfully!")
