// Main Zk3ph Calculator - Coordination module with debugging and grouping logic
const selectedImpedances = {}
const impedanceQuantities = {}
const calculatedImpedances = {} // Track which impedances have been calculated
const groupedImpedances = {} // Track grouped impedances
let totalCalculatedImpedance = 0 // Track the total calculated impedance
let groupingPhase = false // Track if we're in the grouping phase

// Initialize the global namespace
window.CableApp = window.CableApp || {}

// Component types and their constraints
const impedanceTypes = {
  ZTR: { maxQuantity: null, name: "ZTR", nameHe: "עכבת שנאי", nameEn: "Transformer Impedance" },
  ZL: { maxQuantity: null, name: "ZL", nameHe: "עכבת כבל", nameEn: "Cable Impedance" },
  ZSystem: { maxQuantity: 1, name: "ZSystem", nameHe: "עכבת מערכת", nameEn: "System Impedance" },
  ZG: { maxQuantity: null, name: "ZG", nameHe: "עכבת גנרטור", nameEn: "Generator Impedance" },
}

function toggleImpedanceType(impedanceKey) {
  console.log(`Toggling impedance type: ${impedanceKey}`)
  const checkbox = document.getElementById(`${impedanceKey.toLowerCase()}-checkbox`)
  const detailsDiv = document.getElementById(`${impedanceKey.toLowerCase()}-details`)

  if (checkbox.checked) {
    selectedImpedances[impedanceKey] = true
    console.log(`Selected impedance: ${impedanceKey}`)

    // Show details div if it exists
    if (detailsDiv) {
      detailsDiv.style.display = "block"
    }

    // Set default quantity - read from input field if available
    if (impedanceKey === "ZSystem") {
      impedanceQuantities[impedanceKey] = 1
    } else if (impedanceKey === "ZTR") {
      const transformersInput = document.getElementById("ztr-transformers")
      impedanceQuantities[impedanceKey] = transformersInput ? Number.parseInt(transformersInput.value) || 1 : 1
    } else if (impedanceKey === "ZL") {
      const cablesInput = document.getElementById(`${impedanceKey.toLowerCase()}-cables`)
      if (cablesInput) {
        impedanceQuantities[impedanceKey] = Number.parseInt(cablesInput.value) || 1
      } else {
        impedanceQuantities[impedanceKey] = 1
      }
    } else if (impedanceKey === "ZG") {
      const generatorsInput = document.getElementById("zg-generators")
      impedanceQuantities[impedanceKey] = generatorsInput ? Number.parseInt(generatorsInput.value) || 1 : 1
    }
  } else {
    selectedImpedances[impedanceKey] = false
    console.log(`Deselected impedance: ${impedanceKey}`)

    // Hide details div if it exists
    if (detailsDiv) {
      detailsDiv.style.display = "none"
    }

    delete impedanceQuantities[impedanceKey]
    delete calculatedImpedances[impedanceKey]
    delete groupedImpedances[impedanceKey]
  }

  console.log("Current selected impedances:", selectedImpedances)
  console.log("Current impedance quantities:", impedanceQuantities)
}

function updateImpedanceQuantity(impedanceKey, quantity) {
  const qty = Number.parseInt(quantity) || 1
  impedanceQuantities[impedanceKey] = qty
  console.log(`Updated quantity for ${impedanceKey}: ${qty}`)

  // If the impedance is already selected, update the stored quantity
  if (selectedImpedances[impedanceKey]) {
    impedanceQuantities[impedanceKey] = qty
    console.log(`Impedance ${impedanceKey} is selected, updated quantity to ${qty}`)
  }
}

function confirmImpedanceSelection() {
  console.log("=== CONFIRMING IMPEDANCE SELECTION ===")
  console.log("Selected impedances:", selectedImpedances)
  console.log("Impedance quantities:", impedanceQuantities)

  // Check if any impedance is selected
  const selectedKeys = Object.keys(selectedImpedances).filter((key) => selectedImpedances[key])
  console.log("Selected keys:", selectedKeys)

  if (selectedKeys.length === 0) {
    const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
    const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null
    const message =
      translations && translations[currentLang]
        ? translations[currentLang].selectImpedanceTypes || "אנא בחר לפחות סוג עכבה אחד"
        : "אנא בחר לפחות סוג עכבה אחד"
    alert(message)
    return
  }

  // Hide selection section
  const selectionSection = document.querySelector(".impedance-selection")
  if (selectionSection) {
    selectionSection.style.display = "none"
    console.log("Hidden selection section")
  }

  // Hide confirm button
  const confirmBtn = document.getElementById("confirm-impedance-btn")
  if (confirmBtn) {
    confirmBtn.style.display = "none"
    console.log("Hidden confirm button")
  }

  // Generate input forms for selected impedances
  console.log("About to call updateImpedanceInputs()")
  updateImpedanceInputs()
}

