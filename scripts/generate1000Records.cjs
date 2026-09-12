const fs = require("fs");
const path = require("path");

const categories = ["Pothole", "Garbage", "Drainage", "Streetlight", "Water Leakage", "Roadwork", "Other"];
const urgencies = ["Critical", "High", "Medium", "Low"];
const statuses = ["Reported", "Assigned", "In Progress", "Resolved"];

const wards = [
  { id: 1, name: "A (Colaba, Fort, Churchgate)", lat: 18.922, lng: 72.834, area: "Colaba Causeway" },
  { id: 2, name: "B (Sandhurst Road, Dongri)", lat: 18.955, lng: 72.838, area: "Mohammad Ali Road" },
  { id: 3, name: "C (Marine Lines, Kalbadevi)", lat: 18.948, lng: 72.825, area: "Kalbadevi Market" },
  { id: 4, name: "D (Grant Road, Malabar Hill)", lat: 18.963, lng: 72.808, area: "Pedder Road" },
  { id: 5, name: "E (Byculla, Mazgaon)", lat: 18.975, lng: 72.833, area: "Byculla Zoo Circle" },
  { id: 6, name: "F-North (Matunga, Sion)", lat: 19.035, lng: 72.858, area: "Sion Circle" },
  { id: 7, name: "F-South (Parel, Sewri)", lat: 18.995, lng: 72.845, area: "Parel TT Bridge" },
  { id: 8, name: "G-North (Dadar, Dharavi)", lat: 19.022, lng: 72.842, area: "Dadar West Station" },
  { id: 9, name: "H-West (Bandra West)", lat: 19.059, lng: 72.830, area: "SV Road Bandra" },
  { id: 10, name: "H-East (Bandra East, BKC)", lat: 19.065, lng: 72.868, area: "BKC Avenue 3" },
  { id: 11, name: "K-West (Andheri West, Juhu)", lat: 19.119, lng: 72.828, area: "Link Road Andheri" },
  { id: 12, name: "K-East (Andheri East, SEEPZ)", lat: 19.115, lng: 72.865, area: "SEEPZ Gate 1" },
  { id: 13, name: "L (Kurla, Sakinaka)", lat: 19.082, lng: 72.889, area: "LBS Marg Kurla" },
  { id: 14, name: "M-East (Govandi, Mankhurd)", lat: 19.048, lng: 72.915, area: "Govandi Station East" },
  { id: 15, name: "M-West (Chembur)", lat: 19.062, lng: 72.895, area: "Chembur Naka" },
  { id: 16, name: "N (Ghatkopar, Vidyavihar)", lat: 19.086, lng: 72.908, area: "Ghatkopar Station West" },
  { id: 17, name: "S (Bhandup, Powai)", lat: 19.117, lng: 72.905, area: "Powai Lake Promenade" },
  { id: 18, name: "T (Mulund)", lat: 19.172, lng: 72.956, area: "Mulund West MG Road" },
  { id: 19, name: "P-South (Goregaon)", lat: 19.160, lng: 72.845, area: "Goregaon SV Road" },
  { id: 20, name: "P-North (Malad)", lat: 19.185, lng: 72.848, area: "Malad Link Road" },
  { id: 21, name: "R-South (Kandivali)", lat: 19.208, lng: 72.852, area: "Kandivali Station Road" },
  { id: 22, name: "R-Central (Borivali)", lat: 19.230, lng: 72.856, area: "Borivali West Market" },
  { id: 23, name: "R-North (Dahisar)", lat: 19.255, lng: 72.860, area: "Dahisar Check Naka" },
  { id: 24, name: "G-South (Worli, Prabhadevi)", lat: 19.015, lng: 72.818, area: "Worli Sea Face" },
];

const citizenNames = [
  "Aarav Sharma", "Priya Mehta", "Rohan Deshmukh", "Ananya Rao", "Vikram Joshi",
  "Sneha Kulkarni", "Aditya Nair", "Kavya Iyer", "Siddharth Patil", "Tanvi Shah",
  "Rahul Verma", "Pooja Hegde", "Karan Malhotra", "Riya Sawant", "Amitabh Shinde",
  "Deepika Pawar", "Nikhil Kamble", "Meera Kadam", "Sanjay Parab", "Neha Gaikwad"
];

const photos = {
  Pothole: [
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
  ],
  Garbage: [
    "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
  ],
  Drainage: [
    "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  ],
  Streetlight: [
    "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80",
  ],
  "Water Leakage": [
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1527066579998-dbbae57f45ce?auto=format&fit=crop&w=800&q=80",
  ],
  Roadwork: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  ],
  Other: [
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  ]
};

