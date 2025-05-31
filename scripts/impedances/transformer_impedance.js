// Transformer Impedance Calculator Module - Enhanced Version with RTr = 0 option
window.CableApp = window.CableApp || {}

function createTransformerInputSection(index, currentLang, translations) {
  const section = document.createElement("div")
  section.className = "impedance-input-section"
  section.id = `ztr-${index}-inputs`

  const displayName = currentLang === "he" ? "עכבת שנאי" : "Transformer Impedance"
  const numTransformers = document.getElementById("ztr-transformers")?.value || 1

  const title = document.createElement("h4")
  title.textContent = numTransformers > 1 ? `${displayName} ${index}` : displayName
  section.appendChild(title)

  // Add RTr = 0 option
  createRtrZeroOption(section, index, currentLang)

  // Instructions
  const instructions = document.createElement("p")
  instructions.className = "calculation-instructions"
  instructions.id = `ztr-${index}-instructions`
  instructions.textContent =
    currentLang === "he"
      ? "בחר בדיוק 2 משוואות לחישוב עכבת השנאי (רק משוואת RTr אחת מותרת):"
      : "Select exactly 2 equations to calculate transformer impedance (only one RTr equation allowed):"
  section.appendChild(instructions)

  // Create equation selection interface
  createEquationSelectionInterface(section, index, currentLang, translations)

  // Add calculate button
  const calculateBtn = document.createElement("button")
  calculateBtn.type = "button"
  calculateBtn.className = "calculate-impedance-btn"
  calculateBtn.id = `calculate-ztr-${index}-btn`
  calculateBtn.textContent = currentLang === "he" ? "חשב עכבת שנאי" : "Calculate Transformer Impedance"
  calculateBtn.onclick = () => calculateTransformerImpedance(index)
  section.appendChild(calculateBtn)

  // Add result container
  const resultDiv = document.createElement("div")
  resultDiv.className = "impedance-result"
  resultDiv.id = `ztr-${index}-result`
  section.appendChild(resultDiv)

  return section
}

function createRtrZeroOption(container, index, currentLang) {
  const rtrZeroSection = document.createElement("div")
  rtrZeroSection.className = "rtr-zero-section"

  const checkboxContainer = document.createElement("div")
  checkboxContainer.className = "rtr-zero-checkbox-container"

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.id = `ztr-${index}-rtr-zero`
  checkbox.onchange = () => toggleRtrZeroMode(index, currentLang)

  const label = document.createElement("label")
  label.htmlFor = checkbox.id
  label.className = "rtr-zero-label"
  label.textContent = "RTr = 0"

  checkboxContainer.appendChild(checkbox)
  checkboxContainer.appendChild(label)
  rtrZeroSection.appendChild(checkboxContainer)

  const explanation = document.createElement("p")
  explanation.className = "rtr-zero-explanation"
  explanation.textContent =
    currentLang === "he"
      ? "במצב זה, עכבת השנאי תהיה ZTr = XTr (רכיב ריאקטיבי בלבד)"
      : "In this mode, transformer impedance will be ZTr = XTr (reactive component only)"
  rtrZeroSection.appendChild(explanation)

  container.appendChild(rtrZeroSection)
}