function updateImpedanceInputs() {
  console.log("=== UPDATING IMPEDANCE INPUTS ===")

  const inputsContainer = document.getElementById("impedance-inputs-container")
  if (!inputsContainer) {
    console.error("impedance-inputs-container not found!")
    return
  }

  console.log("Found inputs container, clearing content...")
  inputsContainer.innerHTML = ""
  inputsContainer.style.display = "block"

  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Change the header text to indicate calculation phase
  const headerElement = document.getElementById("zk3ph-selection-title")
  if (headerElement) {
    headerElement.textContent =
      translations && translations[currentLang]
        ? translations[currentLang].impedanceCalculationTitle || "חישוב עכבת קצר Zk3ph"
        : "חישוב עכבת קצר Zk3ph"
    console.log("Updated header text")
  }

  console.log("Creating sections for selected impedances...")
  Object.keys(selectedImpedances).forEach((impedanceKey) => {
    if (selectedImpedances[impedanceKey]) {
      const quantity = impedanceQuantities[impedanceKey] || 1
      console.log(`Creating ${quantity} section(s) for ${impedanceKey}`)

      for (let i = 1; i <= quantity; i++) {
        console.log(`Creating section ${i} for ${impedanceKey}`)
        let section

        // Use specific impedance modules
        switch (impedanceKey) {
          case "ZTR":
            console.log("Calling createTransformerInputSection...")
            section = window.CableApp.createTransformerInputSection(i, currentLang, translations)
            break
          case "ZL":
            console.log("Calling createCableInputSection...")
            section = window.CableApp.createCableInputSection(i, currentLang, translations)
            break
          case "ZSystem":
            console.log("Calling createSystemInputSection...")
            section = window.CableApp.createSystemInputSection(i, currentLang, translations)
            break
          case "ZG":
            console.log("Calling createGeneratorInputSection...")
            section = window.CableApp.createGeneratorInputSection(i, currentLang, translations)
            break
        }

        if (section) {
          console.log(`Section created for ${impedanceKey}-${i}, appending to container...`)
          console.log("Section ID:", section.id)
          console.log("Section display style:", section.style.display)

          inputsContainer.appendChild(section)

          // Force display to block to ensure visibility
          section.style.display = "block"

          console.log(`Section ${impedanceKey}-${i} appended and made visible`)
        } else {
          console.error(`Failed to create section for ${impedanceKey}-${i}`)
        }
      }
    }
  })

  // Create a container for the results
  const resultContainer = document.createElement("div")
  resultContainer.id = "zk3ph-calculation-result"
  inputsContainer.appendChild(resultContainer)
  console.log("Added result container")

  // Now add the calculate button AFTER the results container
  const calculateBtnContainer = document.createElement("div")
  calculateBtnContainer.className = "calculate-zk3ph-btn-container"

  const calculateBtn = document.createElement("button")
  calculateBtn.id = "calculate-zk3ph-btn"
  calculateBtn.textContent =
    translations && translations[currentLang] ? translations[currentLang].calculateZk3phBtn : "חשב Zk3ph"
  calculateBtn.onclick = calculateZk3ph
  calculateBtn.disabled = true
  calculateBtn.style.display = "block"

  calculateBtnContainer.appendChild(calculateBtn)
  inputsContainer.appendChild(calculateBtnContainer)
  console.log("Added calculate button")

  console.log("=== FINISHED UPDATING IMPEDANCE INPUTS ===")

  // Debug: Check what's in the container after a short delay
  setTimeout(() => {
    console.log("=== POST-UPDATE DEBUG CHECK ===")
    const sections = inputsContainer.querySelectorAll(".impedance-input-section")
    console.log(`Found ${sections.length} impedance input sections`)
    sections.forEach((section, index) => {
      console.log(
        `Section ${index}: ID=${section.id}, display=${section.style.display}, visible=${section.offsetHeight > 0}`,
      )
    })
  }, 100)
}

function registerImpedanceCalculation(impedanceKey, index, impedanceValue, details, realPart = null, imagPart = null) {
  console.log(`=== REGISTERING IMPEDANCE CALCULATION ===`)
  console.log(`Key: ${impedanceKey}, Index: ${index}, Value: ${impedanceValue}`)

  // Store the calculated impedance with complex components
  if (!calculatedImpedances[impedanceKey]) {
    calculatedImpedances[impedanceKey] = {}
  }
  calculatedImpedances[impedanceKey][index] = {
    magnitude: impedanceValue,
    real: realPart !== null ? realPart : impedanceValue, // Default to magnitude if no real part provided
    imaginary: imagPart !== null ? imagPart : 0, // Default to 0 if no imaginary part provided
    details: details,
  }

  totalCalculatedImpedance += impedanceValue

  // Add this calculation to the dynamic results table
  addToZk3phResultsTable(impedanceKey, index, impedanceValue, details, realPart, imagPart)

  // Hide the completed impedance section
  const sectionId = `${impedanceKey.toLowerCase()}-${index}-inputs`
  console.log(`Looking for section to hide: ${sectionId}`)
  const section = document.getElementById(sectionId)
  if (section) {
    console.log(`Hiding section: ${sectionId}`)
    section.style.display = "none"
  } else {
    console.log(`Section not found: ${sectionId}`)
  }

  // Check if all impedances have been calculated
  checkAllImpedancesCalculated()
}

// Find the addToZk3phResultsTable function and modify it to display impedance in mΩ
function addToZk3phResultsTable(impedanceKey, index, impedanceValue, details, realPart = null, imagPart = null) {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  const resultDiv = document.getElementById("zk3ph-calculation-result")
  if (!resultDiv) return

  // Create table if it doesn't exist
  if (!resultDiv.innerHTML.trim()) {
    const tableHeader = `
      <table class="zk3ph-result-table" id="zk3ph-dynamic-table">
        <thead>
          <tr>
            <th colspan="3">${
              translations && translations[currentLang]
                ? translations[currentLang].zk3phCalculationResults || "תוצאות חישוב Zk3ph"
                : "תוצאות חישוב Zk3ph"
            }</th>
          </tr>
          <tr>
            <th>${translations && translations[currentLang] ? translations[currentLang].component || "רכיב" : "רכיב"}</th>
            <th>${translations && translations[currentLang] ? translations[currentLang].details || "פרטים" : "פרטים"}</th>
            <th>${
              translations && translations[currentLang] ? translations[currentLang].impedance || "עכבה" : "עכבה"
            } [mΩ]</th>
          </tr>
        </thead>
        <tbody id="zk3ph-table-body">
        </tbody>
      </table>
    `
    resultDiv.innerHTML = tableHeader
  }

  // Add the new row to the table body
  const tableBody = document.getElementById("zk3ph-table-body")
  if (tableBody) {
    const componentNames = {
      ZTR:
        translations && translations[currentLang]
          ? translations[currentLang].transformerImpedance || "עכבת שנאי"
          : "עכבת שנאי",
      ZL:
        translations && translations[currentLang] ? translations[currentLang].cableImpedance || "עכבת כבל" : "עכבת כבל",
      ZSystem:
        translations && translations[currentLang]
          ? translations[currentLang].systemImpedance || "עכבת מערכת"
          : "עכבת מערכת",
      ZG:
        translations && translations[currentLang]
          ? translations[currentLang].generatorImpedance || "עכבת גנרטור"
          : "עכבת גנרטור",
    }

    const componentName = componentNames[impedanceKey] || impedanceKey
    const indexText = index > 1 ? ` ${index}` : ""

    // Format cartesian form in mΩ
    let cartesianForm = ""
    const realMilliohm = (realPart !== null ? realPart : impedanceValue) * 1000
    const imagMilliohm = (imagPart !== null ? imagPart : 0) * 1000

    if (realPart === null && imagPart === null) {
      // Pure resistive (magnitude only)
      cartesianForm = `${(impedanceValue * 1000).toFixed(3)}`
    } else if (realPart === 0 && imagPart !== 0) {
      // Pure reactive
      cartesianForm = `j${imagMilliohm.toFixed(3)}`
    } else if (realPart !== 0 && imagPart === 0) {
      // Pure resistive
      cartesianForm = `${realMilliohm.toFixed(3)}`
    } else if (realPart !== 0 && imagPart !== 0) {
      // Complex
      const sign = imagPart >= 0 ? "+" : ""
      cartesianForm = `${realMilliohm.toFixed(3)} ${sign} j${imagMilliohm.toFixed(3)}`
    } else {
      // Fallback
      cartesianForm = `${(impedanceValue * 1000).toFixed(3)}`
    }

    const newRow = document.createElement("tr")
    newRow.id = `impedance-row-${impedanceKey}-${index}`
    newRow.innerHTML = `
      <td><strong>${componentName}${indexText}</strong></td>
      <td class="ltr-content">${details}</td>
      <td class="ltr-content">${cartesianForm}</td>
    `

    tableBody.appendChild(newRow)
  }
}

