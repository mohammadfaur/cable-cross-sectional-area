// Store the last calculated impedance values
let lastCalculatedValues = null

// Initialize the global namespace
window.CableApp = window.CableApp || {}

function calculateImpedance() {
  const r = Number.parseFloat(document.getElementById("r-value").value)
  const x = Number.parseFloat(document.getElementById("x-value").value)
  const length = Number.parseFloat(document.getElementById("cable-length").value)

  setTimeout(() => {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

    if (isNaN(r) || isNaN(x) || isNaN(length)) {
      const message =
        translations && translations[currentLang]
          ? translations[currentLang].enterValid
          : "אנא הזן מספרים תקינים עבור r, x ואורך כבל"
      alert(message)
      return
    }

    // Calculate impedance using the formula Z = L * (r + jx)
    const realPart = length * r
    const imagPart = length * x

    // Calculate magnitude and angle
    const magnitude = Math.sqrt(realPart * realPart + imagPart * imagPart)
    const angleRad = Math.atan2(imagPart, realPart)
    const angleDeg = angleRad * (180 / Math.PI)

    // Convert to milliohms
    const realPartMilliohm = realPart * 1000
    const imagPartMilliohm = imagPart * 1000
    const magnitudeMilliohm = magnitude * 1000

    // Store the calculated values for language switching
    lastCalculatedValues = {
      realPart,
      imagPart,
      magnitude,
      angleDeg,
      realPartMilliohm,
      imagPartMilliohm,
      magnitudeMilliohm,
    }

    updateImpedanceTable(lastCalculatedValues)
  }, 100)
}

function updateImpedanceTable(values) {
  const { realPart, imagPart, magnitude, angleDeg, realPartMilliohm, imagPartMilliohm, magnitudeMilliohm } = values
  const impedanceOutput = document.getElementById("impedance-output")

  if (!impedanceOutput) {
    return
  }

  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Format cartesian form
  let cartesianOhm = ""
  let cartesianMilliohm = ""

  if (realPart === 0 && imagPart === 0) {
    cartesianOhm = "0"
    cartesianMilliohm = "0"
  } else if (imagPart === 0) {
    cartesianOhm = `${realPart.toFixed(4)}`
    cartesianMilliohm = `${realPartMilliohm.toFixed(2)}`
  } else if (realPart === 0) {
    cartesianOhm = `j${imagPart.toFixed(4)}`
    cartesianMilliohm = `j${imagPartMilliohm.toFixed(2)}`
  } else {
    cartesianOhm = `${realPart.toFixed(4)} + j${imagPart.toFixed(4)}`
    cartesianMilliohm = `${realPartMilliohm.toFixed(2)} + j${imagPartMilliohm.toFixed(2)}`
  }

  // Format polar form
  const polarOhm = `${magnitude.toFixed(4)} ∠ ${angleDeg.toFixed(2)}°`
  const polarMilliohm = `${magnitudeMilliohm.toFixed(2)} ∠ ${angleDeg.toFixed(2)}°`

  // Create table output with proper language and LTR formatting
  let tableHTML = ""

  if (translations && translations[currentLang]) {
    tableHTML = `
      <table class="impedance-table">
        <thead>
          <tr>
            <th>${translations[currentLang].format}</th>
            <th>${translations[currentLang].ohms}</th>
            <th>${translations[currentLang].milliohms}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${translations[currentLang].cartesian}</strong></td>
            <td class="ltr-content">${cartesianOhm} Ω</td>
            <td class="ltr-content">${cartesianMilliohm} mΩ</td>
          </tr>
          <tr>
            <td><strong>${translations[currentLang].polar}</strong></td>
            <td class="ltr-content">${polarOhm} Ω</td>
            <td class="ltr-content">${polarMilliohm} mΩ</td>
          </tr>
        </tbody>
      </table>
    `
  } else {
    // Hebrew fallback
    tableHTML = `
      <table class="impedance-table">
        <thead>
          <tr>
            <th>פורמט</th>
            <th>אוהם (Ω)</th>
            <th>מיליאוהם (mΩ)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>קרטזי</strong></td>
            <td class="ltr-content">${cartesianOhm} Ω</td>
            <td class="ltr-content">${cartesianMilliohm} mΩ</td>
          </tr>
          <tr>
            <td><strong>פולארי</strong></td>
            <td class="ltr-content">${polarOhm} Ω</td>
            <td class="ltr-content">${polarMilliohm} mΩ</td>
          </tr>
        </tbody>
      </table>
    `
  }

  impedanceOutput.innerHTML = tableHTML
}

// Expose functions to global scope
window.CableApp.calculateImpedance = calculateImpedance
window.CableApp.updateImpedanceTable = updateImpedanceTable
window.CableApp.lastCalculatedValues = () => lastCalculatedValues

// Make functions available globally for HTML onclick handlers - THIS WAS MISSING!
window.calculateImpedance = calculateImpedance