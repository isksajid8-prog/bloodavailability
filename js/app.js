/**
 * BloodConnect – Blood Donation System
 * Main Application Logic & LocalStorage State Management
 * Hackathon Prototype
 */

// Storage Keys
const STORAGE_KEYS = {
  DONORS: "BLOODCONNECT_DONORS",
  REQUESTS: "BLOODCONNECT_REQUESTS"
};

// Application State
let appState = {
  donors: [],
  requests: [],
  filters: {
    bloodGroup: "ALL",
    city: "ALL",
    search: "",
    availableOnly: false,
    compatibleMode: false
  },
  selectedCompatGroup: "O-"
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  initCompatibilityExplorer();
  initFormInteractions();
  initFilterEvents();
  initMobileMenu();
  renderApp();
  initLiveTicker();
});

/**
 * Initialize LocalStorage with sample data if first run
 */
function initStorage() {
  const storedDonors = localStorage.getItem(STORAGE_KEYS.DONORS);
  const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);

  if (!storedDonors) {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(SAMPLE_DONORS));
    appState.donors = [...SAMPLE_DONORS];
  } else {
    try {
      appState.donors = JSON.parse(storedDonors);
    } catch (e) {
      console.error("Error reading stored donors, resetting to sample", e);
      appState.donors = [...SAMPLE_DONORS];
    }
  }

  if (!storedRequests) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SAMPLE_REQUESTS));
    appState.requests = [...SAMPLE_REQUESTS];
  } else {
    try {
      appState.requests = JSON.parse(storedRequests);
    } catch (e) {
      console.error("Error reading stored requests, resetting to sample", e);
      appState.requests = [...SAMPLE_REQUESTS];
    }
  }
}

/**
 * Save current state to LocalStorage
 */
function saveState() {
  localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(appState.donors));
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(appState.requests));
}

/**
 * Reset all data to clean initial sample data (Judges tool)
 */
function resetDemoData() {
  if (confirm("Reset BloodConnect data back to initial Hackathon sample data? Any newly created donors/requests will be reset.")) {
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(SAMPLE_DONORS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(SAMPLE_REQUESTS));
    appState.donors = [...SAMPLE_DONORS];
    appState.requests = [...SAMPLE_REQUESTS];
    renderApp();
    showToast("Data Reset", "Sample donors and emergency requests restored!", "success");
  }
}

/**
 * Main render function
 */
function renderApp() {
  renderDonorCards();
  renderDashboard();
  renderEmergencyFeed();
  updateHeroStats();
  renderTickerItems();
}

// --- Hero Stats Update ---
function updateHeroStats() {
  const totalDonors = appState.donors.length;
  const availableDonors = appState.donors.filter(d => d.availability === "Available Now").length;
  const activeReqs = appState.requests.filter(r => r.status === "Active").length;
  const livesSaved = appState.donors.reduce((acc, d) => acc + (d.donationsCount || 1), 0) * 3;

  const totalEl = document.getElementById("heroTotalDonors");
  const availEl = document.getElementById("heroAvailDonors");
  const reqEl = document.getElementById("heroActiveReqs");
  const livesEl = document.getElementById("heroLivesSaved");

  if (totalEl) totalEl.textContent = totalDonors;
  if (availEl) availEl.textContent = availableDonors;
  if (reqEl) reqEl.textContent = activeReqs;
  if (livesEl) livesEl.textContent = `${livesSaved}+`;
}

// --- Live Emergency Ticker ---
function renderTickerItems() {
  const tickerContainer = document.getElementById("tickerContent");
  if (!tickerContainer) return;

  const activeReqs = appState.requests.filter(r => r.status === "Active");
  if (activeReqs.length === 0) {
    tickerContainer.innerHTML = `<span class="ticker-item">✅ All emergency blood requests are currently fulfilled across partner hospitals!</span>`;
    return;
  }

  tickerContainer.innerHTML = activeReqs.map(req => `
    <span class="ticker-item">
      🚨 <strong>${req.bloodGroup} Needed:</strong> ${req.unitsRequired} unit(s) at ${escapeHTML(req.hospitalName)}, ${escapeHTML(req.location)} (${req.urgency})
      <button class="ticker-btn" onclick="scrollToSection('request-blood')">Details</button>
    </span>
  `).join("");
}