function highlightInput(inputElement) {
  inputElement.classList.add("highlight-input")
  setTimeout(() => {
    inputElement.classList.remove("highlight-input")
  }, 1000)
}

function checkAllImpedancesCalculated() {
  let allCalculated = true

  // Check if all selected impedances have been calculated
  Object.keys(selectedImpedances).forEach((impedanceKey) => {
    if (selectedImpedances[impedanceKey]) {
      const quantity = impedanceQuantities[impedanceKey] || 1

      for (let i = 1; i <= quantity; i++) {
        if (!calculatedImpedances[impedanceKey] || !calculatedImpedances[impedanceKey][i]) {
          allCalculated = false
        }
      }
    }
  })

  if (allCalculated && !groupingPhase) {
    // Show grouping interface for ZTR and ZG if they have multiple impedances
    showGroupingInterface()
  } else if (allCalculated && groupingPhase) {
    // After grouping is done, show impedance reflection interface
    showImpedanceReflectionInterface()
  }

  return allCalculated
}

function showGroupingInterface() {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Check if ZTR or ZG have multiple impedances
  const groupableTypes = []
  if (calculatedImpedances.ZTR && Object.keys(calculatedImpedances.ZTR).length > 1) {
    groupableTypes.push("ZTR")
  }
  if (calculatedImpedances.ZG && Object.keys(calculatedImpedances.ZG).length > 1) {
    groupableTypes.push("ZG")
  }

  if (groupableTypes.length === 0) {
    // No grouping needed, proceed to final calculation
    groupingPhase = true
    checkAllImpedancesCalculated()
    return
  }

  groupingPhase = true

  // Create grouping interface
  const resultDiv = document.getElementById("zk3ph-calculation-result")
  if (!resultDiv) return

  const groupingSection = document.createElement("div")
  groupingSection.id = "impedance-grouping-section"
  groupingSection.className = "impedance-grouping"

  const groupingTitle = document.createElement("h4")
  groupingTitle.textContent = currentLang === "he" ? "קיבוץ עכבות במקביל:" : "Parallel Impedance Grouping:"
  groupingSection.appendChild(groupingTitle)

  const groupingInstructions = document.createElement("p")
  groupingInstructions.textContent =
    currentLang === "he"
      ? "בחר עכבות מאותו סוג לקיבוץ במקביל. עכבות שלא נבחרו יישארו נפרדות."
      : "Select impedances of the same type to group in parallel. Unselected impedances will remain separate."
  groupingSection.appendChild(groupingInstructions)

  groupableTypes.forEach((impedanceType) => {
    createGroupingInterface(groupingSection, impedanceType, currentLang, translations)
  })

  // Add grouping buttons
  const buttonContainer = document.createElement("div")
  buttonContainer.className = "grouping-buttons"

  const applyGroupingBtn = document.createElement("button")
  applyGroupingBtn.textContent = currentLang === "he" ? "החל קיבוץ" : "Apply Grouping"
  applyGroupingBtn.onclick = applyImpedanceGrouping
  buttonContainer.appendChild(applyGroupingBtn)

  const skipGroupingBtn = document.createElement("button")
  skipGroupingBtn.textContent = currentLang === "he" ? "דלג על קיבוץ" : "Skip Grouping"
  skipGroupingBtn.onclick = skipImpedanceGrouping
  buttonContainer.appendChild(skipGroupingBtn)

  groupingSection.appendChild(buttonContainer)
  resultDiv.appendChild(groupingSection)
}

function createGroupingInterface(container, impedanceType, currentLang, translations) {
  const typeSection = document.createElement("div")
  typeSection.className = "impedance-type-grouping"

  const typeTitle = document.createElement("h5")
  const typeName =
    impedanceType === "ZTR"
      ? currentLang === "he"
        ? "עכבות שנאי"
        : "Transformer Impedances"
      : currentLang === "he"
        ? "עכבות גנרטור"
        : "Generator Impedances"
  typeTitle.textContent = typeName
  typeSection.appendChild(typeTitle)

  const impedances = calculatedImpedances[impedanceType]
  const impedanceKeys = Object.keys(impedances)

  impedanceKeys.forEach((index) => {
    const checkboxContainer = document.createElement("div")
    checkboxContainer.className = "impedance-checkbox-container"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = `group-${impedanceType}-${index}`
    checkbox.value = index

    const label = document.createElement("label")
    label.htmlFor = checkbox.id
    label.textContent = `${impedanceType}${index}`

    checkboxContainer.appendChild(checkbox)
    checkboxContainer.appendChild(label)
    typeSection.appendChild(checkboxContainer)
  })

  container.appendChild(typeSection)
}

function applyImpedanceGrouping() {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Process ZTR grouping
  if (calculatedImpedances.ZTR) {
    processTypeGrouping("ZTR", currentLang, translations)
  }

  // Process ZG grouping
  if (calculatedImpedances.ZG) {
    processTypeGrouping("ZG", currentLang, translations)
  }

  // Hide grouping interface
  const groupingSection = document.getElementById("impedance-grouping-section")
  if (groupingSection) {
    groupingSection.style.display = "none"
  }

  // Update results table with grouped impedances
  updateResultsTableWithGrouping(currentLang, translations)

  // Show impedance reflection interface instead of enabling final calculation
  showImpedanceReflectionInterface()
}

