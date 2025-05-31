// Calculator section management
window.CableApp = window.CableApp || {}

// Track which sections are visible
const sectionStates = {
  "rx-finder-section": true, // R&X Finder visible by default
  "impedance-section": false,
  "voltage-drop-section": false,
  "short-circuit-1ph-section": false,
  "short-circuit-3ph-section": false,
}

// Toggle specific calculator section
function toggleCalculatorSection(sectionId) {
  const section = document.getElementById(sectionId)
  const buttonMap = {
    "rx-finder-section": "rx-finder-btn",
    "impedance-section": "cable-impedance-btn",
    "voltage-drop-section": "voltage-drop-btn",
    "short-circuit-1ph-section": "short-circuit-1ph-btn",
    "short-circuit-3ph-section": "short-circuit-3ph-btn",
  }

  if (section) {
    // Toggle the section visibility
    sectionStates[sectionId] = !sectionStates[sectionId]
    section.style.display = sectionStates[sectionId] ? "block" : "none"

    // Update button state
    const button = document.getElementById(buttonMap[sectionId])
    if (button) {
      if (sectionStates[sectionId]) {
        button.classList.add("active")
      } else {
        button.classList.remove("active")
      }
    }
  }
}

// Toggle show/hide all sections
function toggleAllSections() {
  const sections = Object.keys(sectionStates)
  const allVisible = sections.every((sectionId) => sectionStates[sectionId])

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      if (allVisible) {
        // Hide all sections
        sectionStates[sectionId] = false
        section.style.display = "none"
      } else {
        // Show all sections
        sectionStates[sectionId] = true
        section.style.display = "block"
      }
    }
  })

  // Update all button states
  const buttonMap = {
    "rx-finder-section": "rx-finder-btn",
    "impedance-section": "cable-impedance-btn",
    "voltage-drop-section": "voltage-drop-btn",
    "short-circuit-1ph-section": "short-circuit-1ph-btn",
    "short-circuit-3ph-section": "short-circuit-3ph-btn",
  }

  Object.entries(buttonMap).forEach(([sectionId, buttonId]) => {
    const button = document.getElementById(buttonId)
    if (button) {
      if (sectionStates[sectionId]) {
        button.classList.add("active")
      } else {
        button.classList.remove("active")
      }
    }
  })
}

// Initialize section states on page load
function initializeSections() {
  Object.entries(sectionStates).forEach(([sectionId, isVisible]) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.style.display = isVisible ? "block" : "none"
    }
  })

  // Set initial button states
  const buttonMap = {
    "rx-finder-section": "rx-finder-btn",
    "impedance-section": "cable-impedance-btn",
    "voltage-drop-section": "voltage-drop-btn",
    "short-circuit-1ph-section": "short-circuit-1ph-btn",
    "short-circuit-3ph-section": "short-circuit-3ph-btn",
  }

  Object.entries(buttonMap).forEach(([sectionId, buttonId]) => {
    const button = document.getElementById(buttonId)
    if (button && sectionStates[sectionId]) {
      button.classList.add("active")
    }
  })
}

// Expose functions globally
window.CableApp.toggleCalculatorSection = toggleCalculatorSection
window.CableApp.toggleAllSections = toggleAllSections
window.CableApp.initializeSections = initializeSections

// Make functions available for HTML onclick handlers
window.toggleCalculatorSection = toggleCalculatorSection
window.toggleAllSections = toggleAllSections

console.log("Calculator management loaded successfully!")