function toggleRtrZeroMode(index, currentLang) {
  const checkbox = document.getElementById(`ztr-${index}-rtr-zero`)
  const instructions = document.getElementById(`ztr-${index}-instructions`)
  const equationsContainer = document.querySelector(`#ztr-${index}-inputs .equations-container`)

  if (checkbox.checked) {
    // RTr = 0 mode enabled
    instructions.textContent =
      currentLang === "he" ? "בחר משוואה אחת (ZTr או XTr) - RTr = 0:" : "Select one equation (ZTr or XTr) - RTr = 0:"

    // Hide RTr equations
    const rtrEquations = [
      document.getElementById(`ztr-${index}-rtr_losses-enabled`)?.closest(".equation-section"),
      document.getElementById(`ztr-${index}-rtr_voltage-enabled`)?.closest(".equation-section"),
    ]

    rtrEquations.forEach((section) => {
      if (section) {
        section.style.display = "none"
        // Uncheck if checked
        const checkbox = section.querySelector('input[type="checkbox"]')
        if (checkbox) {
          checkbox.checked = false
          toggleEquationInputs(index, checkbox.id.split("-")[2])
        }
      }
    })

    // Add special styling to indicate RTr = 0 mode
    if (equationsContainer) {
      equationsContainer.classList.add("rtr-zero-mode")
    }

    // Uncheck all ZTr and XTr equations initially
    const ztrCheckbox = document.getElementById(`ztr-${index}-ztr-enabled`)
    const xtrCheckbox = document.getElementById(`ztr-${index}-xtr-enabled`)

    if (ztrCheckbox && ztrCheckbox.checked) {
      ztrCheckbox.checked = false
      toggleEquationInputs(index, "ztr")
    }
    if (xtrCheckbox && xtrCheckbox.checked) {
      xtrCheckbox.checked = false
      toggleEquationInputs(index, "xtr")
    }
  } else {
    // Normal mode
    instructions.textContent =
      currentLang === "he"
        ? "בחר בדיוק 2 משוואות לחישוב עכבת השנאי (רק משוואת RTr אחת מותרת):"
        : "Select exactly 2 equations to calculate transformer impedance (only one RTr equation allowed):"

    // Show all equations
    const allEquationSections = document.querySelectorAll(`#ztr-${index}-inputs .equation-section`)
    allEquationSections.forEach((section) => {
      section.style.display = "block"
    })

    // Remove special styling
    if (equationsContainer) {
      equationsContainer.classList.remove("rtr-zero-mode")
    }
  }

  // Update equation availability after mode change
  updateEquationAvailability(index)
}