function processTypeGrouping(impedanceType, currentLang, translations) {
  const selectedIndices = []
  const impedances = calculatedImpedances[impedanceType]

  // Find selected impedances for grouping
  Object.keys(impedances).forEach((index) => {
    const checkbox = document.getElementById(`group-${impedanceType}-${index}`)
    if (checkbox && checkbox.checked) {
      selectedIndices.push(index)
    }
  })

  if (selectedIndices.length > 1) {
    // Calculate parallel combination
    let parallelReal = 0
    let parallelImaginary = 0

    // Calculate 1/Z for each selected impedance and sum them
    selectedIndices.forEach((index) => {
      const impedance = impedances[index]
      const real = impedance.real
      const imaginary = impedance.imaginary

      // Calculate 1/Z = 1/(R + jX) = (R - jX)/(R² + X²)
      const denominator = real * real + imaginary * imaginary
      parallelReal += real / denominator
      parallelImaginary -= imaginary / denominator
    })

    // Calculate Zparallel = 1/(sum of 1/Z)
    const finalDenominator = parallelReal * parallelReal + parallelImaginary * parallelImaginary
    const groupedReal = parallelReal / finalDenominator
    const groupedImaginary = -parallelImaginary / finalDenominator
    const groupedMagnitude = Math.sqrt(groupedReal * groupedReal + groupedImaginary * groupedImaginary)

    // Create group name
    const groupName = `${impedanceType}${selectedIndices.join("")}`

    // Store grouped impedance
    if (!groupedImpedances[impedanceType]) {
      groupedImpedances[impedanceType] = {}
    }

    groupedImpedances[impedanceType][groupName] = {
      magnitude: groupedMagnitude,
      real: groupedReal,
      imaginary: groupedImaginary,
      details: `Parallel combination of ${selectedIndices.map((i) => `${impedanceType}${i}`).join(", ")}`,
      indices: selectedIndices,
    }

    console.log(`Created grouped impedance ${groupName}:`, groupedImpedances[impedanceType][groupName])
  }
}

function skipImpedanceGrouping() {
  // Hide grouping interface
  const groupingSection = document.getElementById("impedance-grouping-section")
  if (groupingSection) {
    groupingSection.style.display = "none"
  }

  // Show impedance reflection interface instead of enabling final calculation
  showImpedanceReflectionInterface()
}

function updateResultsTableWithGrouping(currentLang, translations) {
  const tableBody = document.getElementById("zk3ph-table-body")
  if (!tableBody) return

  // Add grouped impedances to the table
  Object.keys(groupedImpedances).forEach((impedanceType) => {
    Object.keys(groupedImpedances[impedanceType]).forEach((groupName) => {
      const groupData = groupedImpedances[impedanceType][groupName]

      // Format cartesian form in mΩ
      let cartesianForm = ""
      const realMilliohm = groupData.real * 1000
      const imagMilliohm = groupData.imaginary * 1000

      if (Math.abs(groupData.real) < 1e-10 && Math.abs(groupData.imaginary) > 1e-10) {
        // Pure reactive
        cartesianForm = `j${imagMilliohm.toFixed(3)}`
      } else if (Math.abs(groupData.real) > 1e-10 && Math.abs(groupData.imaginary) < 1e-10) {
        // Pure resistive
        cartesianForm = `${realMilliohm.toFixed(3)}`
      } else if (Math.abs(groupData.real) > 1e-10 && Math.abs(groupData.imaginary) > 1e-10) {
        // Complex
        const sign = groupData.imaginary >= 0 ? "+" : ""
        cartesianForm = `${realMilliohm.toFixed(3)} ${sign} j${imagMilliohm.toFixed(3)}`
      } else {
        // Fallback
        cartesianForm = `${(groupData.magnitude * 1000).toFixed(3)}`
      }

      const newRow = document.createElement("tr")
      newRow.className = "grouped-impedance-row"
      newRow.innerHTML = `
        <td><strong>${groupName} (||)</strong></td>
        <td class="ltr-content">${groupData.details}</td>
        <td class="ltr-content">${cartesianForm}</td>
      `

      tableBody.appendChild(newRow)

      // Hide the individual impedance rows that were grouped
      groupData.indices.forEach((index) => {
        const individualRow = document.getElementById(`impedance-row-${impedanceType}-${index}`)
        if (individualRow) {
          individualRow.style.display = "none"
        }
      })
    })
  })
}

// Modify the calculateZk3ph function to use grouped impedances
function calculateZk3ph() {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Calculate total complex impedance using both individual and grouped impedances
  let totalReal = 0
  let totalImaginary = 0

  // Add individual impedances (excluding those that were grouped)
  Object.keys(calculatedImpedances).forEach((impedanceKey) => {
    Object.keys(calculatedImpedances[impedanceKey]).forEach((index) => {
      // Check if this impedance was grouped
      let isGrouped = false
      if (groupedImpedances[impedanceKey]) {
        Object.keys(groupedImpedances[impedanceKey]).forEach((groupName) => {
          if (groupedImpedances[impedanceKey][groupName].indices.includes(index)) {
            isGrouped = true
          }
        })
      }

      if (!isGrouped) {
        const impedance = calculatedImpedances[impedanceKey][index]
        totalReal += impedance.real
        totalImaginary += impedance.imaginary
      }
    })
  })

  // Add grouped impedances
  Object.keys(groupedImpedances).forEach((impedanceKey) => {
    Object.keys(groupedImpedances[impedanceKey]).forEach((groupName) => {
      const groupData = groupedImpedances[impedanceKey][groupName]
      totalReal += groupData.real
      totalImaginary += groupData.imaginary
    })
  })

  // Calculate polar form
  const totalMagnitude = Math.sqrt(totalReal * totalReal + totalImaginary * totalImaginary)
  const totalAngle = Math.atan2(totalImaginary, totalReal) * (180 / Math.PI)

  // Update the main Zk3ph input with the magnitude in Ω
  const zk3phInput = document.getElementById("zk3ph-value")
  if (zk3phInput) {
    zk3phInput.value = totalMagnitude.toFixed(6)
    highlightInput(zk3phInput)
  }

  // Add the total row to the existing table (polar form in mΩ)
  const tableBody = document.getElementById("zk3ph-table-body")
  if (tableBody) {
    const totalRow = document.createElement("tr")
    totalRow.className = "result-row"
    const polarForm = `${(totalMagnitude * 1000).toFixed(3)} ∠ ${totalAngle.toFixed(2)}°`

    totalRow.innerHTML = `
      <td colspan="2"><strong>${
        translations && translations[currentLang] ? translations[currentLang].totalZk3ph || 'סה"כ Zk3ph' : 'סה"כ Zk3ph'
      }</strong></td>
      <td class="ltr-content"><strong>${polarForm}</strong></td>
    `

    tableBody.appendChild(totalRow)
  }

  // Enable the short circuit calculation button
  const scBtn = document.getElementById("calculate-sc3ph-btn")
  if (scBtn) {
    scBtn.disabled = false
  }

  // Hide the Calculate Zk3ph button since we're done
  const calculateBtn = document.getElementById("calculate-zk3ph-btn")
  if (calculateBtn) {
    calculateBtn.style.display = "none"
  }
}