function initLiveTicker() {
  // Rotate or refresh time labels every 30 seconds
  setInterval(() => {
    renderEmergencyFeed();
  }, 30000);
}

// --- Find a Donor Filter & Search Engine ---
function initFilterEvents() {
  // Blood group pill buttons
  const pills = document.querySelectorAll(".blood-pill-btn");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      appState.filters.bloodGroup = pill.getAttribute("data-blood");
      renderDonorCards();
    });
  });

  // City dropdown
  const citySelect = document.getElementById("filterCity");
  if (citySelect) {
    citySelect.addEventListener("change", (e) => {
      appState.filters.city = e.target.value;
      renderDonorCards();
    });
  }

  // Text search input
  const searchInput = document.getElementById("filterSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.filters.search = e.target.value.trim().toLowerCase();
      renderDonorCards();
    });
  }

  // Available Only Toggle
  const availToggle = document.getElementById("toggleAvailableOnly");
  if (availToggle) {
    availToggle.addEventListener("change", (e) => {
      appState.filters.availableOnly = e.target.checked;
      renderDonorCards();
    });
  }

  // Compatible Blood Group Toggle
  const compatToggle = document.getElementById("toggleCompatibility");
  if (compatToggle) {
    compatToggle.addEventListener("change", (e) => {
      appState.filters.compatibleMode = e.target.checked;
      renderDonorCards();
    });
  }

  // Reset Filters Button
  const resetBtn = document.getElementById("btnResetFilters");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      appState.filters = {
        bloodGroup: "ALL",
        city: "ALL",
        search: "",
        availableOnly: false,
        compatibleMode: false
      };
      if (searchInput) searchInput.value = "";
      if (citySelect) citySelect.value = "ALL";
      if (availToggle) availToggle.checked = false;
      if (compatToggle) compatToggle.checked = false;
      pills.forEach(p => {
        if (p.getAttribute("data-blood") === "ALL") p.classList.add("active");
        else p.classList.remove("active");
      });
      renderDonorCards();
    });
  }

  // Quick Search Form in Hero Section
  const quickSearchForm = document.getElementById("heroQuickSearchForm");
  if (quickSearchForm) {
    quickSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const blood = document.getElementById("quickBloodGroup")?.value || "ALL";
      const city = document.getElementById("quickCity")?.value || "ALL";

      appState.filters.bloodGroup = blood;
      appState.filters.city = city;

      // Sync find a donor controls
      if (citySelect) citySelect.value = city;
      pills.forEach(p => {
        if (p.getAttribute("data-blood") === blood) p.classList.add("active");
        else p.classList.remove("active");
      });

      scrollToSection("find-donor");
      renderDonorCards();
    });
  }
}

/**
 * Filter donors list based on active filters
 */
function getFilteredDonors() {
  const { bloodGroup, city, search, availableOnly, compatibleMode } = appState.filters;

  return appState.donors.filter(donor => {
    // 1. Blood Group matching
    if (bloodGroup !== "ALL") {
      if (compatibleMode) {
        // If compatibility mode is ON, patient needs `bloodGroup`, so find donors whose blood can be given to `bloodGroup`
        const allowedDonors = BLOOD_COMPATIBILITY[bloodGroup]?.canReceiveFrom || [bloodGroup];
        if (!allowedDonors.includes(donor.bloodGroup)) return false;
      } else {
        if (donor.bloodGroup !== bloodGroup) return false;
      }
    }

    // 2. City matching
    if (city !== "ALL") {
      if (donor.city.toLowerCase() !== city.toLowerCase()) return false;
    }

    // 3. Availability matching
    if (availableOnly) {
      if (donor.availability !== "Available Now") return false;
    }

    // 4. Keyword search (Name, Area, Blood group)
    if (search) {
      const matchName = donor.fullName.toLowerCase().includes(search);
      const matchCity = donor.city.toLowerCase().includes(search);
      const matchArea = (donor.area || "").toLowerCase().includes(search);
      const matchBlood = donor.bloodGroup.toLowerCase().includes(search);
      if (!matchName && !matchCity && !matchArea && !matchBlood) return false;
    }

    return true;
  });
}

