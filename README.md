# 🩸 BloodConnect – Blood Donation System
> **Hackathon Prototype** | *"Donate Blood, Save Lives."*

BloodConnect is a responsive web application designed for college hackathons to rapidly connect voluntary blood donors with patients and hospitals in critical emergencies.

---

## 🚀 Key Features

1. **Home Page & Hero Banner**:
   - Modern medical red & white aesthetic with subtle glassmorphism and heartbeat animations.
   - Live emergency alerts ticker for high-urgency hospital requests.
   - Real-time impact counters (Total Donors, Available Now, Active Emergencies, Lives Saved).
   - Instant Quick Donor Search right in the hero section.

2. **Find a Blood Donor Directory**:
   - Interactive blood group filters (`All`, `O+`, `O-`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`).
   - City & location filtering with free-text keyword search (name, area, city).
   - **Smart Compatibility Mode**: Toggle to automatically include biologically compatible donor blood groups (e.g., searching for B+ also displays O-, O+, B-, and B+ donors).
   - "Available Now" quick filter toggle.
   - Real-time donor cards featuring donor age, location, verified/sample tags, past donation counts, and instant contact actions (**Call Direct**, **WhatsApp pre-filled message**, and **Auto-fill Emergency Request**).

3. **Emergency Blood Request System**:
   - High-priority medical form for hospitals and patient relatives:
     - Patient Name
     - Blood Group Required & Units Needed
     - Hospital Name & Ward
     - City & Area
     - Direct Contact Person & Phone
     - Urgency Level Selector with visual cards:
       - 🔴 **Critical (< 2 hrs)**
       - 🟠 **Urgent (< 12 hrs)**
       - 🔵 **Standard (< 48 hrs)**
     - Clinical notes & doctor's instructions.
   - On submit, broadcasts the request to the live dashboard and calculates immediate matching donors nearby.

4. **Donor Registration Form**:
   - Clean, validated registration workflow:
     - Full Name, Age (18-65 validation), Gender
     - Interactive blood group tile selector
     - Phone number & availability status (Available Now, On Call, Busy)
     - City & Neighborhood
     - Last donation date & health checklist verification (weight ≥ 50kg, no recent surgery).
   - **Instant Digital Donor ID Card**: Generates an official BloodConnect digital badge with Donor ID, blood group chip, and print/save PDF capability.

5. **Live Operations Dashboard**:
   - 4 real-time operational KPI counters.
   - **Blood Groups Availability Grid**: Interactive distribution cards for all 8 blood groups showing active donors and current availability. Clicking any card immediately filters the donor directory!
   - **Live Emergency Requests Feed**: Shows patient details, urgency badges, hospital location, and elapsed time (`25m ago`, `Just now`). Includes a **"Mark as Fulfilled"** action button.

6. **Medical Blood Group Compatibility Guide**:
   - **Interactive Explorer Tool**: Click any of the 8 blood types to dynamically view who they can safely receive red blood cells from and who they can donate to.
   - **Full 8x8 Transfusion Compatibility Matrix Table** with visual checkmarks and crosses.
   - Universal Donor (**O-**) and Universal Recipient (**AB+**) medical education callouts.

7. **Hackathon Presentation Tools**:
   - Persistent client-side storage via `localStorage`.
   - Clear **"🧪 Demo / Sample Donor"** badges to differentiate prototype data from real registrations.
   - **⚡ Spawn Demo Request** button: Instantly generates a live emergency request to demonstrate real-time updates to hackathon judges.
   - **🔄 Reset Sample Data** button: Easily resets the database to the clean initial demo state at any time.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic, accessible markup.
- **CSS3**: Custom design system, CSS variables, responsive Grid/Flexbox, pulse animations, and print styling for Donor ID cards.
- **JavaScript (ES6+)**: Zero external runtime dependencies, native `localStorage` state management, reactive filtering and event handling.
- **Fonts**: Google Fonts (`Plus Jakarta Sans` & `Outfit`).

---

## 💻 How to Run

Because this project is built with standard web technologies and requires no complex backend or build steps, it can be launched immediately:

### Option 1: Direct File Opening
Double-click `index.html` to open it directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Python Server (Recommended)
Open a terminal in this directory and run:
```bash
python -m http.server 3000
```
Then navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
c:/Blood connect/
├── index.html         # Main responsive single-page application
├── css/
│   └── style.css      # Medical design system, themes, and animations
├── js/
│   ├── data.js        # Curated sample donors, emergency requests & compatibility rules
│   └── app.js         # Core reactive application & LocalStorage logic
└── README.md          # Documentation & Hackathon presentation guide
```

---

*Made with ❤️ for college hackathons to demonstrate technology saving lives.*