// Function to update dynamically created content when language changes
function updateDynamicImpedanceSections() {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Update header if it exists
  const headerElement = document.getElementById("zk3ph-selection-title")
  if (
    (headerElement && headerElement.textContent.includes("חישוב")) ||
    headerElement.textContent.includes("Calculating")
  ) {
    headerElement.textContent =
      translations && translations[currentLang]
        ? translations[currentLang].impedanceCalculationTitle || "חישוב עכבת קצר Zk3ph"
        : "חישוב עכבת קצר Zk3ph"
  }

  // Update dynamically created sections
  Object.keys(selectedImpedances).forEach((impedanceKey) => {
    if (selectedImpedances[impedanceKey]) {
      const quantity = impedanceQuantities[impedanceKey] || 1

      for (let i = 1; i <= quantity; i++) {
        updateDynamicSectionContent(impedanceKey, i, currentLang, translations)
      }
    }
  })

  // Update calculate button text
  const calculateBtn = document.getElementById("calculate-zk3ph-btn")
  if (calculateBtn) {
    calculateBtn.textContent =
      translations && translations[currentLang]
        ? translations[currentLang].calculateZk3phBtn || "חשב Zk3ph"
        : "חשב Zk3ph"
  }

  // Update results table if it exists
  updateDynamicResultsTable(currentLang, translations)

  // Update the label for transformer quantity
  const ztrTransformersLabel = document.getElementById("ztr-transformers-label")
  if (ztrTransformersLabel) {
    ztrTransformersLabel.textContent = currentLang === "he" ? "מספר שנאים כולל:" : "Total number of transformers:"
  }

  // Update the label for generator quantity
  const zgGeneratorsLabel = document.getElementById("zg-generators-label")
  if (zgGeneratorsLabel) {
    zgGeneratorsLabel.textContent = currentLang === "he" ? "מספר גנרטורים כולל:" : "Total number of generators:"
  }
}

function updateDynamicSectionContent(impedanceKey, index, currentLang, translations) {
  // Update section titles
  const sectionId = `${impedanceKey.toLowerCase()}-${index}-inputs`
  const section = document.getElementById(sectionId)
  if (!section) return

  const titleElement = section.querySelector("h4")
  if (titleElement) {
    const componentNames = {
      ZTR:
        translations && translations[currentLang]
          ? translations[currentLang].transformerImpedance || "עכבת שנאי"
          : "עכבת שנאי",
      ZL:
        translations && translations[currentLang] ? translations[currentLang].cableImpedance || "עכבת כבל" : "עכבת כבל",
      ZSystem:
        translations && translations[currentLang]
          ? translations[currentLang].systemImpedance || "עכבת מערכת"
          : "עכבת מערכת",
      ZG:
        translations && translations[currentLang]
          ? translations[currentLang].generatorImpedance || "עכבת גנרטור"
          : "עכבת גנרטור",
    }

    const componentName = componentNames[impedanceKey] || impedanceKey
    const indexText = index > 1 ? ` ${index}` : ""
    titleElement.textContent = `${componentName}${indexText}`
  }

  // Update calculate button text
  const calculateBtn = section.querySelector(".calculate-impedance-btn")
  if (calculateBtn) {
    calculateBtn.textContent =
      translations && translations[currentLang]
        ? translations[currentLang].calculateImpedance || "חשב עכבה"
        : "Calculate Impedance"
  }

  // Update labels based on impedance type
  updateSectionLabels(section, impedanceKey, index, currentLang, translations)
}

