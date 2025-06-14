// Cable resistance and reactance data
const data = {
  copper: {
    single: {
      1.5: [14.8, 0.168],
      2.5: [8.91, 0.156],
      4: [5.57, 0.143],
      6: [3.71, 0.135],
      10: [2.24, 0.119],
      16: [1.41, 0.112],
      25: [0.889, 0.106],
      35: [0.641, 0.101],
      50: [0.473, 0.101],
      70: [0.328, 0.0965],
      95: [0.236, 0.0975],
      120: [0.188, 0.0939],
      150: [0.153, 0.0928],
      185: [0.123, 0.0908],
      240: [0.0943, 0.0902],
      300: [0.0761, 0.0895],
    },
    multi: {
      1.5: [15.1, 0.118],
      2.5: [9.08, 0.109],
      4: [5.68, 0.101],
      6: [3.78, 0.0955],
      10: [2.27, 0.0861],
      16: [1.43, 0.0817],
      25: [0.907, 0.0813],
      35: [0.654, 0.0783],
      50: [0.483, 0.0779],
      70: [0.334, 0.0751],
      95: [0.241, 0.0762],
      120: [0.191, 0.074],
      150: [0.157, 0.0745],
      185: [0.125, 0.0742],
      240: [0.0966, 0.0752],
      300: [0.078, 0.075],
    },
  },
  aluminium: {
    single: {
      1.5: [24.384, 0.168],
      2.5: [14.68, 0.156],
      4: [9.177, 0.143],
      6: [6.112, 0.135],
      10: [3.691, 0.119],
      16: [2.323, 0.112],
      25: [1.465, 0.106],
      35: [1.056, 0.101],
      50: [0.779, 0.101],
      70: [0.54, 0.0965],
      95: [0.389, 0.0975],
      120: [0.31, 0.0939],
      150: [0.252, 0.0928],
      185: [0.203, 0.0908],
      240: [0.155, 0.0902],
      300: [0.125, 0.0895],
    },
    multi: {
      1.5: [24.878, 0.118],
      2.5: [14.96, 0.109],
      4: [9.358, 0.101],
      6: [6.228, 0.0955],
      10: [3.74, 0.0861],
      16: [2.356, 0.0817],
      25: [1.494, 0.0813],
      35: [1.077, 0.0783],
      50: [0.796, 0.0779],
      70: [0.55, 0.0751],
      95: [0.397, 0.0762],
      120: [0.315, 0.074],
      150: [0.259, 0.0745],
      185: [0.206, 0.0742],
      240: [0.159, 0.0752],
      300: [0.129, 0.075],
    },
  },
}

// Store the last found r and x values
let lastFoundR = null
let lastFoundX = null

// Initialize the global namespace
window.CableApp = window.CableApp || {}

function findRX() {
  const material = document.querySelector('input[name="material"]:checked').value
  const core = document.querySelector('input[name="core"]:checked').value
  const s = document.getElementById("surface").value
  const result = data[material][core][s]

  const output = document.getElementById("output")
  if (result) {
    lastFoundR = result[0]
    lastFoundX = result[1]
    updateResults()
  } else {
    lastFoundR = null
    lastFoundX = null
    setTimeout(() => {
      const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
      const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
      if (translations && translations[currentLang]) {
        output.innerHTML = translations[currentLang].noDataFound.replace("{0}", s)
      } else {
        output.innerHTML = `לא נמצאו נתונים עבור A = ${s} mm²`
      }
    }, 100)
  }
}

function updateResults() {
  const output = document.getElementById("output")
  if (!output || lastFoundR === null || lastFoundX === null) {
    return
  }

  setTimeout(() => {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
    const isHebrew = currentLang === "he"

    if (translations && translations[currentLang]) {
      if (isHebrew) {
        output.innerHTML = `<div class="result-content"><strong>${translations[currentLang].resistance}</strong> ${lastFoundR} Ω/km<br><strong>${translations[currentLang].reactance}</strong> ${lastFoundX} Ω/km</div>`
      } else {
        output.innerHTML = `<div class="ltr-content"><strong>${translations[currentLang].resistance}</strong> ${lastFoundR} Ω/km<br><strong>${translations[currentLang].reactance}</strong> ${lastFoundX} Ω/km</div>`
      }
    } else {
      // Hebrew fallback
      output.innerHTML = `<div class="result-content"><strong>התנגדות (r):</strong> ${lastFoundR} Ω/km<br><strong>היגב (x):</strong> ${lastFoundX} Ω/km</div>`
    }
  }, 100)
}

function copyRValue() {
  const rInput = document.getElementById("r-value")
  if (lastFoundR !== null) {
    rInput.value = lastFoundR
    highlightInput(rInput)
  } else {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
    const message =
      translations && translations[currentLang] ? translations[currentLang].findFirst : "אנא מצא ערכי r ו-x תחילה"
    alert(message)
  }
}

function copyXValue() {
  const xInput = document.getElementById("x-value")
  if (lastFoundX !== null) {
    xInput.value = lastFoundX
    highlightInput(xInput)
  } else {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
    const message =
      translations && translations[currentLang] ? translations[currentLang].findFirst : "אנא מצא ערכי r ו-x תחילה"
    alert(message)
  }
}

function highlightInput(inputElement) {
  inputElement.classList.add("highlight-input")
  setTimeout(() => {
    inputElement.classList.remove("highlight-input")
  }, 1000)
}

// Expose functions to global scope
window.CableApp.findRX = findRX
window.CableApp.updateResults = updateResults
window.CableApp.copyRValue = copyRValue
window.CableApp.copyXValue = copyXValue
window.CableApp.lastFoundR = () => lastFoundR
window.CableApp.lastFoundX = () => lastFoundX

// Make functions available globally for HTML onclick handlers
window.findRX = findRX
window.copyRValue = copyRValue
window.copyXValue = copyXValue
