// Initialize the global namespace
window.CableApp = window.CableApp || {}

// Main application coordinator
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme functionality
  if (window.CableApp && window.CableApp.initializeTheme) {
    window.CableApp.initializeTheme()
  }

  // Initialize language functionality
  if (window.CableApp && window.CableApp.initializeLanguage) {
    window.CableApp.initializeLanguage()
  }

  // Initialize calculator sections
  if (window.CableApp && window.CableApp.initializeSections) {
    window.CableApp.initializeSections()
  }

  // Set up language toggle event listener
  const langToggle = document.getElementById("lang-toggle")
  if (langToggle) {
    langToggle.addEventListener("click", (e) => {
      e.preventDefault()
      if (window.CableApp && window.CableApp.toggleLanguage) {
        window.CableApp.toggleLanguage()
      }
    })
  }
})
