// Current language
let currentLang = "he" // Default to Hebrew

// Initialize the global namespace
window.CableApp = window.CableApp || {}

// Language toggle functionality
function toggleLanguage() {
  currentLang = currentLang === "he" ? "en" : "he"
  localStorage.setItem("lang", currentLang)
  updateLanguage()
}

function updateLanguage() {
  // Get translations from the global namespace
  const translations = window.CableApp?.translations

  // Safety check for translations
  if (!translations || !translations[currentLang]) {
    console.error("Translations not loaded properly")
    return
  }

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
  if (langToggle) {
    langToggle.textContent = isHebrew ? "EN" : "עב"
  }

  // Elements that use textContent (regular text)
  const textElements = [
    { id: "app-title", key: "appTitle" },
    { id: "rx-finder-title", key: "rxFinderTitle" },
    { id: "material-label", key: "materialLabel" },
    { id: "copper-label", key: "copper" },
    { id: "aluminium-label", key: "aluminium" },
    { id: "core-label", key: "coreLabel" },
    { id: "single-label", key: "single" },
    { id: "multi-label", key: "multi" },
    { id: "area-label", key: "areaLabel" },
    { id: "find-btn", key: "findBtn" },

    // Calculator buttons
    { id: "cable-impedance-btn", key: "cableImpedanceBtn" },
    { id: "voltage-drop-btn", key: "voltageDropBtn" },
    { id: "short-circuit-1ph-btn", key: "shortCircuit1PhBtn" },
    { id: "short-circuit-3ph-btn", key: "shortCircuit3PhBtn" },
    { id: "show-hide-all-btn", key: "showHideAllBtn" },
    { id: "rx-finder-btn", key: "rxFinderBtn" },

    { id: "calc-title", key: "calcTitle" },
    { id: "impedance-legend", key: "impedanceLegend" },
    { id: "length-legend", key: "lengthLegend" },
    { id: "resistance-legend", key: "resistanceLegend" },
    { id: "reactance-legend", key: "reactanceLegend" },
    { id: "cables-legend", key: "cablesLegend" },
    { id: "r-value-label", key: "rValueLabel" },
    { id: "x-value-label", key: "xValueLabel" },
    { id: "cable-length-label", key: "cableLengthLabel" },
    { id: "num-cables-label", key: "numCablesLabel" },
    { id: "copy-r-btn", key: "copyBtn" },
    { id: "copy-x-btn", key: "copyBtn" },
    { id: "calc-btn", key: "calcBtn" },

    // Voltage Drop Calculator
    { id: "voltage-drop-title", key: "voltageDropTitle" },
    { id: "vd-voltage-drop-legend", key: "voltageDropLegend" },
    { id: "vd-k-factor-legend", key: "kFactorLegend" },
    { id: "vd-load-current-legend", key: "loadCurrentLegend" },
    { id: "vd-distance-legend", key: "distanceLegend" },
    { id: "vd-conductors-legend", key: "conductorsLegend" },
    { id: "vd-phase-angle-legend", key: "phaseAngleLegend" },

    // New voltage drop total equation elements
    { id: "vd-total-voltage-legend", key: "totalVoltageLegend" },
    { id: "vd-partial-voltage-legend", key: "partialVoltageLegend" },
    { id: "num-calculations-label", key: "numCalculationsLabel" },

    { id: "phase-type-label", key: "phaseTypeLabel" },
    { id: "single-phase-label", key: "singlePhase" },
    { id: "three-phase-label", key: "threePhase" },
    { id: "load-current-label", key: "loadCurrentLabel" },
    { id: "distance-label", key: "distanceLabel" },
    { id: "num-conductors-label", key: "numConductorsLabel" },
    { id: "vd-r-value-label", key: "vdRValueLabel" },
    { id: "vd-x-value-label", key: "vdXValueLabel" },
    { id: "power-factor-label", key: "powerFactorLabel" },
    { id: "phase-angle-label", key: "phaseAngleLabel" },
    { id: "copy-vd-r-btn", key: "copyBtn" },
    { id: "copy-vd-x-btn", key: "copyBtn" },
    { id: "calculate-vd-btn", key: "calculateVDBtn" },
    { id: "angle-or-text", key: "orText" },
    { id: "cancel-loop-btn", key: "cancelLoop" },

    // Three-phase short circuit calculator (text only)
    { id: "short-circuit-3ph-title", key: "shortCircuit3PhTitle" },
    { id: "nominal-voltage-label", key: "nominalVoltageLabel" },
    { id: "zk3ph-value-label", key: "zk3phValueLabel" },
    { id: "calculate-zk3ph-btn", key: "calculateZk3phBtn" },
    { id: "calculate-sc3ph-btn", key: "calculateSc3phBtn" },
    { id: "zk3ph-modal-title", key: "zk3phModalTitle" },
    { id: "zk3ph-instructions", key: "zk3phInstructions" },
    { id: "transformers-title", key: "transformersTitle" },
    { id: "cables-title", key: "cablesTitle" },
    { id: "generators-title", key: "generatorsTitle" },
    { id: "motors-title", key: "motorsTitle" },
    { id: "transformer-label", key: "transformerLabel" },
    { id: "cable-label", key: "cableLabel" },
    { id: "generator-label", key: "generatorLabel" },
    { id: "motor-label", key: "motorLabel" },
    { id: "calculate-zk3ph-modal-btn", key: "calculateZk3phModalBtn" },
    { id: "cancel-zk3ph-btn", key: "cancelZk3phBtn" },
    { id: "zk3ph-selection-title", key: "impedanceSelectionTitle" },
    { id: "ztr-label", key: "ztrLabel" },
    { id: "zl-label", key: "zlLabel" },
    { id: "zsystem-label", key: "zsystemLabel" },
    { id: "zg-label", key: "zgLabel" },
    { id: "ztr-transformers-label", key: "ztrTransformersLabel" },
    { id: "zl-cables-label", key: "zlCablesLabel" },
    { id: "zg-generators-label", key: "zgGeneratorsLabel" },
    { id: "confirm-impedance-btn", key: "confirmImpedanceBtn" },
  ]

  // Elements that use innerHTML (contain HTML like subscripts)
  const htmlElements = [
    { id: "sc3ph-current-legend", key: "sc3phCurrentLegend" },
    { id: "sc3ph-voltage-legend", key: "sc3phVoltageLegend" },
    { id: "sc3ph-impedance-legend", key: "sc3phImpedanceLegend" },
  ]

  // Update text elements
  textElements.forEach(({ id, key }) => {
    const element = document.getElementById(id)
    if (element) {
      element.textContent = translations[currentLang][key]
    }
  })

  // Update HTML elements
  htmlElements.forEach(({ id, key }) => {
    const element = document.getElementById(id)
    if (element) {
      element.innerHTML = translations[currentLang][key]
    }
  })

  // Update placeholders
  const surface = document.getElementById("surface")
  if (surface) surface.placeholder = translations[currentLang].areaPlaceholder

  const rValue = document.getElementById("r-value")
  if (rValue) rValue.placeholder = translations[currentLang].rValuePlaceholder

  const xValue = document.getElementById("x-value")
  if (xValue) xValue.placeholder = translations[currentLang].xValuePlaceholder

  const cableLength = document.getElementById("cable-length")
  if (cableLength) cableLength.placeholder = translations[currentLang].cableLengthPlaceholder

  const numCables = document.getElementById("num-cables")
  if (numCables) numCables.placeholder = translations[currentLang].numCablesPlaceholder

  // New voltage drop placeholders
  const numCalculations = document.getElementById("num-calculations")
  if (numCalculations) numCalculations.placeholder = translations[currentLang].numCalculationsPlaceholder

  // Voltage Drop placeholders
  const loadCurrent = document.getElementById("load-current")
  if (loadCurrent) loadCurrent.placeholder = translations[currentLang].loadCurrentPlaceholder

  const distance = document.getElementById("distance")
  if (distance) distance.placeholder = translations[currentLang].distancePlaceholder

  const numConductors = document.getElementById("num-conductors")
  if (numConductors) numConductors.placeholder = translations[currentLang].numConductorsPlaceholder

  const powerFactor = document.getElementById("power-factor")
  if (powerFactor) powerFactor.placeholder = translations[currentLang].powerFactorPlaceholder

  const phaseAngle = document.getElementById("phase-angle")
  if (phaseAngle) phaseAngle.placeholder = translations[currentLang].phaseAnglePlaceholder

  // Three-phase short circuit placeholders
  const nominalVoltage = document.getElementById("nominal-voltage")
  if (nominalVoltage) nominalVoltage.placeholder = translations[currentLang].nominalVoltagePlaceholder

  const zk3 = nominalVoltage // Assign nominalVoltage to zk3 to resolve the error. This might need adjustment based on intended logic.
  nominalVoltage.placeholder = translations[currentLang].nominalVoltagePlaceholder

  const zk3phValue = document.getElementById("zk3ph-value")
  if (zk3phValue) zk3phValue.placeholder = translations[currentLang].zk3phValuePlaceholder

  // Update document title
  document.title = isHebrew ? "תכנון מעגל חשמלי" : "Electrical System Design"

  // If there are results displayed, update them (only if values exist)
  if (window.CableApp.updateResults && window.CableApp.lastFoundR && window.CableApp.lastFoundR() !== null) {
    window.CableApp.updateResults()
  }

  // If there's an impedance table, update it
  const impedanceOutput = document.getElementById("impedance-output")
  if (
    impedanceOutput &&
    impedanceOutput.innerHTML.trim() !== "" &&
    window.CableApp.updateImpedanceTable &&
    window.CableApp.lastCalculatedValues
  ) {
    window.CableApp.updateImpedanceTable(window.CableApp.lastCalculatedValues())
  }

  // If there's a voltage drop table, update it
  const voltageDropOutput = document.getElementById("voltage-drop-output")
  if (
    voltageDropOutput &&
    voltageDropOutput.innerHTML.trim() !== "" &&
    window.CableApp.updateVoltageDropResults &&
    window.CableApp.lastVoltageDropValues
  ) {
    window.CableApp.updateVoltageDropResults(window.CableApp.lastVoltageDropValues())
  }

  // If there's a short circuit results table, update it
  const shortCircuitOutput = document.getElementById("short-circuit-3ph-output")
  if (
    shortCircuitOutput &&
    shortCircuitOutput.innerHTML.trim() !== "" &&
    window.CableApp.updateShortCircuitResults &&
    window.CableApp.lastShortCircuitValues
  ) {
    window.CableApp.updateShortCircuitResults(window.CableApp.lastShortCircuitValues())
  }

  // Update dynamically created content
  updateDynamicContent()

  // Update any open calculation method modal
  updateCalculationMethodModal()
}

