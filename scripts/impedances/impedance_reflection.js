// Impedance Reflection Module
window.CableApp = window.CableApp || {}

// Create the UI for impedance reflection
function createImpedanceReflectionSection(index, type, currentLang, translations) {
  console.log(`Creating reflection section for ${type}-${index}`)

  const section = document.createElement("div")
  section.className = "impedance-reflection-section"
  section.id = `${type}-${index}-reflection-section`

  // Checkbox to enable/disable reflection
  const checkboxContainer = document.createElement("div")
  checkboxContainer.className = "reflection-checkbox-container"

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.id = `${type}-${index}-reflection-enabled`
  checkbox.onchange = () => toggleReflectionInputs(type, index)

  const label = document.createElement("label")
  label.htmlFor = checkbox.id
  label.textContent = currentLang === "he" ? "שיקוף עכבה" : "Impedance Reflection"

  checkboxContainer.appendChild(checkbox)
  checkboxContainer.appendChild(label)
  section.appendChild(checkboxContainer)

  // Input fields container (hidden by default)
  const inputsContainer = document.createElement("div")
  inputsContainer.className = "reflection-inputs-container"
  inputsContainer.id = `${type}-${index}-reflection-inputs`
  inputsContainer.style.display = "none"

  // Original voltage level (Un)
  const unLabel = document.createElement("label")
  unLabel.textContent = currentLang === "he" ? "מתח מקורי (Un) [V]:" : "Original Voltage (Un) [V]:"
  inputsContainer.appendChild(unLabel)

  const unInput = document.createElement("input")
  unInput.type = "number"
  unInput.id = `${type}-${index}-reflection-un`
  unInput.step = "0.1"
  unInput.placeholder = currentLang === "he" ? "הזן Un" : "Enter Un"
  unInput.value = document.getElementById("nominal-voltage")?.value || ""
  inputsContainer.appendChild(unInput)

  // New voltage level (U'n)
  const unpLabel = document.createElement("label")
  unpLabel.textContent = currentLang === "he" ? "מתח חדש (U'n) [V]:" : "New Voltage (U'n) [V]:"
  inputsContainer.appendChild(unpLabel)

  const unpInput = document.createElement("input")
  unpInput.type = "number"
  unpInput.id = `${type}-${index}-reflection-unp`
  unpInput.step = "0.1"
  unpInput.placeholder = currentLang === "he" ? "הזן U'n" : "Enter U'n"
  inputsContainer.appendChild(unpInput)

  section.appendChild(inputsContainer)

  return section
}

// Toggle visibility of reflection inputs
function toggleReflectionInputs(type, index) {
  const checkbox = document.getElementById(`${type}-${index}-reflection-enabled`)
  const inputsContainer = document.getElementById(`${type}-${index}-reflection-inputs`)

  if (checkbox && inputsContainer) {
    inputsContainer.style.display = checkbox.checked ? "block" : "none"
  }
}

// Apply impedance reflection if enabled
function applyImpedanceReflection(index, type, impedanceValue, currentLang, translations) {
  const checkbox = document.getElementById(`${type}-${index}-reflection-enabled`)

  if (checkbox && checkbox.checked) {
    const un = Number.parseFloat(document.getElementById(`${type}-${index}-reflection-un`).value)
    const unp = Number.parseFloat(document.getElementById(`${type}-${index}-reflection-unp`).value)

    if (!isNaN(un) && !isNaN(unp) && un > 0 && unp > 0) {
      // Calculate transformation factor: (U'n/Un)²
      const factor = (unp / un) * (unp / un)

      // Apply transformation: Z' = Z × (U'n/Un)²
      const transformedImpedance = impedanceValue * factor

      return {
        transformedImpedance,
        reflectionDetails: `${currentLang === "he" ? "שיקוף" : "Reflection"}: ${un}V → ${unp}V, ${currentLang === "he" ? "מקדם" : "Factor"}: ${factor.toFixed(4)}`,
      }
    } else {
      // Alert if values are invalid
      const message =
        currentLang === "he"
          ? "אנא הזן ערכי מתח תקינים לשיקוף העכבה"
          : "Please enter valid voltage values for impedance reflection"
      alert(message)
      return null
    }
  }

  // Return original impedance if reflection is not enabled
  return null
}

// Expose functions to global scope
window.CableApp.createImpedanceReflectionSection = createImpedanceReflectionSection
window.CableApp.toggleReflectionInputs = toggleReflectionInputs
window.CableApp.applyImpedanceReflection = applyImpedanceReflection

// Make functions available globally for HTML onclick handlers
window.toggleReflectionInputs = toggleReflectionInputs

console.log("Impedance reflection module loaded successfully!")