function createEquationSelectionInterface(container, index, currentLang, translations) {
  const equationsContainer = document.createElement("div")
  equationsContainer.className = "equations-container"

  // Define equations with their variables - Updated with better mathematical formatting
  const equations = [
    {
      id: "ztr",
      nameHe: "עכבת שנאי",
      nameEn: "Total Transformer Impedance",
      formula: `
        <div class="equation-content">
          <span class="equation-variable"><i>Z</i></span><sub>Tr</sub>
          <span class="equation-equals">=</span>
          <div class="equation-fraction">
            <div class="fraction-numerator">
              <span class="equation-variable">U</span><sub>k%</sub>
              <span class="equation-dot">×</span>
              <span class="equation-variable">U</span><sub>n</sub><sup>2</sup>
            </div>
            <div class="fraction-line"></div>
            <div class="fraction-denominator">
              <span>100</span>
              <span class="equation-dot">×</span>
              <span class="equation-variable">S</span><sub>n</sub>
            </div>
          </div>
        </div>
      `,
      inputs: [
        {
          id: "uk",
          labelHe: "מתח הקצר של השנאי (Uk%) [%]:",
          labelEn: "Short-circuit voltage (Uk%) [%]:",
          placeholderHe: "הזן Uk%",
          placeholderEn: "Enter Uk%",
        },
        {
          id: "sn",
          labelHe: "הספק נקוב של השנאי (Sn) [kVA]:",
          labelEn: "Nominal rated power (Sn) [kVA]:",
          placeholderHe: "הזן Sn",
          placeholderEn: "Enter Sn",
        },
      ],
    },
    {
      id: "rtr_losses",
      nameHe: "התנגדות שנאי (מהפסדי נחושת)",
      nameEn: "Transformer Resistance (from copper losses)",
      formula: `
        <div class="equation-content">
          <span class="equation-variable"><i>R</i></span><sub>Tr</sub>
          <span class="equation-equals">=</span>
          <div class="equation-fraction">
            <div class="fraction-numerator">
              <span class="equation-variable">ΔP</span><sub>CUn</sub>
              <span class="equation-dot">×</span>
              <span class="equation-variable">U</span><sub>n</sub><sup>2</sup>
            </div>
            <div class="fraction-line"></div>
            <div class="fraction-denominator">
              <span class="equation-variable">S</span><sub>n</sub><sup>2</sup>
            </div>
          </div>
        </div>
      `,
      inputs: [
        {
          id: "pcun",
          labelHe: "הפסדי הנחושת הנקובים של השנאי (ΔPCUn) [W]:",
          labelEn: "Nominal copper losses (ΔPCUn) [W]:",
          placeholderHe: "הזן ΔPCUn",
          placeholderEn: "Enter ΔPCUn",
        },
        {
          id: "sn",
          labelHe: "הספק נקוב של השנאי (Sn) [kVA]:",
          labelEn: "Nominal rated power (Sn) [kVA]:",
          placeholderHe: "הזן Sn",
          placeholderEn: "Enter Sn",
        },
      ],
    },
    {
      id: "rtr_voltage",
      nameHe: "התנגדות שנאי (מרכיב אקטיבי)",
      nameEn: "Transformer Resistance (from resistive component)",
      formula: `
        <div class="equation-content">
          <span class="equation-variable"><i>R</i></span><sub>Tr</sub>
          <span class="equation-equals">=</span>
          <div class="equation-fraction">
            <div class="fraction-numerator">
              <span class="equation-variable">U</span><sub>r%</sub>
              <span class="equation-dot">×</span>
              <span class="equation-variable">U</span><sub>n</sub><sup>2</sup>
            </div>
            <div class="fraction-line"></div>
            <div class="fraction-denominator">
              <span>100</span>
              <span class="equation-dot">×</span>
              <span class="equation-variable">S</span><sub>n</sub>
            </div>
          </div>
        </div>
      `,
      inputs: [
        {
          id: "ur",
          labelHe: "הרכיב האקטיבי של מתח הקצר (Ur%) [%]:",
          labelEn: "Resistive component of short-circuit voltage (Ur%) [%]:",
          placeholderHe: "הזן Ur%",
          placeholderEn: "Enter Ur%",
        },
        {
          id: "sn",
          labelHe: "הספק נקוב של השנאי (Sn) [kVA]:",
          labelEn: "Nominal rated power (Sn) [kVA]:",
          placeholderHe: "הזן Sn",
          placeholderEn: "Enter Sn",
        },
      ],
    },
    {
      id: "xtr",
      nameHe: "היגב שנאי",
      nameEn: "Transformer Reactance",
      formula: `
        <div class="equation-content">
          <span class="equation-variable"><i>X</i></span><sub>Tr</sub>
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
              <span class="equation-variable">S</span><sub>n</sub>
            </div>
          </div>
        </div>
      `,
      inputs: [
        {
          id: "ux",
          labelHe: "הרכיב הריאקטיבי של מתח הקצר (Ux%) [%]:",
          labelEn: "Reactive component of short-circuit voltage (Ux%) [%]:",
          placeholderHe: "הזן Ux%",
          placeholderEn: "Enter Ux%",
        },
        {
          id: "sn",
          labelHe: "הספק נקוב של השנאי (Sn) [kVA]:",
          labelEn: "Nominal rated power (Sn) [kVA]:",
          placeholderHe: "הזן Sn",
          placeholderEn: "Enter Sn",
        },
      ],
    },
  ]

  // Common Un input (always needed)
  const commonSection = document.createElement("div")
  commonSection.className = "common-inputs"

  const unLabel = document.createElement("label")
  unLabel.textContent =
    currentLang === "he" ? "מתח בנקודת הקצר (Un) [V]:" : "Nominal voltage at short circuit point (Un) [V]:"
  commonSection.appendChild(unLabel)

  const unInput = document.createElement("input")
  unInput.type = "number"
  unInput.id = `ztr-${index}-un`
  unInput.step = "0.1"
  unInput.placeholder = currentLang === "he" ? "הזן Un" : "Enter Un"
  unInput.value = document.getElementById("nominal-voltage")?.value || ""
  commonSection.appendChild(unInput)

  equationsContainer.appendChild(commonSection)

  // Create equation selection sections
  equations.forEach((equation) => {
    const equationSection = document.createElement("div")
    equationSection.className = "equation-section"

    // Checkbox and equation name
    const headerDiv = document.createElement("div")
    headerDiv.className = "equation-header"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = `ztr-${index}-${equation.id}-enabled`
    checkbox.onchange = () => handleEquationToggle(index, equation.id)

    const label = document.createElement("label")
    label.htmlFor = checkbox.id
    label.textContent = currentLang === "he" ? equation.nameHe : equation.nameEn

    headerDiv.appendChild(checkbox)
    headerDiv.appendChild(label)
    equationSection.appendChild(headerDiv)

    // Formula display - now using the improved HTML format
    const formulaDiv = document.createElement("div")
    formulaDiv.className = "equation-formula"
    formulaDiv.innerHTML = equation.formula
    equationSection.appendChild(formulaDiv)

    // Input fields (hidden by default)
    const inputsDiv = document.createElement("div")
    inputsDiv.className = "equation-inputs"
    inputsDiv.id = `ztr-${index}-${equation.id}-inputs`
    inputsDiv.style.display = "none"

    equation.inputs.forEach((input) => {
      // Skip Sn if already created
      const inputId = `ztr-${index}-${input.id}`
      if (document.getElementById(inputId)) return

      const inputLabel = document.createElement("label")
      inputLabel.textContent = currentLang === "he" ? input.labelHe : input.labelEn
      inputsDiv.appendChild(inputLabel)

      const inputField = document.createElement("input")
      inputField.type = "number"
      inputField.id = inputId
      inputField.step = input.id === "sn" ? "1" : "0.1"
      inputField.placeholder = currentLang === "he" ? input.placeholderHe : input.placeholderEn
      inputsDiv.appendChild(inputField)
    })

    equationSection.appendChild(inputsDiv)
    equationsContainer.appendChild(equationSection)
  })

  container.appendChild(equationsContainer)
}