function updateSectionLabels(section, impedanceKey, index, currentLang, translations) {
  // Update common labels that appear in multiple impedance types
  const labels = section.querySelectorAll("label")
  labels.forEach((label) => {
    const text = label.textContent.trim()

    // Update common labels
    if (text.includes("מתח נומינלי") || text.includes("Nominal voltage") || text.includes("Nominal Voltage")) {
      label.textContent = currentLang === "he" ? "מתח נומינלי (Un) [V]:" : "Nominal Voltage (Un) [V]:"
    } else if (text.includes("אורך כבל") || text.includes("Cable Length")) {
      label.textContent = currentLang === "he" ? "אורך כבל (L) [km]:" : "Cable Length (L) [km]:"
    } else if (text.includes("מספר כבלים במקביל") || text.includes("Number of parallel cables")) {
      label.textContent = currentLang === "he" ? "מספר כבלים במקביל (n):" : "Number of parallel cables (n):"
    } else if (text.includes("התנגדות") || text.includes("Resistance")) {
      label.textContent = currentLang === "he" ? "התנגדות (r) [Ω/km]:" : "Resistance (r) [Ω/km]:"
    } else if (text.includes("היגב") || text.includes("Reactance")) {
      label.textContent = currentLang === "he" ? "היגב (x) [Ω/km]:" : "Reactance (x) [Ω/km]:"
    } else if (text.includes("הספק הקצר של המערכת") || text.includes("Short Circuit Power")) {
      label.textContent = currentLang === "he" ? "הספק הקצר של המערכת (Sk) [MVA]:" : "Short Circuit Power (Sk) [MVA]:"
    } else if (text.includes("הספק הגנרטור") || text.includes("Generator Power")) {
      label.textContent = currentLang === "he" ? "הספק הגנרטור (Sg) [kVA]:" : "Generator Power (Sg) [kVA]:"
    } else if (text.includes("מפל מתח היגבי של הגנרטור") || text.includes("Subtransient reactance")) {
      label.textContent =
        currentLang === "he"
          ? "מפל מתח היגבי של הגנרטור (Ux%) [%]:"
          : "Subtransient reactance of the generator (Ux%) [%]:"
    }
  })

  // Update integration buttons
  const integrationBtns = section.querySelectorAll(".integration-btn")
  integrationBtns.forEach((btn) => {
    if (btn.textContent.includes("R&X Finder") || btn.textContent.includes("מ-R&X Finder")) {
      btn.textContent = currentLang === "he" ? "העתק מ-R&X Finder" : "Copy from R&X Finder"
    }
  })

  // Update reflection labels
  const reflectionLabels = section.querySelectorAll(".reflection-checkbox-container label")
  reflectionLabels.forEach((label) => {
    if (label.textContent.includes("שיקוף עכבה") || label.textContent.includes("Impedance Reflection")) {
      label.textContent = currentLang === "he" ? "שיקוף עכבה" : "Impedance Reflection"
    }
  })

  // Update transformer equation labels
  if (impedanceKey === "ZTR") {
    const equationHeaders = section.querySelectorAll(".equation-header label")
    equationHeaders.forEach((label) => {
      const text = label.textContent.trim()
      if (text.includes("Total Transformer Impedance") || text.includes("עכבת שנאי כוללת")) {
        label.textContent = currentLang === "he" ? "עכבת שנאי" : "Total Transformer Impedance"
      }
    })
  }
}

function updateDynamicResultsTable(currentLang, translations) {
  const table = document.getElementById("zk3ph-dynamic-table")
  if (!table) return

  // Update table headers
  const headers = table.querySelectorAll("th")
  if (headers.length >= 3) {
    headers[0].textContent =
      translations && translations[currentLang]
        ? translations[currentLang].zk3phCalculationResults || "תוצאות חישוב Zk3ph"
        : "תוצאות חישוב Zk3ph"

    if (headers.length >= 4) {
      headers[1].textContent =
        translations && translations[currentLang] ? translations[currentLang].component || "רכיב" : "רכיב"
      headers[2].textContent =
        translations && translations[currentLang] ? translations[currentLang].details || "פרטים" : "פרטים"
      headers[3].textContent =
        translations && translations[currentLang] ? translations[currentLang].impedance || "עכבה" : "עכבה"
    }
  }

  // Update component names in table rows
  const rows = table.querySelectorAll("tbody tr")
  rows.forEach((row) => {
    const firstCell = row.querySelector("td:first-child strong")
    if (firstCell) {
      const text = firstCell.textContent

      if (text.includes("עכבת שנאי") || text.includes("Transformer Impedance")) {
        const match = text.match(/\d+$/)
        const number = match ? ` ${match[0]}` : ""
        firstCell.textContent = (currentLang === "he" ? "עכבת שנאי" : "Transformer Impedance") + number
      } else if (text.includes("עכבת כבל") || text.includes("Cable Impedance")) {
        const match = text.match(/\d+$/)
        const number = match ? ` ${match[0]}` : ""
        firstCell.textContent = (currentLang === "he" ? "עכבת כבל" : "Cable Impedance") + number
      } else if (text.includes("עכבת מערכת") || text.includes("System Impedance")) {
        firstCell.textContent = currentLang === "he" ? "עכבת מערכת" : "System Impedance"
      } else if (text.includes("עכבת גנרטור") || text.includes("Generator Impedance")) {
        const match = text.match(/\d+$/)
        const number = match ? ` ${match[0]}` : ""
        firstCell.textContent = (currentLang === "he" ? "עכבת גנרטור" : "Generator Impedance") + number
      } else if (text.includes('סה"כ') || text.includes("Total")) {
        firstCell.textContent = currentLang === "he" ? 'סה"כ Zk3ph' : "Total Zk3ph"
      }
    }
  })
}