/**
 * Render Donor Cards in the Grid
 */
function renderDonorCards() {
  const grid = document.getElementById("donorCardsGrid");
  const countEl = document.getElementById("donorResultsCount");
  const compatNotice = document.getElementById("compatNotice");
  if (!grid) return;

  const filtered = getFilteredDonors();

  if (countEl) {
    countEl.textContent = filtered.length;
  }

  if (compatNotice) {
    if (appState.filters.compatibleMode && appState.filters.bloodGroup !== "ALL") {
      const allowed = BLOOD_COMPATIBILITY[appState.filters.bloodGroup]?.canReceiveFrom.join(", ");
      compatNotice.innerHTML = `🧬 Showing compatible donors for patient blood group <strong>${appState.filters.bloodGroup}</strong> (Eligible types: <strong>${allowed}</strong>)`;
      compatNotice.style.display = "block";
    } else {
      compatNotice.style.display = "none";
    }
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No matching donors found</h3>
        <p>Try adjusting your search criteria, selecting "All Blood Groups", or turning on "Show Compatible Blood Groups".</p>
        <button class="btn btn-outline-primary btn-sm" onclick="document.getElementById('btnResetFilters').click()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(donor => {
    let statusClass = "available";
    if (donor.availability === "On Call") statusClass = "oncall";
    if (donor.availability === "Busy / Away") statusClass = "busy";

    const isCompatible = appState.filters.compatibleMode && appState.filters.bloodGroup !== "ALL" && donor.bloodGroup !== appState.filters.bloodGroup;

    return `
      <div class="donor-card ${isCompatible ? 'compatible-highlight' : ''}">
        <div>
          <div class="donor-card-header">
            <div class="donor-avatar-wrap">
              <div class="donor-blood-tag">${donor.bloodGroup}</div>
              <div class="donor-meta">
                <h4>${escapeHTML(donor.fullName)}</h4>
                <div class="donor-submeta">
                  <span>${donor.age} yrs • ${donor.gender || 'Donor'}</span>
                </div>
              </div>
            </div>
            <span class="status-badge ${statusClass}">
              <span class="dot"></span>
              ${donor.availability}
            </span>
          </div>

          <div>
            ${donor.isSample 
              ? `<span class="sample-tag">🧪 Demo / Sample Donor</span>` 
              : `<span class="real-tag">✨ Newly Registered</span>`}
            ${isCompatible 
              ? `<span class="compat-tag match" style="font-size: 0.7rem; padding: 2px 6px;">Compatible Match</span>` 
              : ''}
          </div>

          <ul class="donor-details-list">
            <li>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <strong>${escapeHTML(donor.city)}</strong> ${donor.area ? `(${escapeHTML(donor.area)})` : ''}
            </li>
            <li>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <span>Donated <strong>${donor.donationsCount || 1} times</strong> (${donor.lastDonationDate ? `Last: ${donor.lastDonationDate}` : 'Eligible'})</span>
            </li>
          </ul>
        </div>

        <div class="donor-card-footer">
          <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="openContactModal('${donor.id}')">
            📞 Contact
          </button>
          <button class="btn btn-outline-primary btn-sm" onclick="openWhatsApp('${escapeHTML(donor.fullName)}', '${donor.phone}', '${donor.bloodGroup}')" title="Send WhatsApp Message">
            💬 WhatsApp
          </button>
          <button class="btn btn-secondary btn-sm" onclick="requestFromDonor('${donor.bloodGroup}', '${escapeHTML(donor.city)}')" title="Auto-fill Emergency Request">
            🚨 Request
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// --- Interactive Forms Management ---
function initFormInteractions() {
  // Blood Tile Radio selector for Registration Form
  const bloodTiles = document.querySelectorAll(".blood-tile");
  bloodTiles.forEach(tile => {
    tile.addEventListener("click", () => {
      bloodTiles.forEach(t => t.classList.remove("selected"));
      tile.classList.add("selected");
      const radio = tile.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Urgency Cards for Emergency Request Form
  const urgencyCards = document.querySelectorAll(".urgency-card");
  urgencyCards.forEach(card => {
    card.addEventListener("click", () => {
      urgencyCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Donor Registration Form Submit
  const registerForm = document.getElementById("donorRegisterForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleDonorRegistration);
  }

  // Emergency Request Form Submit
  const emergencyForm = document.getElementById("emergencyRequestForm");
  if (emergencyForm) {
    emergencyForm.addEventListener("submit", handleEmergencyRequest);
  }
}

/**
 * Handle Donor Registration
 */
function handleDonorRegistration(e) {
  e.preventDefault();

  const fullName = document.getElementById("regFullName").value.trim();
  const age = parseInt(document.getElementById("regAge").value, 10);
  const gender = document.getElementById("regGender").value;
  const phone = document.getElementById("regPhone").value.trim();
  const city = document.getElementById("regCity").value.trim();
  const area = document.getElementById("regArea").value.trim();
  const availability = document.getElementById("regAvailability").value;
  const lastDonationDate = document.getElementById("regLastDonation").value || "Never / First Time";
  const weightCheck = document.getElementById("regWeightCheck")?.checked;

  const selectedBloodRadio = document.querySelector('input[name="regBloodGroup"]:checked');
  if (!selectedBloodRadio) {
    showToast("Missing Blood Group", "Please select your blood group.", "error");
    return;
  }
  const bloodGroup = selectedBloodRadio.value;

  if (age < 18 || age > 65) {
    showToast("Age Restriction", "Donors must be between 18 and 65 years old to donate blood safely.", "error");
    return;
  }

  if (!weightCheck) {
    showToast("Health Verification", "Please confirm that you meet the weight and health requirements.", "error");
    return;
  }

  // Generate unique Donor ID
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const donorId = `BC-D${randomSuffix}`;

  const newDonor = {
    id: donorId,
    fullName,
    age,
    gender,
    bloodGroup,
    phone,
    city,
    area: area || city,
    availability,
    lastDonationDate: lastDonationDate === "Never / First Time" ? null : lastDonationDate,
    donationsCount: 1,
    registeredDate: new Date().toISOString().split("T")[0],
    isSample: false
  };

  // Add to state and save
  appState.donors.unshift(newDonor);
  saveState();
  renderApp();

  // Reset form
  e.target.reset();
  document.querySelectorAll(".blood-tile").forEach(t => t.classList.remove("selected"));

  // Show celebratory Digital Donor Card Modal
  openDonorIdCardModal(newDonor);
  showToast("Registration Successful!", `Welcome to BloodConnect, ${fullName}! Your Donor ID is ${donorId}.`, "success");
}

/**
 * Handle Emergency Blood Request
 */
function handleEmergencyRequest(e) {
  e.preventDefault();

  const patientName = document.getElementById("reqPatientName").value.trim();
  const bloodGroup = document.getElementById("reqBloodGroup").value;
  const unitsRequired = parseInt(document.getElementById("reqUnits").value, 10) || 1;
  const hospitalName = document.getElementById("reqHospital").value.trim();
  const location = document.getElementById("reqCity").value.trim();
  const area = document.getElementById("reqArea").value.trim();
  const contactName = document.getElementById("reqContactName").value.trim();
  const contactPhone = document.getElementById("reqContactPhone").value.trim();
  const notes = document.getElementById("reqNotes").value.trim();

  const selectedUrgencyRadio = document.querySelector('input[name="reqUrgency"]:checked');
  const urgency = selectedUrgencyRadio ? selectedUrgencyRadio.value : "Urgent (< 12 hrs)";
  const urgencyLevel = urgency.toLowerCase().includes("critical") 
    ? "critical" 
    : (urgency.toLowerCase().includes("urgent") ? "urgent" : "standard");

  const reqId = `BC-REQ-${Math.floor(100 + Math.random() * 900)}`;

  const newRequest = {
    id: reqId,
    patientName,
    bloodGroup,
    unitsRequired,
    hospitalName,
    location,
    area: area || location,
    contactName,
    contactPhone,
    urgency,
    urgencyLevel,
    status: "Active",
    postedTime: "Just now",
    timestamp: Date.now(),
    notes: notes || "Immediate replacement blood required.",
    isSample: false
  };

  appState.requests.unshift(newRequest);
  saveState();
  renderApp();

  e.target.reset();

  // Check matching donors
  const compatibleTypes = BLOOD_COMPATIBILITY[bloodGroup]?.canReceiveFrom || [bloodGroup];
  const matchingDonors = appState.donors.filter(d => 
    compatibleTypes.includes(d.bloodGroup) && 
    d.availability === "Available Now" &&
    d.city.toLowerCase() === location.toLowerCase()
  );

  showToast(
    "Emergency Broadcast Sent!",
    `Found ${matchingDonors.length} compatible available donor(s) in ${location}. Check dashboard feed.`,
    "success"
  );

  scrollToSection("dashboard");
}

/**
 * Quick button to auto-fill emergency request for a specific donor's blood group
 */
function requestFromDonor(bloodGroup, city) {
  const bloodSelect = document.getElementById("reqBloodGroup");
  const cityInput = document.getElementById("reqCity");

  if (bloodSelect) bloodSelect.value = bloodGroup;
  if (cityInput) cityInput.value = city;

  scrollToSection("request-blood");
  showToast("Request Pre-filled", `Pre-selected ${bloodGroup} blood requirement for ${city}.`, "info");
}

// --- Live Dashboard ---
function renderDashboard() {
  const totalDonorsEl = document.getElementById("dashTotalDonors");
  const availDonorsEl = document.getElementById("dashAvailDonors");
  const activeReqsEl = document.getElementById("dashActiveReqs");
  const bloodGroupsGrid = document.getElementById("bloodStockGrid");

  const totalDonors = appState.donors.length;
  const availDonors = appState.donors.filter(d => d.availability === "Available Now").length;
  const activeReqs = appState.requests.filter(r => r.status === "Active").length;

  if (totalDonorsEl) totalDonorsEl.textContent = totalDonors;
  if (availDonorsEl) availDonorsEl.textContent = availDonors;
  if (activeReqsEl) activeReqsEl.textContent = activeReqs;

  // Render Blood Group Availability Grid
  if (bloodGroupsGrid) {
    bloodGroupsGrid.innerHTML = ALL_BLOOD_GROUPS.map(bg => {
      const donorsForGroup = appState.donors.filter(d => d.bloodGroup === bg);
      const availForGroup = donorsForGroup.filter(d => d.availability === "Available Now").length;

      return `
        <div class="blood-stock-box" onclick="quickFilterBlood('${bg}')" style="cursor: pointer;" title="Click to view ${bg} donors">
          <div class="blood-stock-badge">${bg}</div>
          <div class="blood-stock-count">${donorsForGroup.length} Donor${donorsForGroup.length === 1 ? '' : 's'}</div>
          <div class="blood-stock-avail">● ${availForGroup} Available</div>
        </div>
      `;
    }).join("");
  }
}

/**
 * Quick jump from dashboard blood stock box to Find Donor section with pre-selected group
 */
function quickFilterBlood(bloodGroup) {
  appState.filters.bloodGroup = bloodGroup;
  document.querySelectorAll(".blood-pill-btn").forEach(p => {
    if (p.getAttribute("data-blood") === bloodGroup) p.classList.add("active");
    else p.classList.remove("active");
  });
  scrollToSection("find-donor");
  renderDonorCards();
  showToast("Filtered", `Displaying registered donors with blood group ${bloodGroup}`, "info");
}

/**
 * Render Active Emergency Requests on Dashboard Feed
 */
function renderEmergencyFeed() {
  const feed = document.getElementById("emergencyRequestsFeed");
  if (!feed) return;

  if (appState.requests.length === 0) {
    feed.innerHTML = `
      <div style="text-align: center; padding: 24px; color: var(--text-muted);">
        No blood requests currently in queue.
      </div>
    `;
    return;
  }

  feed.innerHTML = appState.requests.map(req => {
    const isFulfilled = req.status === "Fulfilled";
    let urgencyClass = req.urgencyLevel || "urgent";

    // Format human-friendly time elapsed
    let timeText = req.postedTime || "Recently";
    if (req.timestamp) {
      const minutesAgo = Math.floor((Date.now() - req.timestamp) / (60 * 1000));
      if (minutesAgo < 1) timeText = "Just now";
      else if (minutesAgo < 60) timeText = `${minutesAgo}m ago`;
      else {
        const hoursAgo = Math.floor(minutesAgo / 60);
        timeText = `${hoursAgo}h ago`;
      }
    }

    return `
      <div class="request-feed-item ${urgencyClass} ${isFulfilled ? 'fulfilled' : ''}">
        <div class="request-feed-top">
          <div class="req-patient-title">
            ${escapeHTML(req.patientName)}
            ${req.isSample ? `<span class="sample-tag" style="margin-left: 6px;">Demo</span>` : ''}
          </div>
          <span class="req-blood-pill">${req.bloodGroup} • ${req.unitsRequired} Unit${req.unitsRequired > 1 ? 's' : ''}</span>
        </div>

        <div class="req-details-row">
          <span>🏥 ${escapeHTML(req.hospitalName)}, ${escapeHTML(req.location)}</span>
          <span>⏳ ${req.urgency}</span>
          <span>🕒 ${timeText}</span>
        </div>

        ${req.notes ? `<div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 8px;"><em>"${escapeHTML(req.notes)}"</em></div>` : ''}

        <div class="req-actions-row">
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            Contact: <strong>${escapeHTML(req.contactName)}</strong> (${escapeHTML(req.contactPhone)})
          </div>
          <div style="display: flex; gap: 8px;">
            ${isFulfilled ? `
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--status-available);">
                ✅ Fulfilled
              </span>
            ` : `
              <button class="btn btn-outline-primary btn-sm" onclick="markRequestFulfilled('${req.id}')" title="Mark this emergency request as fulfilled">
                Mark Fulfilled
              </button>
              <a href="tel:${req.contactPhone}" class="btn btn-primary btn-sm">
                📞 Call
              </a>
            `}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Mark an emergency request as fulfilled
 */
function markRequestFulfilled(requestId) {
  const req = appState.requests.find(r => r.id === requestId);
  if (req) {
    req.status = "Fulfilled";
    saveState();
    renderApp();
    showToast("Request Fulfilled!", `Blood requirement for ${req.patientName} marked as fulfilled. Thank you!`, "success");
  }
}

/**
 * Quick button to spawn an instantaneous demo request (great for hackathon judge presentations)
 */
function addQuickDemoRequest() {
  const sampleHospitals = ["City Memorial Hospital", "Max Healthcare", "Apollo Central", "Fortis Clinic"];
  const sampleGroups = ["O-", "B+", "A+", "AB-"];
  const sampleCities = ["Mumbai", "Delhi", "Bengaluru", "Pune"];
  const randomGroup = sampleGroups[Math.floor(Math.random() * sampleGroups.length)];
  const randomCity = sampleCities[Math.floor(Math.random() * sampleCities.length)];
  const randomHospital = sampleHospitals[Math.floor(Math.random() * sampleHospitals.length)];

  const reqId = `BC-REQ-${Math.floor(200 + Math.random() * 800)}`;
  const newReq = {
    id: reqId,
    patientName: `Patient #${reqId.slice(-3)} (Demo)`,
    bloodGroup: randomGroup,
    unitsRequired: 2,
    hospitalName: randomHospital,
    location: randomCity,
    area: "Central Wing",
    contactName: "Dr. Demo Coordinator",
    contactPhone: "+91 98000 12345",
    urgency: "Critical (< 2 hrs)",
    urgencyLevel: "critical",
    status: "Active",
    postedTime: "Just now",
    timestamp: Date.now(),
    notes: "Demonstration emergency blood request created for live evaluation.",
    isSample: true
  };

  appState.requests.unshift(newReq);
  saveState();
  renderApp();
  showToast("Demo Emergency Created", `Live emergency added for ${randomGroup} at ${randomHospital}. Watch real-time updates!`, "info");
}

// --- Interactive Blood Compatibility Explorer ---
function initCompatibilityExplorer() {
  const btnContainer = document.getElementById("compatButtonGroup");
  if (!btnContainer) return;

  btnContainer.innerHTML = ALL_BLOOD_GROUPS.map(bg => `
    <button class="compat-btn ${bg === appState.selectedCompatGroup ? 'active' : ''}" onclick="selectCompatGroup('${bg}')">
      ${bg}
    </button>
  `).join("");

  updateCompatibilityDisplay(appState.selectedCompatGroup);
}

function selectCompatGroup(bloodGroup) {
  appState.selectedCompatGroup = bloodGroup;
  document.querySelectorAll(".compat-btn").forEach(btn => {
    if (btn.textContent.trim() === bloodGroup) btn.classList.add("active");
    else btn.classList.remove("active");
  });
  updateCompatibilityDisplay(bloodGroup);
}

function updateCompatibilityDisplay(bloodGroup) {
  const data = BLOOD_COMPATIBILITY[bloodGroup];
  if (!data) return;

  const receiveContainer = document.getElementById("compatReceiveList");
  const donateContainer = document.getElementById("compatDonateList");
  const titleEl = document.getElementById("compatSelectedTitle");
  const descEl = document.getElementById("compatDescription");

  if (titleEl) {
    titleEl.textContent = `${bloodGroup} (${data.type})`;
  }

  if (descEl) {
    descEl.textContent = data.description;
  }

  if (receiveContainer) {
    receiveContainer.innerHTML = data.canReceiveFrom.map(bg => `
      <span class="compat-tag match">🩸 ${bg}</span>
    `).join("");
  }

  if (donateContainer) {
    donateContainer.innerHTML = data.canDonateTo.map(bg => `
      <span class="compat-tag match">🩸 ${bg}</span>
    `).join("");
  }

  // Highlight table row and columns in the full matrix
  highlightMatrixRow(bloodGroup);
}

function highlightMatrixRow(bloodGroup) {
  const rows = document.querySelectorAll(".compat-table tbody tr");
  rows.forEach(tr => {
    const label = tr.querySelector(".recipient-label");
    if (label && label.textContent.trim() === bloodGroup) {
      tr.style.backgroundColor = "rgba(220, 38, 38, 0.08)";
    } else {
      tr.style.backgroundColor = "";
    }
  });
}

// --- Modals & Popups ---

/**
 * Open Contact Modal with donor details
 */
function openContactModal(donorId) {
  const donor = appState.donors.find(d => d.id === donorId);
  if (!donor) return;

  const modal = document.getElementById("contactModal");
  const body = document.getElementById("contactModalBody");
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div class="donor-blood-tag" style="margin: 0 auto 12px auto; width: 64px; height: 64px; font-size: 1.6rem;">
        ${donor.bloodGroup}
      </div>
      <h3 style="font-size: 1.3rem; margin-bottom: 4px;">${escapeHTML(donor.fullName)}</h3>
      <p style="color: var(--text-muted); font-size: 0.9rem;">
        ${donor.age} yrs • ${escapeHTML(donor.city)} ${donor.area ? `(${escapeHTML(donor.area)})` : ''}
      </p>
      <div style="margin-top: 8px;">
        ${donor.isSample ? `<span class="sample-tag">🧪 Hackathon Demo Data</span>` : `<span class="real-tag">✨ Registered Donor</span>`}
      </div>
    </div>

    <div style="background: var(--bg-alt); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem;">
        <span style="color: var(--text-muted);">Phone Number:</span>
        <strong>${escapeHTML(donor.phone)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.9rem;">
        <span style="color: var(--text-muted);">Current Availability:</span>
        <strong style="color: var(--status-available);">${donor.availability}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
        <span style="color: var(--text-muted);">Total Donations:</span>
        <strong>${donor.donationsCount || 1} times</strong>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px;">
      <a href="tel:${donor.phone}" class="btn btn-primary" style="width: 100%;">
        📞 Call Direct: ${escapeHTML(donor.phone)}
      </a>
      <button class="btn btn-outline-primary" style="width: 100%;" onclick="openWhatsApp('${escapeHTML(donor.fullName)}', '${donor.phone}', '${donor.bloodGroup}')">
        💬 Open WhatsApp Chat
      </button>
    </div>
  `;

  modal.classList.add("active");
}

/**
 * Open WhatsApp pre-filled chat
 */
function openWhatsApp(name, phone, bloodGroup) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(`Hello ${name}, I found your profile on BloodConnect. We urgently require ${bloodGroup} blood donation. Could you please let us know if you are currently available to donate? Thank you!`);
  const url = `https://wa.me/${cleanPhone}?text=${message}`;
  window.open(url, "_blank");
}

/**
 * Open Digital Donor ID Card Modal (Shown after registration)
 */
function openDonorIdCardModal(donor) {
  const modal = document.getElementById("donorCardModal");
  const cardBody = document.getElementById("donorCardBody");
  if (!modal || !cardBody) return;

  cardBody.innerHTML = `
    <div class="donor-id-card" id="printableCard">
      <div class="id-card-top">
        <div class="id-card-brand">
          <span>🩸</span> BloodConnect ID
        </div>
        <div class="id-card-blood-chip">
          ${donor.bloodGroup}
        </div>
      </div>

      <div class="id-card-donor-name">${escapeHTML(donor.fullName)}</div>
      <div style="font-size: 0.85rem; opacity: 0.9;">Donor ID: <strong>${donor.id}</strong></div>

      <div class="id-card-info-grid">
        <div class="id-card-info-item">
          <span>Location</span>
          <strong>${escapeHTML(donor.city)}</strong>
        </div>
        <div class="id-card-info-item">
          <span>Phone</span>
          <strong>${escapeHTML(donor.phone)}</strong>
        </div>
        <div class="id-card-info-item">
          <span>Age / Gender</span>
          <strong>${donor.age} yrs / ${donor.gender || 'Not specified'}</strong>
        </div>
        <div class="id-card-info-item">
          <span>Issued Date</span>
          <strong>${donor.registeredDate || new Date().toISOString().split("T")[0]}</strong>
        </div>
      </div>
    </div>

    <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 10px;">
      🎉 Save or snapshot this digital card! Carry it when visiting partner hospital blood banks.
    </div>
  `;

  modal.classList.add("active");
}

function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
}

// Modal Event Listeners
document.querySelectorAll(".modal-close-btn").forEach(btn => {
  btn.addEventListener("click", closeAllModals);
});

document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeAllModals();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

// --- Toast Notification System ---
function showToast(title, message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "⚠️";

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div class="toast-message">${escapeHTML(message)}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- Navigation & Smooth Scroll ---
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const navHeight = document.querySelector(".header")?.offsetHeight || 72;
    const bannerHeight = document.querySelector(".prototype-banner")?.offsetHeight || 36;
    const totalOffset = navHeight + bannerHeight;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - totalOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    // Close mobile menu if open
    const navMenu = document.getElementById("navMenu");
    if (navMenu) navMenu.classList.remove("open");
  }
}

function initMobileMenu() {
  const hamburger = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Active navigation link highlighting on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset + 150;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute("id");
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        if (navLink) navLink.classList.add("active");
      }
    });
  });
}

// Utility: HTML Sanitizer to prevent XSS
function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