function getSelectedEquations(index) {
  const rtrZeroMode = document.getElementById(`ztr-${index}-rtr-zero`)?.checked || false
  const equationIds = rtrZeroMode ? ["ztr", "xtr"] : ["ztr", "rtr_losses", "rtr_voltage", "xtr"]

  return equationIds.filter((eqId) => {
    const checkbox = document.getElementById(`ztr-${index}-${eqId}-enabled`)
    return checkbox && checkbox.checked
  })
}

function updateEquationAvailability(index) {
  const rtrZeroMode = document.getElementById(`ztr-${index}-rtr-zero`)?.checked || false
  const selectedEquations = getSelectedEquations(index)
  const equationIds = rtrZeroMode ? ["ztr", "xtr"] : ["ztr", "rtr_losses", "rtr_voltage", "xtr"]

  equationIds.forEach((eqId) => {
    const checkbox = document.getElementById(`ztr-${index}-${eqId}-enabled`)
    const section = checkbox?.closest(".equation-section")

    if (!checkbox || !section) return

    // Skip if this equation is already checked
    if (checkbox.checked) return

    let shouldDisable = false

    if (rtrZeroMode) {
      // In RTr = 0 mode: disable if one equation is already selected
      shouldDisable = selectedEquations.length >= 1
    } else {
      // In normal mode: disable if 2 equations are already selected
      shouldDisable = selectedEquations.length >= 2
    }

    // Apply disabled state
    checkbox.disabled = shouldDisable
    if (shouldDisable) {
      section.classList.add("equation-disabled")
    } else {
      section.classList.remove("equation-disabled")
    }
  })
}