// Add new function to show impedance reflection interface
function showImpedanceReflectionInterface() {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  const resultDiv = document.getElementById("zk3ph-calculation-result")
  if (!resultDiv) return

  // Create reflection interface
  const reflectionSection = document.createElement("div")
  reflectionSection.id = "impedance-reflection-interface"
  reflectionSection.className = "impedance-reflection-interface"

  const reflectionTitle = document.createElement("h4")
  reflectionTitle.textContent = currentLang === "he" ? "שיקוף עכבות (אופציונלי):" : "Impedance Reflection (Optional):"
  reflectionSection.appendChild(reflectionTitle)

  const reflectionInstructions = document.createElement("p")
  reflectionInstructions.textContent =
    currentLang === "he"
      ? "בחר עכבות לשיקוף לרמת מתח אחרת. עכבות ששוקפו יסומנו בסימן '`' בסוף השם."
      : "Select impedances to reflect to a different voltage level. Reflected impedances will be marked with '`' at the end of the name."
  reflectionSection.appendChild(reflectionInstructions)

  // Add impedance reflection equation
  const equationDiv = document.createElement("div")
  equationDiv.className = "reflection-equation"
  equationDiv.innerHTML = `
    <div class="equation-content">
      <span class="equation-variable">Z'</span>
      <span class="equation-equals">=</span>
      <span class="equation-variable">Z</span>
      <span class="equation-dot">×</span>
      <span class="equation-parenthesis">(</span>
      <div class="equation-fraction">
        <div class="fraction-numerator">
          <span class="equation-variable">U'</span><sub>n</sub>
        </div>
        <div class="fraction-line"></div>
        <div class="fraction-denominator">
          <span class="equation-variable">U</span><sub>n</sub>
        </div>
      </div>
      <span class="equation-parenthesis">)</span><sup>2</sup>
    </div>
    <div class="equation-legend">
      <div class="legend-item">
        <span>Z' # ${currentLang === "he" ? "עכבה משוקפת" : "Reflected impedance"}</span>
      </div>
      <div class="legend-item">
        <span>Z # ${currentLang === "he" ? "עכבה מקורית" : "Original impedance"}</span>
      </div>
      <div class="legend-item">
        <span>U'n # ${currentLang === "he" ? "מתח חדש" : "New voltage"}</span>
      </div>
      <div class="legend-item">
        <span>Un # ${currentLang === "he" ? "מתח מקורי" : "Original voltage"}</span>
      </div>
    </div>
  `
  reflectionSection.appendChild(equationDiv)

  // Create checkboxes for all available impedances (individual and grouped)
  const impedanceList = document.createElement("div")
  impedanceList.className = "reflection-impedance-list"

  // Add individual impedances (not grouped)
  Object.keys(calculatedImpedances).forEach((impedanceKey) => {
    Object.keys(calculatedImpedances[impedanceKey]).forEach((index) => {
      // Check if this impedance was grouped
      let isGrouped = false
      if (groupedImpedances[impedanceKey]) {
        Object.keys(groupedImpedances[impedanceKey]).forEach((groupName) => {
          if (groupedImpedances[impedanceKey][groupName].indices.includes(index)) {
            isGrouped = true
          }
        })
      }

      if (!isGrouped) {
        createReflectionCheckbox(impedanceList, impedanceKey, index, false, currentLang, translations)
      }
    })
  })

  // Add grouped impedances
  Object.keys(groupedImpedances).forEach((impedanceKey) => {
    Object.keys(groupedImpedances[impedanceKey]).forEach((groupName) => {
      createReflectionCheckbox(impedanceList, impedanceKey, groupName, true, currentLang, translations)
    })
  })

  reflectionSection.appendChild(impedanceList)

  // Add reflection buttons
  const buttonContainer = document.createElement("div")
  buttonContainer.className = "reflection-buttons"

  const applyReflectionBtn = document.createElement("button")
  applyReflectionBtn.textContent = currentLang === "he" ? "החל שיקוף" : "Apply Reflection"
  applyReflectionBtn.onclick = applySelectedReflections
  buttonContainer.appendChild(applyReflectionBtn)

  const skipReflectionBtn = document.createElement("button")
  skipReflectionBtn.textContent = currentLang === "he" ? "דלג על שיקוף" : "Skip Reflection"
  skipReflectionBtn.onclick = skipReflection
  buttonContainer.appendChild(skipReflectionBtn)

  reflectionSection.appendChild(buttonContainer)
  resultDiv.appendChild(reflectionSection)
}

function createReflectionCheckbox(container, impedanceKey, identifier, isGrouped, currentLang, translations) {
  const checkboxContainer = document.createElement("div")
  checkboxContainer.className = "reflection-checkbox-item"

  // Create header with checkbox and label
  const headerDiv = document.createElement("div")
  headerDiv.className = "reflection-checkbox-header"

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.id = `reflect-${impedanceKey}-${identifier}`
  checkbox.onchange = () => toggleReflectionInputs(impedanceKey, identifier, isGrouped)

  const componentNames = {
    ZTR: currentLang === "he" ? "עכבת שנאי" : "Transformer Impedance",
    ZL: currentLang === "he" ? "עכבת כבל" : "Cable Impedance",
    ZSystem: currentLang === "he" ? "עכבת מערכת" : "System Impedance",
    ZG: currentLang === "he" ? "עכבת גנרטור" : "Generator Impedance",
  }

  const componentName = componentNames[impedanceKey] || impedanceKey
  let displayName = ""

  if (isGrouped) {
    displayName = `${identifier} (||)`
  } else {
    const indexText = identifier > 1 ? ` ${identifier}` : ""
    displayName = `${componentName}${indexText}`
  }

  const label = document.createElement("label")
  label.htmlFor = checkbox.id
  label.className = "checkbox-label"
  label.textContent = displayName

  headerDiv.appendChild(checkbox)
  headerDiv.appendChild(label)
  checkboxContainer.appendChild(headerDiv)

  // Create reflection inputs (hidden by default)
  const inputsContainer = document.createElement("div")
  inputsContainer.className = "reflection-inputs"
  inputsContainer.id = `reflect-inputs-${impedanceKey}-${identifier}`
  inputsContainer.style.display = "none"

  // Original voltage input
  const unLabel = document.createElement("label")
  unLabel.textContent = currentLang === "he" ? "מתח מקורי (Un) [V]:" : "Original Voltage (Un) [V]:"
  inputsContainer.appendChild(unLabel)

  const unInput = document.createElement("input")
  unInput.type = "number"
  unInput.id = `reflect-un-${impedanceKey}-${identifier}`
  unInput.step = "0.1"
  unInput.placeholder = currentLang === "he" ? "הזן Un" : "Enter Un"
  // Leave empty for user to fill
  inputsContainer.appendChild(unInput)

  // New voltage input - pre-filled with nominal voltage from short circuit calculation
  const unpLabel = document.createElement("label")
  unpLabel.textContent = currentLang === "he" ? "מתח חדש (U'n) [V]:" : "New Voltage (U'n) [V]:"
  inputsContainer.appendChild(unpLabel)

  const unpInput = document.createElement("input")
  unpInput.type = "number"
  unpInput.id = `reflect-unp-${impedanceKey}-${identifier}`
  unpInput.step = "0.1"
  unpInput.placeholder = currentLang === "he" ? "הזן U'n" : "Enter U'n"
  // Pre-fill with the nominal voltage from the short circuit calculation
  unpInput.value = document.getElementById("nominal-voltage")?.value || ""
  inputsContainer.appendChild(unpInput)

  checkboxContainer.appendChild(inputsContainer)
  container.appendChild(checkboxContainer)
}

function toggleReflectionInputs(impedanceKey, identifier, isGrouped) {
  const checkbox = document.getElementById(`reflect-${impedanceKey}-${identifier}`)
  const inputsContainer = document.getElementById(`reflect-inputs-${impedanceKey}-${identifier}`)

  if (checkbox && inputsContainer) {
    inputsContainer.style.display = checkbox.checked ? "block" : "none"
  }
}