const departmentMap = {
  Pothole: "Roads & Traffic Department (MCGM)",
  Garbage: "Solid Waste Management (SWM)",
  Drainage: "Storm Water Drains (SWD)",
  Streetlight: "BEST Electricity Supply & Transport",
  "Water Leakage": "Hydraulics Department (Water Supply)",
  Roadwork: "Infrastructure & Roads Department",
  Other: "General Municipal Services"
};

const records = [];

for (let i = 1; i <= 1000; i++) {
  const wardObj = wards[i % wards.length];
  const category = categories[i % categories.length];
  const urgency = urgencies[i % urgencies.length];
  const status = statuses[i % statuses.length];
  const reporterName = citizenNames[i % citizenNames.length];

  // Slight lat/lng variation around ward center
  const latVar = (Math.random() - 0.5) * 0.015;
  const lngVar = (Math.random() - 0.5) * 0.015;

  const severity = Math.floor(Math.random() * 55) + 40; // 40-95
  const catPhotos = photos[category] || photos["Other"];
  const imageUrl = catPhotos[i % catPhotos.length];

  const daysAgo = Math.floor(Math.random() * 25);
  const createdDate = new Date(Date.now() - 86400000 * daysAgo - Math.random() * 3600000 * 12);
  const updatedDate = new Date(createdDate.getTime() + 3600000 * (Math.floor(Math.random() * 18) + 2));

  const issueTitles = {
    Pothole: `Severe Pothole Patch on ${wardObj.area} Junction`,
    Garbage: `Uncollected Solid Waste Dump near ${wardObj.area}`,
    Drainage: `Clogged Stormwater Culvert at ${wardObj.area}`,
    Streetlight: `Non-Functional Streetlight Pole on ${wardObj.area}`,
    "Water Leakage": `High-Pressure Water Pipeline Burst near ${wardObj.area}`,
    Roadwork: `Unfinished Trenching Work causing Traffic Congestion at ${wardObj.area}`,
    Other: `Public Amenity Maintenance Required in ${wardObj.name}`
  };

  records.push({
    id: `COMP-${1000 + i}`,
    title: issueTitles[category] || `Civic Issue #${i} in ${wardObj.name}`,
    description: `Reported issue regarding ${category.toLowerCase()} at ${wardObj.area}. Verified by local citizen inspectors for expedited AMC dispatch.`,
    category,
    severity,
    urgency,
    status,
    latitude: parseFloat((wardObj.lat + latVar).toFixed(4)),
    longitude: parseFloat((wardObj.lng + lngVar).toFixed(4)),
    ward: wardObj.id,
    wardName: wardObj.name,
    locationAddress: `${wardObj.area}, Ward ${wardObj.id}, Mumbai`,
    imageUrl,
    reporterId: `usr-citizen-${(i % 100) + 1}`,
    reporterName,
    upvotes: [`usr-citizen-${(i % 50) + 1}`, `usr-citizen-${(i % 30) + 2}`],
    upvote_count: Math.floor(Math.random() * 85) + 5,
    comment_count: Math.floor(Math.random() * 6) + 1,
    assignedDepartment: departmentMap[category] || "General Municipal Services",
    slaDays: urgency === "Critical" ? 1 : urgency === "High" ? 2 : 3,
    aiSummary: `AI Verified ${category} issue with ${severity}% severity index. Recommended SLA target: ${urgency === "Critical" ? "24h" : "48h"}.`,
    aiSuggestedAction: `Dispatch ${departmentMap[category]} inspection crew to ${wardObj.area}.`,
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
    comments: [
      {
        id: `comm-${i}-1`,
        userId: `usr-citizen-${(i % 40) + 2}`,
        userName: "Local Resident",
        userRole: "Citizen",
        text: `Inspected on site at ${wardObj.area}. Needs urgent fix before peak evening traffic.`,
        createdAt: createdDate.toISOString(),
      }
    ]
  });
}

const outputPath = path.join(__dirname, "../data/complaints1000.json");
fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
console.log(`Successfully generated 1000 complaint records at ${outputPath}`);

const tsOutputPath = path.join(__dirname, "../src/data/initial1000Complaints.ts");
const tsContent = `import { Complaint } from "../types";\n\nexport const INITIAL_1000_COMPLAINTS: Complaint[] = ${JSON.stringify(records, null, 2)};\n`;
fs.writeFileSync(tsOutputPath, tsContent);
console.log(`Successfully generated TypeScript complaints dataset at ${tsOutputPath}`);