function handleEquationToggle(index, equationId) {
  const rtrZeroMode = document.getElementById(`ztr-${index}-rtr-zero`)?.checked || false
  const currentCheckbox = document.getElementById(`ztr-${index}-${equationId}-enabled`)

  if (currentCheckbox.checked) {
    if (rtrZeroMode && (equationId === "ztr" || equationId === "xtr")) {
      // In RTr = 0 mode, when ZTr or XTr is checked, uncheck the other
      const otherEquationId = equationId === "ztr" ? "xtr" : "ztr"
      const otherCheckbox = document.getElementById(`ztr-${index}-${otherEquationId}-enabled`)

      if (otherCheckbox && otherCheckbox.checked) {
        otherCheckbox.checked = false
        toggleEquationInputs(index, otherEquationId)
      }
    } else if (!rtrZeroMode && (equationId === "rtr_losses" || equationId === "rtr_voltage")) {
      // In normal mode, when one RTr equation is checked, uncheck the other RTr equation
      const otherRtrEquationId = equationId === "rtr_losses" ? "rtr_voltage" : "rtr_losses"
      const otherRtrCheckbox = document.getElementById(`ztr-${index}-${otherRtrEquationId}-enabled`)

      if (otherRtrCheckbox && otherRtrCheckbox.checked) {
        otherRtrCheckbox.checked = false
        toggleEquationInputs(index, otherRtrEquationId)
      }
    }
  }

  // Always toggle the current equation inputs
  toggleEquationInputs(index, equationId)

  // Update availability of other equations
  updateEquationAvailability(index)
}

function toggleEquationInputs(index, equationId) {
  const checkbox = document.getElementById(`ztr-${index}-${equationId}-enabled`)
  const inputsDiv = document.getElementById(`ztr-${index}-${equationId}-inputs`)

  if (checkbox.checked) {
    inputsDiv.style.display = "block"
  } else {
    inputsDiv.style.display = "none"
  }
}

function calculateTransformerImpedance(index) {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Get common values
  const un = Number.parseFloat(document.getElementById(`ztr-${index}-un`)?.value)

  if (isNaN(un) || un <= 0) {
    const message = currentLang === "he" ? "אנא הזן מתח נומינלי תקין" : "Please enter a valid nominal voltage"
    alert(message)
    return
  }

  // Check if RTr = 0 mode is enabled
  const rtrZeroMode = document.getElementById(`ztr-${index}-rtr-zero`)?.checked || false
  const selectedEquations = getSelectedEquations(index)

  // Validation based on mode
  if (rtrZeroMode) {
    if (selectedEquations.length !== 1) {
      const message =
        currentLang === "he"
          ? "אנא בחר משוואה אחת בלבד (ZTr או XTr)"
          : "Please select exactly one equation (ZTr or XTr)"
      alert(message)
      return
    }
  } else {
    if (selectedEquations.length !== 2) {
      const message = currentLang === "he" ? "אנא בחר בדיוק 2 משוואות" : "Please select exactly 2 equations"
      alert(message)
      return
    }

    // Check that only one RTr equation is selected
    const rtrEquationsSelected = selectedEquations.filter((eq) => eq === "rtr_losses" || eq === "rtr_voltage")
    if (rtrEquationsSelected.length > 1) {
      const message =
        currentLang === "he"
          ? "אנא בחר רק משוואת RTr אחת (מהפסדי נחושת או מרכיב אקטיבי)"
          : "Please select only one RTr equation (copper losses or resistive component)"
      alert(message)
      return
    }
  }

  // Calculate individual components
  const results = {}
  let hasError = false

  selectedEquations.forEach((eqId) => {
    const result = calculateEquationValue(index, eqId, un)
    if (result.error) {
      alert(result.error)
      hasError = true
      return
    }
    results[eqId] = result.value
  })

  if (hasError) return

  // Determine final ZTr, RTr, XTr values
  const finalResults = rtrZeroMode
    ? determineFinalImpedanceValuesRtrZero(results, selectedEquations, currentLang)
    : determineFinalImpedanceValues(results, selectedEquations, currentLang)

  if (finalResults.error) {
    alert(finalResults.error)
    return
  }

  // Use the final impedance value directly
  const finalImpedance = finalResults.magnitude
  const details = finalResults.details

  // Display results
  displayTransformerResult(index, finalResults, finalImpedance, details, currentLang, translations, rtrZeroMode)

  // Register with main calculator (convert to ohms for the main calculation)
  const realPartOhms = finalResults.isRtrZero ? 0 : finalResults.rtr / 1000
  const imagPartOhms = finalResults.xtr / 1000
  const magnitudeOhms = finalImpedance / 1000

  window.CableApp.registerImpedanceCalculation("ZTR", index, magnitudeOhms, details, realPartOhms, imagPartOhms)

  // Mark as calculated
  const calculateBtn = document.getElementById(`calculate-ztr-${index}-btn`)
  if (calculateBtn) calculateBtn.disabled = true

  const section = document.getElementById(`ztr-${index}-inputs`)
  if (section) section.classList.add("calculated")
}