function applySelectedReflections() {
  const currentLang = window.CableApp.getCurrentLang ? window.CableApp.getCurrentLang() : "he"
  const translations = window.CableApp.getTranslations ? window.CableApp.getTranslations() : null

  // Find all selected reflections
  const reflectionCheckboxes = document.querySelectorAll('[id^="reflect-"]:checked')

  reflectionCheckboxes.forEach((checkbox) => {
    const parts = checkbox.id.split("-")
    const impedanceKey = parts[1]
    const identifier = parts.slice(2).join("-")

    // Check if this is a grouped impedance
    const isGrouped = groupedImpedances[impedanceKey] && groupedImpedances[impedanceKey][identifier]

    applyReflectionToImpedance(impedanceKey, identifier, isGrouped, currentLang, translations)
  })

  // Hide reflection interface
  const reflectionSection = document.getElementById("impedance-reflection-interface")
  if (reflectionSection) {
    reflectionSection.style.display = "none"
  }

  // Enable final calculation
  enableFinalCalculation()
}

function applyReflectionToImpedance(impedanceKey, identifier, isGrouped, currentLang, translations) {
  const un = Number.parseFloat(document.getElementById(`reflect-un-${impedanceKey}-${identifier}`).value)
  const unp = Number.parseFloat(document.getElementById(`reflect-unp-${impedanceKey}-${identifier}`).value)

  if (isNaN(un) || isNaN(unp) || un <= 0 || unp <= 0) {
    const message =
      currentLang === "he"
        ? "אנא הזן ערכי מתח תקינים לשיקוף העכבה"
        : "Please enter valid voltage values for impedance reflection"
    alert(message)
    return
  }

  // Calculate transformation factor: (U'n/Un)²
  const factor = (unp / un) * (unp / un)

  let impedanceData
  if (isGrouped) {
    impedanceData = groupedImpedances[impedanceKey][identifier]
  } else {
    impedanceData = calculatedImpedances[impedanceKey][identifier]
  }

  // Apply reflection to all components
  const reflectedReal = impedanceData.real * factor
  const reflectedImaginary = impedanceData.imaginary * factor
  const reflectedMagnitude = impedanceData.magnitude * factor

  // Update the impedance data
  if (isGrouped) {
    groupedImpedances[impedanceKey][identifier] = {
      ...impedanceData,
      real: reflectedReal,
      imaginary: reflectedImaginary,
      magnitude: reflectedMagnitude,
      details: `${impedanceData.details}, Reflected: ${un}V → ${unp}V`,
    }
  } else {
    calculatedImpedances[impedanceKey][identifier] = {
      ...impedanceData,
      real: reflectedReal,
      imaginary: reflectedImaginary,
      magnitude: reflectedMagnitude,
      details: `${impedanceData.details}, Reflected: ${un}V → ${unp}V`,
    }
  }

  // Update the table row
  updateReflectedImpedanceInTable(
    impedanceKey,
    identifier,
    isGrouped,
    reflectedReal,
    reflectedImaginary,
    currentLang,
    translations,
  )
}

function updateReflectedImpedanceInTable(
  impedanceKey,
  identifier,
  isGrouped,
  reflectedReal,
  reflectedImaginary,
  currentLang,
  translations,
) {
  let rowId
  if (isGrouped) {
    // Find the grouped row
    const rows = document.querySelectorAll(".grouped-impedance-row")
    rows.forEach((row) => {
      const firstCell = row.querySelector("td:first-child strong")
      if (firstCell && firstCell.textContent.includes(identifier)) {
        rowId = row
      }
    })
  } else {
    rowId = document.getElementById(`impedance-row-${impedanceKey}-${identifier}`)
  }

  if (rowId) {
    const nameCell = rowId.querySelector("td:first-child strong")
    const impedanceCell = rowId.querySelector("td:last-child")

    // Add ` suffix to name
    if (nameCell && !nameCell.textContent.includes("`")) {
      nameCell.textContent += "`"
    }

    // Update impedance value
    if (impedanceCell) {
      const realMilliohm = reflectedReal * 1000
      const imagMilliohm = reflectedImaginary * 1000

      let cartesianForm = ""
      if (Math.abs(reflectedReal) < 1e-10 && Math.abs(reflectedImaginary) > 1e-10) {
        cartesianForm = `j${imagMilliohm.toFixed(3)}`
      } else if (Math.abs(reflectedReal) > 1e-10 && Math.abs(reflectedImaginary) < 1e-10) {
        cartesianForm = `${realMilliohm.toFixed(3)}`
      } else if (Math.abs(reflectedReal) > 1e-10 && Math.abs(reflectedImaginary) > 1e-10) {
        const sign = reflectedImaginary >= 0 ? "+" : ""
        cartesianForm = `${realMilliohm.toFixed(3)} ${sign} j${imagMilliohm.toFixed(3)}`
      } else {
        cartesianForm = `${(Math.sqrt(reflectedReal * reflectedReal + reflectedImaginary * reflectedImaginary) * 1000).toFixed(3)}`
      }

      impedanceCell.innerHTML = cartesianForm
    }
  }
}

function skipReflection() {
  // Hide reflection interface
  const reflectionSection = document.getElementById("impedance-reflection-interface")
  if (reflectionSection) {
    reflectionSection.style.display = "none"
  }

  // Enable final calculation
  enableFinalCalculation()
}

function enableFinalCalculation() {
  // Enable the final calculate button
  const calculateBtn = document.getElementById("calculate-zk3ph-btn")
  if (calculateBtn) {
    calculateBtn.disabled = false
  }
}

// Expose functions to global scope
window.CableApp.toggleImpedanceType = toggleImpedanceType
window.CableApp.updateImpedanceQuantity = updateImpedanceQuantity
window.CableApp.confirmImpedanceSelection = confirmImpedanceSelection
window.CableApp.calculateZk3ph = calculateZk3ph
window.CableApp.registerImpedanceCalculation = registerImpedanceCalculation
window.CableApp.highlightInput = highlightInput
window.CableApp.updateDynamicImpedanceSections = updateDynamicImpedanceSections

// Make functions available globally for HTML onclick handlers
window.toggleImpedanceType = toggleImpedanceType
window.updateImpedanceQuantity = updateImpedanceQuantity
window.confirmImpedanceSelection = confirmImpedanceSelection
window.calculateZk3ph = calculateZk3ph
window.applyImpedanceGrouping = applyImpedanceGrouping
window.skipImpedanceGrouping = skipImpedanceGrouping
window.applySelectedReflections = applySelectedReflections
window.skipReflection = skipReflection

console.log("Main Zk3ph calculator module with grouping logic loaded successfully!")
