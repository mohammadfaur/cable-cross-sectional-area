// Theme toggle functionality
function initializeTheme() {
  const themeSwitch = document.getElementById("theme-switch")

  // Set initial state based on HTML class
  themeSwitch.checked = document.documentElement.classList.contains("light-mode")

  themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
      document.documentElement.classList.remove("dark-mode")
      document.documentElement.classList.add("light-mode")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.remove("light-mode")
      document.documentElement.classList.add("dark-mode")
      localStorage.setItem("theme", "dark")
    }
  })

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark-mode")
      document.documentElement.classList.add("light-mode")
      themeSwitch.checked = true
    } else {
      document.documentElement.classList.remove("light-mode")
      document.documentElement.classList.add("dark-mode")
      themeSwitch.checked = false
    }
  }
}

// Expose functions to global scope
window.CableApp = window.CableApp || {}
window.CableApp.initializeTheme = initializeTheme
