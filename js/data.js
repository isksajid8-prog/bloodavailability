/**
 * BloodConnect - Sample Data & Compatibility Matrix
 * Hackathon Prototype Dataset
 */

// Initial Sample Donors (Curated for Hackathon Demonstration)
const SAMPLE_DONORS = [
  {
    id: "BC-D101",
    fullName: "Aarav Sharma",
    age: 26,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98765 43210",
    city: "Mumbai",
    area: "Andheri West",
    availability: "Available Now",
    lastDonationDate: "2026-05-10",
    donationsCount: 4,
    registeredDate: "2026-01-15",
    isSample: true
  },
  {
    id: "BC-D102",
    fullName: "Priya Patel",
    age: 24,
    gender: "Female",
    bloodGroup: "O-",
    phone: "+91 98234 56789",
    city: "Pune",
    area: "Kothrud",
    availability: "Available Now",
    lastDonationDate: "2026-04-12",
    donationsCount: 6,
    registeredDate: "2026-02-10",
    isSample: true
  },
  {
    id: "BC-D103",
    fullName: "Rohan Verma",
    age: 29,
    gender: "Male",
    bloodGroup: "A+",
    phone: "+91 97123 45678",
    city: "Delhi",
    area: "Rohini",
    availability: "Available Now",
    lastDonationDate: "2026-06-01",
    donationsCount: 3,
    registeredDate: "2026-03-05",
    isSample: true
  },
  {
    id: "BC-D104",
    fullName: "Ananya Iyer",
    age: 23,
    gender: "Female",
    bloodGroup: "B+",
    phone: "+91 99456 78901",
    city: "Bengaluru",
    area: "Indiranagar",
    availability: "Available Now",
    lastDonationDate: "2026-03-20",
    donationsCount: 5,
    registeredDate: "2026-02-18",
    isSample: true
  },
  {
    id: "BC-D105",
    fullName: "Vikram Malhotra",
    age: 34,
    gender: "Male",
    bloodGroup: "AB+",
    phone: "+91 98901 23456",
    city: "Hyderabad",
    area: "Gachibowli",
    availability: "On Call",
    lastDonationDate: "2026-05-18",
    donationsCount: 8,
    registeredDate: "2025-11-20",
    isSample: true
  },
  {
    id: "BC-D106",
    fullName: "Meera Sen",
    age: 27,
    gender: "Female",
    bloodGroup: "A-",
    phone: "+91 98312 34567",
    city: "Kolkata",
    area: "Salt Lake",
    availability: "Available Now",
    lastDonationDate: "2026-06-15",
    donationsCount: 2,
    registeredDate: "2026-04-01",
    isSample: true
  },
  {
    id: "BC-D107",
    fullName: "Kabir Khan",
    age: 31,
    gender: "Male",
    bloodGroup: "B-",
    phone: "+91 97654 32109",
    city: "Mumbai",
    area: "Bandra",
    availability: "On Call",
    lastDonationDate: "2026-02-28",
    donationsCount: 5,
    registeredDate: "2026-01-30",
    isSample: true
  },
  {
    id: "BC-D108",
    fullName: "Deepika Rao",
    age: 25,
    gender: "Female",
    bloodGroup: "AB-",
    phone: "+91 96543 21098",
    city: "Chennai",
    area: "Adyar",
    availability: "Available Now",
    lastDonationDate: "2026-04-30",
    donationsCount: 3,
    registeredDate: "2026-03-12",
    isSample: true
  },
  {
    id: "BC-D109",
    fullName: "Rahul Deshmukh",
    age: 30,
    gender: "Male",
    bloodGroup: "O+",
    phone: "+91 98111 22334",
    city: "Pune",
    area: "Hinjawadi",
    availability: "Available Now",
    lastDonationDate: "2026-05-22",
    donationsCount: 7,
    registeredDate: "2025-10-15",
    isSample: true
  },
  {
    id: "BC-D110",
    fullName: "Neha Gupta",
    age: 22,
    gender: "Female",
    bloodGroup: "B+",
    phone: "+91 98777 66554",
    city: "Delhi",
    area: "Connaught Place",
    availability: "Available Now",
    lastDonationDate: "2026-06-08",
    donationsCount: 1,
    registeredDate: "2026-05-01",
    isSample: true
  },
  {
    id: "BC-D111",
    fullName: "Siddharth Nair",
    age: 28,
    gender: "Male",
    bloodGroup: "O-",
    phone: "+91 99888 77665",
    city: "Bengaluru",
    area: "Koramangala",
    availability: "Available Now",
    lastDonationDate: "2026-05-05",
    donationsCount: 4,
    registeredDate: "2026-02-25",
    isSample: true
  },
  {
    id: "BC-D112",
    fullName: "Tanvi Joshi",
    age: 26,
    gender: "Female",
    bloodGroup: "A+",
    phone: "+91 97666 55443",
    city: "Ahmedabad",
    area: "Navrangpura",
    availability: "Busy / Away",
    lastDonationDate: "2026-07-20",
    donationsCount: 2,
    registeredDate: "2026-04-18",
    isSample: true
  },
  {
    id: "BC-D113",
    fullName: "Aditya Roy",
    age: 33,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 98333 44556",
    city: "Mumbai",
    area: "Powai",
    availability: "Available Now",
    lastDonationDate: "2026-04-14",
    donationsCount: 9,
    registeredDate: "2025-08-11",
    isSample: true
  },
  {
    id: "BC-D114",
    fullName: "Sneha Mukherjee",
    age: 29,
    gender: "Female",
    bloodGroup: "AB+",
    phone: "+91 98444 33221",
    city: "Kolkata",
    area: "Park Street",
    availability: "Available Now",
    lastDonationDate: "2026-06-10",
    donationsCount: 3,
    registeredDate: "2026-03-29",
    isSample: true
  }
];