function calculateEquationValue(index, equationId, un) {
  switch (equationId) {
    case "ztr":
      const uk = Number.parseFloat(document.getElementById(`ztr-${index}-uk`)?.value)
      const sn_ztr = Number.parseFloat(document.getElementById(`ztr-${index}-sn`)?.value)

      if (isNaN(uk) || isNaN(sn_ztr) || uk <= 0 || sn_ztr <= 0) {
        return { error: "Invalid values for ZTr calculation" }
      }

      // Multiply by 1000 to get milliohms, and multiply sn_ztr by 1000 to convert from kVA to VA
      return { value: (uk * un * un * 1000) / (100 * sn_ztr * 1000) }

    case "rtr_losses":
      const pcun = Number.parseFloat(document.getElementById(`ztr-${index}-pcun`)?.value)
      const sn_rtr1 = Number.parseFloat(document.getElementById(`ztr-${index}-sn`)?.value)

      if (isNaN(pcun) || isNaN(sn_rtr1) || pcun <= 0 || sn_rtr1 <= 0) {
        return { error: "Invalid values for RTr (losses) calculation" }
      }

      // Multiply by 1000 to get milliohms, and multiply sn_rtr1 by 1000 to convert from kVA to VA
      return { value: (pcun * un * un * 1000) / (sn_rtr1 * 1000 * (sn_rtr1 * 1000)) }

    case "rtr_voltage":
      const ur = Number.parseFloat(document.getElementById(`ztr-${index}-ur`)?.value)
      const sn_rtr2 = Number.parseFloat(document.getElementById(`ztr-${index}-sn`)?.value)

      if (isNaN(ur) || isNaN(sn_rtr2) || ur <= 0 || sn_rtr2 <= 0) {
        return { error: "Invalid values for RTr (voltage) calculation" }
      }

      // Multiply by 1000 to get milliohms, and multiply sn_rtr2 by 1000 to convert from kVA to VA
      return { value: (ur * un * un * 1000) / (100 * sn_rtr2 * 1000) }

    case "xtr":
      const ux = Number.parseFloat(document.getElementById(`ztr-${index}-ux`)?.value)
      const sn_xtr = Number.parseFloat(document.getElementById(`ztr-${index}-sn`)?.value)

      if (isNaN(ux) || isNaN(sn_xtr) || ux <= 0 || sn_xtr <= 0) {
        return { error: "Invalid values for XTr calculation" }
      }

      // Multiply by 1000 to get milliohms, and multiply sn_xtr by 1000 to convert from kVA to VA
      return { value: (ux * un * un * 1000) / (100 * sn_xtr * 1000) }

    default:
      return { error: "Unknown equation type" }
  }
}

function determineFinalImpedanceValuesRtrZero(results, selectedEquations, currentLang) {
  let ztr = null,
    xtr = null
  const rtr = 0 // RTr = 0 by definition

  // Get direct values
  if (results.ztr) ztr = results.ztr
  if (results.xtr) xtr = results.xtr

  // In RTr = 0 mode, ZTr = XTr (magnitude)
  if (ztr && !xtr) {
    xtr = ztr
  } else if (xtr && !ztr) {
    ztr = xtr
  }

  if (!ztr || !xtr) {
    return { error: currentLang === "he" ? "לא ניתן לחשב את הערכים" : "Cannot calculate values" }
  }

  return {
    ztr,
    rtr: 0,
    xtr,
    magnitude: ztr, // Since RTr = 0, |ZTr| = XTr
    details: `ZTr=${ztr.toFixed(3)}mΩ, RTr=0mΩ, XTr=${xtr.toFixed(3)}mΩ`,
    cartesian: `j${xtr.toFixed(3)}`, // Pure reactive in milliohms
    isRtrZero: true,
  }
}