// Update dynamically created impedance sections
function updateDynamicContent() {
  // Update dynamically created impedance sections
  if (window.CableApp && window.CableApp.updateDynamicImpedanceSections) {
    window.CableApp.updateDynamicImpedanceSections()
  }
}

// Update calculation method modal if it's open
function updateCalculationMethodModal() {
  const modal = document.getElementById("calculation-method-modal")
  if (!modal) return

  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  if (!translations || !translations[currentLang]) return

  // Update modal title
  const modalTitle = modal.querySelector(".modal-header h3")
  if (modalTitle) {
    modalTitle.textContent = translations[currentLang].calculationMethodTitle || "בחר שיטת חישוב"
  }

  // Update instructions
  const instructions = modal.querySelector(".modal-body p")
  if (instructions) {
    instructions.textContent = translations[currentLang].calculationMethodInstructions || "בחר את שיטת החישוב המתאימה:"
  }

  // Update option titles
  const option1Title = modal.querySelector("#standard-calculation + label .option-title")
  if (option1Title) {
    option1Title.textContent = translations[currentLang].standardCalculation || "חישוב סטנדרטי"
  }

  const option2Title = modal.querySelector("#safety-calculation + label .option-title")
  if (option2Title) {
    option2Title.textContent = translations[currentLang].safetyCalculation || "חישוב עם מקדם בטיחות"
  }

  // Update option descriptions
  const option1Desc = modal.querySelector("#standard-calculation + label .option-description")
  if (option1Desc) {
    option1Desc.textContent =
      translations[currentLang].standardCalculationDesc || "חישוב זרם קצר בסיסי ללא מקדמי בטיחות"
  }

  const option2Desc = modal.querySelector("#safety-calculation + label .option-description")
  if (option2Desc) {
    option2Desc.textContent =
      translations[currentLang].safetyCalculationDesc || "חישוב זרם קצר עם מקדם בטיחות 1.1 (מומלץ לתכנון)"
  }

  // Update button texts
  const calculateBtn = modal.querySelector(".modal-buttons button:first-child")
  if (calculateBtn) {
    calculateBtn.textContent = translations[currentLang].calculateBtn || "חשב"
  }

  const cancelBtn = modal.querySelector(".modal-buttons button:last-child")
  if (cancelBtn) {
    cancelBtn.textContent = translations[currentLang].cancelBtn || "ביטול"
  }
}

function initializeLanguage() {
  // Check for saved language preference
  const savedLang = localStorage.getItem("lang")
  if (savedLang) {
    currentLang = savedLang
  } else {
    // Default to Hebrew if no preference is saved
    currentLang = "he"
  }
  updateLanguage()
}

// Expose everything to global scope
window.CableApp.toggleLanguage = toggleLanguage
window.CableApp.updateLanguage = updateLanguage
window.CableApp.initializeLanguage = initializeLanguage
window.CableApp.currentLang = () => currentLang
window.CableApp.getCurrentLang = () => currentLang
window.CableApp.getTranslations = () => window.CableApp?.translations

console.log("Enhanced translation module loaded successfully!")