// Initial Sample Emergency Requests (Curated for Hackathon Demonstration)
const SAMPLE_REQUESTS = [
  {
    id: "BC-REQ-301",
    patientName: "Rajesh K. Mehta",
    bloodGroup: "O-",
    unitsRequired: 2,
    hospitalName: "Lilavati Hospital & Research Centre",
    location: "Mumbai",
    area: "Bandra West",
    contactName: "Sunil Mehta (Son)",
    contactPhone: "+91 98200 11223",
    urgency: "Critical (< 2 hrs)",
    urgencyLevel: "critical", // critical, urgent, standard
    status: "Active",
    postedTime: "25 minutes ago",
    timestamp: Date.now() - 25 * 60 * 1000,
    notes: "Emergency cardiac bypass surgery scheduled. Rare O- donor needed urgently.",
    isSample: true
  },
  {
    id: "BC-REQ-302",
    patientName: "Kavita Singhania",
    bloodGroup: "A+",
    unitsRequired: 3,
    hospitalName: "Apollo Hospitals",
    location: "Bengaluru",
    area: "Bannerghatta Road",
    contactName: "Dr. Arvind Rao",
    contactPhone: "+91 98450 33445",
    urgency: "Urgent (< 12 hrs)",
    urgencyLevel: "urgent",
    status: "Active",
    postedTime: "1 hour ago",
    timestamp: Date.now() - 60 * 60 * 1000,
    notes: "Severe Dengue with low platelet count. Replacement blood required.",
    isSample: true
  },
  {
    id: "BC-REQ-303",
    patientName: "Master Vihaan Das",
    bloodGroup: "B+",
    unitsRequired: 1,
    hospitalName: "AIIMS New Delhi",
    location: "Delhi",
    area: "Ansari Nagar",
    contactName: "Pooja Das (Mother)",
    contactPhone: "+91 98100 55667",
    urgency: "Urgent (< 24 hrs)",
    urgencyLevel: "urgent",
    status: "Active",
    postedTime: "3 hours ago",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    notes: "Pediatric orthopedic surgery scheduled tomorrow morning.",
    isSample: true
  },
  {
    id: "BC-REQ-304",
    patientName: "Farhan Siddiqui",
    bloodGroup: "AB-",
    unitsRequired: 2,
    hospitalName: "KEM Hospital",
    location: "Pune",
    area: "Rasta Peth",
    contactName: "Imran Siddiqui (Brother)",
    contactPhone: "+91 98900 77889",
    urgency: "Standard (< 48 hrs)",
    urgencyLevel: "standard",
    status: "Active",
    postedTime: "5 hours ago",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    notes: "Thalassemia regular blood transfusion support required.",
    isSample: true
  }
];

// Scientific Blood Compatibility Matrix
// Key = Recipient's Blood Type
// canReceiveFrom = List of Donor Blood Groups that this recipient can safely receive
// canDonateTo = List of Recipient Blood Groups that this donor can safely donate to
const BLOOD_COMPATIBILITY = {
  "O-": {
    canReceiveFrom: ["O-"],
    canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    type: "Universal Red Cell Donor",
    description: "O- can only receive O- blood, but can be given to patients of ANY blood group in emergencies!"
  },
  "O+": {
    canReceiveFrom: ["O+", "O-"],
    canDonateTo: ["O+", "A+", "B+", "AB+"],
    type: "Most Common Donor",
    description: "O+ can receive from O+ and O-. It can donate to any Rh-positive patient."
  },
  "A-": {
    canReceiveFrom: ["A-", "O-"],
    canDonateTo: ["A-", "A+", "AB-", "AB+"],
    type: "Rare Rh-Negative Group",
    description: "A- can receive from A- and O-. Can safely donate to A-, A+, AB-, and AB+."
  },
  "A+": {
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    canDonateTo: ["A+", "AB+"],
    type: "High Demand Group",
    description: "A+ can receive from A+, A-, O+, and O-. Can donate to A+ and AB+ recipients."
  },
  "B-": {
    canReceiveFrom: ["B-", "O-"],
    canDonateTo: ["B-", "B+", "AB-", "AB+"],
    type: "Rare Rh-Negative Group",
    description: "B- can receive from B- and O-. Can safely donate to B-, B+, AB-, and AB+."
  },
  "B+": {
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    canDonateTo: ["B+", "AB+"],
    type: "Common Positive Group",
    description: "B+ can receive from B+, B-, O+, and O-. Can donate to B+ and AB+ patients."
  },
  "AB-": {
    canReceiveFrom: ["AB-", "A-", "B-", "O-"],
    canDonateTo: ["AB-", "AB+"],
    type: "Rare Rh-Negative Recipient",
    description: "AB- can receive all negative blood groups (AB-, A-, B-, O-). Can donate to AB- and AB+."
  },
  "AB+": {
    canReceiveFrom: ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
    canDonateTo: ["AB+"],
    type: "Universal Recipient",
    description: "AB+ is the Universal Recipient! Can receive red blood cells from any human blood group."
  }
};

// All Available Blood Groups
const ALL_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Popular Demo Cities for Quick Filter Chips
const POPULAR_CITIES = [
  "All Cities",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Kolkata",
  "Chennai",
  "Ahmedabad"
];