function determineFinalImpedanceValues(results, selectedEquations, currentLang) {
  let ztr = null,
    rtr = null,
    xtr = null

  // Get direct values
  if (results.ztr) ztr = results.ztr
  if (results.rtr_losses) rtr = results.rtr_losses
  if (results.rtr_voltage) rtr = results.rtr_voltage
  if (results.xtr) xtr = results.xtr

  // Calculate missing values
  if (ztr && rtr && !xtr) {
    // XTr = √(ZTr² - RTr²)
    if (ztr * ztr < rtr * rtr) {
      return { error: currentLang === "he" ? "שגיאה: ZTr < RTr" : "Error: ZTr < RTr" }
    }
    xtr = Math.sqrt(ztr * ztr - rtr * rtr)
  } else if (ztr && xtr && !rtr) {
    // RTr = √(ZTr² - XTr²)
    if (ztr * ztr < xtr * xtr) {
      return { error: currentLang === "he" ? "שגיאה: ZTr < XTr" : "Error: ZTr < XTr" }
    }
    rtr = Math.sqrt(ztr * ztr - xtr * xtr)
  } else if (rtr && xtr && !ztr) {
    // ZTr = √(RTr² + XTr²)
    ztr = Math.sqrt(rtr * rtr + xtr * xtr)
  }

  if (!ztr || !rtr || !xtr) {
    return { error: currentLang === "he" ? "לא ניתן לחשב את כל הערכים" : "Cannot calculate all values" }
  }

  return {
    ztr,
    rtr,
    xtr,
    magnitude: ztr,
    details: `ZTr=${ztr.toFixed(3)}mΩ, RTr=${rtr.toFixed(3)}mΩ, XTr=${xtr.toFixed(3)}mΩ`,
    cartesian: `${rtr.toFixed(3)} + j${xtr.toFixed(3)}`, // In milliohms
    isRtrZero: false,
  }
}

function displayTransformerResult(
  index,
  calculationResults,
  finalImpedance,
  details,
  currentLang,
  translations,
  rtrZeroMode = false,
) {
  const resultDiv = document.getElementById(`ztr-${index}-result`)
  if (!resultDiv) return

  const componentName = currentLang === "he" ? "עכבת שנאי" : "Transformer Impedance"
  const indexText = index > 1 ? ` ${index}` : ""

  const modeText = rtrZeroMode ? (currentLang === "he" ? " (אידיאלי)" : " (Ideal)") : ""

  const confirmationHTML = `
    <div class="calculation-confirmation">
      <p><strong>✓ ${componentName}${indexText}${modeText} ${currentLang === "he" ? "חושב" : "calculated"}</strong></p>
      <p class="ltr-content"><strong>ZTr = ${calculationResults.cartesian} mΩ</strong></p>
      <p class="ltr-content">|ZTr| = ${finalImpedance.toFixed(3)} mΩ</p>
      <p class="ltr-content">${details}</p>
    </div>
  `

  resultDiv.innerHTML = confirmationHTML
}

// Expose functions to global scope
window.CableApp.createTransformerInputSection = createTransformerInputSection
window.CableApp.calculateTransformerImpedance = calculateTransformerImpedance

// Make functions available globally for HTML onclick handlers
window.calculateTransformerImpedance = calculateTransformerImpedance
window.toggleEquationInputs = toggleEquationInputs
window.toggleRtrZeroMode = toggleRtrZeroMode
window.handleEquationToggle = handleEquationToggle

console.log("Enhanced transformer impedance module with RTr=0 option loaded successfully!")
