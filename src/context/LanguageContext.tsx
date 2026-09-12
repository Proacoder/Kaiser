import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "mr" | "hi";

interface Translations {
  // Navigation
  home: string;
  dashboard: string;
  report: string;
  myReports: string;
  map: string;
  officers: string;
  login: string;
  logout: string;
  register: string;
  admin: string;
  rewards: string;
  language: string;

  // Home / Hero
  heroTitle: string;
  heroSubtitle: string;
  reportNow: string;
  viewDashboard: string;
  exploreAsGuest: string;
  activeComplaints: string;
  resolvedToday: string;
  wardsActive: string;
  avgResolutionTime: string;

  // Auth
  citizenSignIn: string;
  officerSignIn: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
  sendOtp: string;
  verifyOtp: string;
  enterOtp: string;
  googleSignIn: string;
  welcomeBack: string;
  signUpNow: string;
  forgotPassword: string;
  demoAccounts: string;
  oneClickSignIn: string;

  // Report Page
  reportIncident: string;
  takePhoto: string;
  addDescription: string;
  speakDescription: string;
  detectingLocation: string;
  locationDetected: string;
  category: string;
  severity: string;
  submitReport: string;
  analysisInProgress: string;
  reportSubmitted: string;
  voiceHint: string;
  categories: {
    pothole: string;
    garbage: string;
    drainage: string;
    streetlight: string;
    waterLeakage: string;
    roadwork: string;
    other: string;
  };

  // My Grievances
  myGrievances: string;
  noReportsYet: string;
  reportFirstIssue: string;
  ticketId: string;
  submittedOn: string;
  lastUpdated: string;
  beforePhoto: string;
  afterPhoto: string;
  viewDetails: string;

  // Statuses
  statuses: {
    reported: string;
    assigned: string;
    inProgress: string;
    resolved: string;
  };

  // Urgency
  urgency: {
    critical: string;
    high: string;
    medium: string;
    low: string;
  };

  // Dashboard / Command Center
  commandCenter: string;
  wardOperations: string;
  totalTickets: string;
  pendingAction: string;
  resolvedTickets: string;
  criticalP1: string;
  slaBreached: string;
  assignTicket: string;
  dispatchCrew: string;
  markResolved: string;
  filterByWard: string;
  filterByStatus: string;
  filterByCategory: string;
  searchTickets: string;
  exportReport: string;
  generateAtr: string;
  slaDays: string;
  daysOverdue: string;
  hoursLeft: string;
  assignedOfficer: string;
  assignedContractor: string;

  // Contractor / SLA
  contractorScorecard: string;
  penaltyAmount: string;
  overdueBy: string;
  totalFine: string;
  deductFromPayout: string;
  onTime: string;
  breached: string;
  warningZone: string;

  // ATR
  actionTakenReport: string;
  workOrderNo: string;
  materialsUsed: string;
  engineerSignOff: string;
  completionDate: string;
  digitalHash: string;
  printCertificate: string;
  bmcCompliance: string;

  // General
  ward: string;
  wards: string;
  mumbai: string;
  bmc: string;
  submit: string;
  cancel: string;
  close: string;
  loading: string;
  error: string;
  success: string;
  back: string;
  next: string;
  save: string;
  delete: string;
  confirm: string;
  search: string;
  filter: string;
  sort: string;
  view: string;
  edit: string;
  download: string;
  print: string;
  share: string;
  copy: string;
  refresh: string;
  retry: string;

  // Ward Names (A-T)
  wardNames: {
    [key: string]: string;
  };

  // Departments
  departments: {
    roads: string;
    drainage: string;
    solidWaste: string;
    waterSupply: string;
    stormWater: string;
    streetLight: string;
    electrical: string;
    gardens: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    home: "Home",
    dashboard: "Command Center",
    report: "Report Incident",
    myReports: "My Grievances",
    map: "Live Map",
    officers: "Officers",
    login: "Sign In",
    logout: "Sign Out",
    register: "Register",
    admin: "Admin",
    rewards: "Rewards",
    language: "Language",

    heroTitle: "Mumbai's Civic Hazard Intelligence Platform",
    heroSubtitle: "Report road damage, water leaks and civic issues in under 5 seconds. AI-powered triage routes your complaint directly to the right BMC ward engineer.",
    reportNow: "Report Incident",
    viewDashboard: "Command Center",
    exploreAsGuest: "Explore as Guest",
    activeComplaints: "Active Complaints",
    resolvedToday: "Resolved Today",
    wardsActive: "Wards Active",
    avgResolutionTime: "Avg Resolution",

    citizenSignIn: "Citizen Sign In",
    officerSignIn: "Officer Sign In",
    phoneNumber: "Mobile Number (+91)",
    emailAddress: "Email Address",
    password: "Password",
    sendOtp: "Send OTP",
    verifyOtp: "Verify OTP",
    enterOtp: "Enter 4-Digit OTP",
    googleSignIn: "Continue with Google",
    welcomeBack: "Welcome back",
    signUpNow: "Sign Up",
    forgotPassword: "Forgot password?",
    demoAccounts: "Demo Resident Accounts",
    oneClickSignIn: "1-Click Sign In",

    reportIncident: "Report Civic Incident",
    takePhoto: "Take Photo",
    addDescription: "Describe the issue",
    speakDescription: "Speak your complaint",
    detectingLocation: "Detecting your location…",
    locationDetected: "Location detected",
    category: "Category",
    severity: "Severity",
    submitReport: "Submit Report",
    analysisInProgress: "AI is analysing your photo…",
    reportSubmitted: "Report submitted successfully!",
    voiceHint: "Tap mic and speak in English, Marathi or Hindi",
    categories: {
      pothole: "Pothole",
      garbage: "Garbage / Solid Waste",
      drainage: "Drainage / Nullah",
      streetlight: "Streetlight",
      waterLeakage: "Water Leakage",
      roadwork: "Road Excavation",
      other: "Other",
    },

    myGrievances: "My Grievances",
    noReportsYet: "No complaints filed yet",
    reportFirstIssue: "Report your first civic issue",
    ticketId: "Ticket ID",
    submittedOn: "Submitted",
    lastUpdated: "Last Updated",
    beforePhoto: "Before Photo",
    afterPhoto: "After Photo (BMC Verified)",
    viewDetails: "View Details",

    statuses: {
      reported: "Submitted",
      assigned: "Crew Assigned",
      inProgress: "In Progress",
      resolved: "Resolved",
    },

    urgency: {
      critical: "P1 — Critical",
      high: "P2 — High",
      medium: "P3 — Medium",
      low: "P4 — Low",
    },

    commandCenter: "Municipal Command Center",
    wardOperations: "24-Ward Operations Room",
    totalTickets: "Total Tickets",
    pendingAction: "Pending Action",
    resolvedTickets: "Resolved",
    criticalP1: "P1 Critical",
    slaBreached: "SLA Breached",
    assignTicket: "Assign Ticket",
    dispatchCrew: "Dispatch Crew",
    markResolved: "Mark Resolved",
    filterByWard: "Filter by Ward",
    filterByStatus: "Filter by Status",
    filterByCategory: "Filter by Category",
    searchTickets: "Search tickets…",
    exportReport: "Export Report",
    generateAtr: "Generate ATR",
    slaDays: "SLA Days",
    daysOverdue: "Days Overdue",
    hoursLeft: "Hours Left",
    assignedOfficer: "Assigned Officer",
    assignedContractor: "Contractor",

    contractorScorecard: "Contractor Penalty Scorecard",
    penaltyAmount: "Penalty Amount",
    overdueBy: "Overdue by",
    totalFine: "Total Fine",
    deductFromPayout: "Deduct from Payout",
    onTime: "On Time",
    breached: "SLA Breached",
    warningZone: "Warning Zone",

    actionTakenReport: "Action Taken Report (ATR)",
    workOrderNo: "Work Order No.",
    materialsUsed: "Materials Used",
    engineerSignOff: "Engineer Sign-Off",
    completionDate: "Completion Date",
    digitalHash: "Digital Verification Hash (SHA-256)",
    printCertificate: "Print BMC Certificate",
    bmcCompliance: "BMC Compliance Certificate",

    ward: "Ward",
    wards: "Wards",
    mumbai: "Mumbai",
    bmc: "BMC",
    submit: "Submit",
    cancel: "Cancel",
    close: "Close",
    loading: "Loading…",
    error: "Error",
    success: "Success",
    back: "Back",
    next: "Next",
    save: "Save",
    delete: "Delete",
    confirm: "Confirm",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    view: "View",
    edit: "Edit",
    download: "Download",
    print: "Print",
    share: "Share",
    copy: "Copy",
    refresh: "Refresh",
    retry: "Retry",

    wardNames: {
      "A": "Ward A — Colaba / Fort",
      "B": "Ward B — Mandvi / Pydhonie",
      "C": "Ward C — Marine Lines / Girgaon",
      "D": "Ward D — Malabar Hill / Walkeshwar",
      "E": "Ward E — Byculla / Mazgaon",
      "F-North": "Ward F-North — Matunga / Sion",
      "F-South": "Ward F-South — Dharavi / Wadala",
      "G-North": "Ward G-North — Dadar West / Shivaji Park",
      "G-South": "Ward G-South — Worli / Prabhadevi",
      "H-East": "Ward H-East — Bandra East / Kherwadi",
      "H-West": "Ward H-West — Bandra West / Khar",
      "K-East": "Ward K-East — Andheri East / MIDC",
      "K-West": "Ward K-West — Andheri West / Versova",
      "L": "Ward L — Kurla / Chunabhatti",
      "M-East": "Ward M-East — Govandi / Mankhurd",
      "M-West": "Ward M-West — Chembur West / Tilak Nagar",
      "N": "Ward N — Ghatkopar / Vikhroli",
      "P-North": "Ward P-North — Malad / Malvani",
      "P-South": "Ward P-South — Goregaon / Aarey",
      "R-Central": "Ward R-Central — Borivali / Kandivali",
      "R-North": "Ward R-North — Dahisar / Kandivali North",
      "R-South": "Ward R-South — Borivali West",
      "S": "Ward S — Mulund West / Nahur",
      "T": "Ward T — Mulund East / Bhandup",
    },

    departments: {
      roads: "Roads & Traffic",
      drainage: "Drainage & Sewerage",
      solidWaste: "Solid Waste Management",
      waterSupply: "Water Supply",
      stormWater: "Storm Water Drains",
      streetLight: "Street Lighting",
      electrical: "Electrical",
      gardens: "Gardens & Open Spaces",
    },
  },

  mr: {
    home: "मुख्यपृष्ठ",
    dashboard: "नियंत्रण कक्ष",
    report: "तक्रार नोंदवा",
    myReports: "माझ्या तक्रारी",
    map: "थेट नकाशा",
    officers: "अधिकारी",
    login: "प्रवेश करा",
    logout: "बाहेर पडा",
    register: "नोंदणी करा",
    admin: "प्रशासन",
    rewards: "पुरस्कार",
    language: "भाषा",

    heroTitle: "मुंबईचे नागरी समस्या बुद्धिमत्ता व्यासपीठ",
    heroSubtitle: "रस्त्यांचे नुकसान, पाणी गळती आणि नागरी समस्या ५ सेकंदांत नोंदवा. AI द्वारे तुमची तक्रार थेट योग्य BMC वॉर्ड अभियंत्याकडे पाठवली जाते.",
    reportNow: "तक्रार नोंदवा",
    viewDashboard: "नियंत्रण कक्ष",
    exploreAsGuest: "पाहुणे म्हणून पाहा",
    activeComplaints: "सक्रिय तक्रारी",
    resolvedToday: "आज निराकरण झाले",
    wardsActive: "सक्रिय वॉर्ड",
    avgResolutionTime: "सरासरी निराकरण वेळ",

    citizenSignIn: "नागरिक प्रवेश",
    officerSignIn: "अधिकारी प्रवेश",
    phoneNumber: "मोबाईल नंबर (+91)",
    emailAddress: "ईमेल पत्ता",
    password: "पासवर्ड",
    sendOtp: "OTP पाठवा",
    verifyOtp: "OTP सत्यापित करा",
    enterOtp: "४-अंकी OTP टाका",
    googleSignIn: "Google सह सुरू ठेवा",
    welcomeBack: "पुनः स्वागत",
    signUpNow: "नोंदणी करा",
    forgotPassword: "पासवर्ड विसरलात?",
    demoAccounts: "डेमो रहिवासी खाती",
    oneClickSignIn: "१-क्लिक प्रवेश",

    reportIncident: "नागरी घटना नोंदवा",
    takePhoto: "फोटो काढा",
    addDescription: "समस्या सांगा",
    speakDescription: "तक्रार बोला",
    detectingLocation: "स्थान शोधत आहे…",
    locationDetected: "स्थान आढळले",
    category: "श्रेणी",
    severity: "तीव्रता",
    submitReport: "तक्रार सादर करा",
    analysisInProgress: "AI तुमचा फोटो विश्लेषित करत आहे…",
    reportSubmitted: "तक्रार यशस्वीरीत्या सादर केली!",
    voiceHint: "मायक्रोफोन दाबा आणि मराठी, हिंदी किंवा इंग्रजीत बोला",
    categories: {
      pothole: "खड्डा",
      garbage: "कचरा / घनकचरा",
      drainage: "गटार / नाला",
      streetlight: "रस्ता दिवा",
      waterLeakage: "पाणी गळती",
      roadwork: "रस्ता खोदकाम",
      other: "इतर",
    },

    myGrievances: "माझ्या तक्रारी",
    noReportsYet: "अजून कोणतीही तक्रार नाही",
    reportFirstIssue: "तुमची पहिली नागरी समस्या नोंदवा",
    ticketId: "तिकीट क्रमांक",
    submittedOn: "सादर केले",
    lastUpdated: "शेवटचे अद्यतनित",
    beforePhoto: "आधीचा फोटो",
    afterPhoto: "नंतरचा फोटो (BMC सत्यापित)",
    viewDetails: "तपशील पाहा",

    statuses: {
      reported: "सादर केले",
      assigned: "दल नियुक्त",
      inProgress: "प्रगतीपथावर",
      resolved: "निराकरण झाले",
    },

    urgency: {
      critical: "P1 — अत्यंत तातडीचे",
      high: "P2 — उच्च",
      medium: "P3 — मध्यम",
      low: "P4 — कमी",
    },

    commandCenter: "महापालिका नियंत्रण कक्ष",
    wardOperations: "२४-वॉर्ड कार्यालय",
    totalTickets: "एकूण तिकिटे",
    pendingAction: "प्रलंबित कार्यवाही",
    resolvedTickets: "निराकरण झाले",
    criticalP1: "P1 अत्यंत तातडीचे",
    slaBreached: "SLA उल्लंघन",
    assignTicket: "तिकीट नियुक्त करा",
    dispatchCrew: "दल पाठवा",
    markResolved: "निराकरण म्हणून चिन्हांकित करा",
    filterByWard: "वॉर्डनुसार फिल्टर",
    filterByStatus: "स्थितीनुसार फिल्टर",
    filterByCategory: "श्रेणीनुसार फिल्टर",
    searchTickets: "तिकिटे शोधा…",
    exportReport: "अहवाल निर्यात करा",
    generateAtr: "ATR तयार करा",
    slaDays: "SLA दिवस",
    daysOverdue: "दिवस उशिरा",
    hoursLeft: "तास शिल्लक",
    assignedOfficer: "नियुक्त अधिकारी",
    assignedContractor: "कंत्राटदार",

    contractorScorecard: "कंत्राटदार दंड गुणपत्रिका",
    penaltyAmount: "दंड रक्कम",
    overdueBy: "उशिरा",
    totalFine: "एकूण दंड",
    deductFromPayout: "पेआउटमधून कापा",
    onTime: "वेळेवर",
    breached: "SLA उल्लंघन",
    warningZone: "इशारा क्षेत्र",

    actionTakenReport: "केलेल्या कार्यवाहीचा अहवाल (ATR)",
    workOrderNo: "कार्य आदेश क्र.",
    materialsUsed: "वापरलेले साहित्य",
    engineerSignOff: "अभियंत्याची मान्यता",
    completionDate: "पूर्णता तारीख",
    digitalHash: "डिजिटल सत्यापन हॅश (SHA-256)",
    printCertificate: "BMC प्रमाणपत्र प्रिंट करा",
    bmcCompliance: "BMC अनुपालन प्रमाणपत्र",

    ward: "वॉर्ड",
    wards: "वॉर्ड",
    mumbai: "मुंबई",
    bmc: "BMC",
    submit: "सादर करा",
    cancel: "रद्द करा",
    close: "बंद करा",
    loading: "लोड होत आहे…",
    error: "त्रुटी",
    success: "यशस्वी",
    back: "मागे",
    next: "पुढे",
    save: "जतन करा",
    delete: "हटवा",
    confirm: "पुष्टी करा",
    search: "शोधा",
    filter: "फिल्टर",
    sort: "क्रमवारी",
    view: "पाहा",
    edit: "संपादित करा",
    download: "डाउनलोड",
    print: "प्रिंट",
    share: "शेअर करा",
    copy: "कॉपी करा",
    refresh: "रिफ्रेश",
    retry: "पुन्हा प्रयत्न करा",

    wardNames: {
      "A": "वॉर्ड A — कुलाबा / फोर्ट",
      "B": "वॉर्ड B — मांडवी / पायधुनी",
      "C": "वॉर्ड C — मरीन लाइन्स / गिरगाव",
      "D": "वॉर्ड D — मलबार हिल / वाळकेश्वर",
      "E": "वॉर्ड E — भायखळा / माझगाव",
      "F-North": "वॉर्ड F-North — माटुंगा / शीव",
      "F-South": "वॉर्ड F-South — धारावी / वडाळा",
      "G-North": "वॉर्ड G-North — दादर पश्चिम / शिवाजी पार्क",
      "G-South": "वॉर्ड G-South — वरळी / प्रभादेवी",
      "H-East": "वॉर्ड H-East — वांद्रे पूर्व / खेरवाडी",
      "H-West": "वॉर्ड H-West — वांद्रे पश्चिम / खार",
      "K-East": "वॉर्ड K-East — अंधेरी पूर्व / MIDC",
      "K-West": "वॉर्ड K-West — अंधेरी पश्चिम / वर्सोवा",
      "L": "वॉर्ड L — कुर्ला / चुनाभट्टी",
      "M-East": "वॉर्ड M-East — गोवंडी / मानखुर्द",
      "M-West": "वॉर्ड M-West — चेंबूर पश्चिम / तिलक नगर",
      "N": "वॉर्ड N — घाटकोपर / विक्रोळी",
      "P-North": "वॉर्ड P-North — मालाड / मालवणी",
      "P-South": "वॉर्ड P-South — गोरेगाव / आरे",
      "R-Central": "वॉर्ड R-Central — बोरिवली / कांदिवली",
      "R-North": "वॉर्ड R-North — दहिसर / कांदिवली उत्तर",
      "R-South": "वॉर्ड R-South — बोरिवली पश्चिम",
      "S": "वॉर्ड S — मुलुंड पश्चिम / नाहूर",
      "T": "वॉर्ड T — मुलुंड पूर्व / भांडुप",
    },

    departments: {
      roads: "रस्ते व वाहतूक",
      drainage: "सांडपाणी व गटार",
      solidWaste: "घनकचरा व्यवस्थापन",
      waterSupply: "पाणीपुरवठा",
      stormWater: "वादळ पाण्याचे नाले",
      streetLight: "रस्ता प्रकाशयोजना",
      electrical: "विद्युत",
      gardens: "उद्याने व खुल्या जागा",
    },
  },

  hi: {
    home: "मुख्य पृष्ठ",
    dashboard: "नियंत्रण केंद्र",
    report: "शिकायत दर्ज करें",
    myReports: "मेरी शिकायतें",
    map: "लाइव मैप",
    officers: "अधिकारी",
    login: "साइन इन",
    logout: "साइन आउट",
    register: "पंजीकरण",
    admin: "प्रशासन",
    rewards: "पुरस्कार",
    language: "भाषा",

    heroTitle: "मुंबई का नागरिक खतरा बुद्धिमत्ता मंच",
    heroSubtitle: "सड़कों की क्षति, पानी की लीकेज और नागरिक समस्याएं 5 सेकंड में दर्ज करें। AI द्वारा आपकी शिकायत सीधे सही BMC वार्ड इंजीनियर के पास भेजी जाती है।",
    reportNow: "शिकायत दर्ज करें",
    viewDashboard: "नियंत्रण केंद्र",
    exploreAsGuest: "अतिथि के रूप में देखें",
    activeComplaints: "सक्रिय शिकायतें",
    resolvedToday: "आज निवारण हुआ",
    wardsActive: "सक्रिय वार्ड",
    avgResolutionTime: "औसत निवारण समय",

    citizenSignIn: "नागरिक साइन इन",
    officerSignIn: "अधिकारी साइन इन",
    phoneNumber: "मोबाइल नंबर (+91)",
    emailAddress: "ईमेल पता",
    password: "पासवर्ड",
    sendOtp: "OTP भेजें",
    verifyOtp: "OTP सत्यापित करें",
    enterOtp: "4-अंकीय OTP दर्ज करें",
    googleSignIn: "Google से जारी रखें",
    welcomeBack: "वापस स्वागत है",
    signUpNow: "साइन अप करें",
    forgotPassword: "पासवर्ड भूल गए?",
    demoAccounts: "डेमो निवासी खाते",
    oneClickSignIn: "1-क्लिक साइन इन",

    reportIncident: "नागरिक घटना दर्ज करें",
    takePhoto: "फोटो लें",
    addDescription: "समस्या बताएं",
    speakDescription: "शिकायत बोलें",
    detectingLocation: "स्थान खोजा जा रहा है…",
    locationDetected: "स्थान मिल गया",
    category: "श्रेणी",
    severity: "गंभीरता",
    submitReport: "शिकायत सबमिट करें",
    analysisInProgress: "AI आपकी फोटो का विश्लेषण कर रहा है…",
    reportSubmitted: "शिकायत सफलतापूर्वक सबमिट हुई!",
    voiceHint: "माइक दबाएं और हिंदी, मराठी या अंग्रेज़ी में बोलें",
    categories: {
      pothole: "गड्ढा",
      garbage: "कूड़ा / ठोस कचरा",
      drainage: "नाली / नाला",
      streetlight: "सड़क बत्ती",
      waterLeakage: "पानी की लीकेज",
      roadwork: "सड़क खुदाई",
      other: "अन्य",
    },

    myGrievances: "मेरी शिकायतें",
    noReportsYet: "अभी तक कोई शिकायत नहीं",
    reportFirstIssue: "अपनी पहली नागरिक समस्या दर्ज करें",
    ticketId: "टिकट संख्या",
    submittedOn: "सबमिट किया",
    lastUpdated: "अंतिम अपडेट",
    beforePhoto: "पहले की फोटो",
    afterPhoto: "बाद की फोटो (BMC सत्यापित)",
    viewDetails: "विवरण देखें",

    statuses: {
      reported: "सबमिट किया",
      assigned: "दल नियुक्त",
      inProgress: "प्रगति पर",
      resolved: "निवारण हुआ",
    },

    urgency: {
      critical: "P1 — अत्यंत जरूरी",
      high: "P2 — उच्च",
      medium: "P3 — मध्यम",
      low: "P4 — कम",
    },

    commandCenter: "नगर निगम नियंत्रण केंद्र",
    wardOperations: "24-वार्ड संचालन कक्ष",
    totalTickets: "कुल टिकट",
    pendingAction: "लंबित कार्यवाही",
    resolvedTickets: "निवारण हुआ",
    criticalP1: "P1 अत्यंत जरूरी",
    slaBreached: "SLA उल्लंघन",
    assignTicket: "टिकट नियुक्त करें",
    dispatchCrew: "दल भेजें",
    markResolved: "निवारण के रूप में चिह्नित करें",
    filterByWard: "वार्ड के अनुसार फ़िल्टर",
    filterByStatus: "स्थिति के अनुसार फ़िल्टर",
    filterByCategory: "श्रेणी के अनुसार फ़िल्टर",
    searchTickets: "टिकट खोजें…",
    exportReport: "रिपोर्ट निर्यात करें",
    generateAtr: "ATR बनाएं",
    slaDays: "SLA दिन",
    daysOverdue: "दिन देर",
    hoursLeft: "घंटे बचे",
    assignedOfficer: "नियुक्त अधिकारी",
    assignedContractor: "ठेकेदार",

    contractorScorecard: "ठेकेदार जुर्माना स्कोरकार्ड",
    penaltyAmount: "जुर्माना राशि",
    overdueBy: "देर से",
    totalFine: "कुल जुर्माना",
    deductFromPayout: "भुगतान से काटें",
    onTime: "समय पर",
    breached: "SLA उल्लंघन",
    warningZone: "चेतावनी क्षेत्र",

    actionTakenReport: "की गई कार्यवाही रिपोर्ट (ATR)",
    workOrderNo: "कार्य आदेश सं.",
    materialsUsed: "उपयोग की गई सामग्री",
    engineerSignOff: "इंजीनियर की मंजूरी",
    completionDate: "पूर्णता तिथि",
    digitalHash: "डिजिटल सत्यापन हैश (SHA-256)",
    printCertificate: "BMC प्रमाणपत्र प्रिंट करें",
    bmcCompliance: "BMC अनुपालन प्रमाणपत्र",

    ward: "वार्ड",
    wards: "वार्ड",
    mumbai: "मुंबई",
    bmc: "BMC",
    submit: "सबमिट करें",
    cancel: "रद्द करें",
    close: "बंद करें",
    loading: "लोड हो रहा है…",
    error: "त्रुटि",
    success: "सफल",
    back: "वापस",
    next: "अगला",
    save: "सहेजें",
    delete: "हटाएं",
    confirm: "पुष्टि करें",
    search: "खोजें",
    filter: "फ़िल्टर",
    sort: "क्रमबद्ध",
    view: "देखें",
    edit: "संपादित करें",
    download: "डाउनलोड",
    print: "प्रिंट",
    share: "शेयर करें",
    copy: "कॉपी करें",
    refresh: "रिफ्रेश",
    retry: "पुनः प्रयास करें",

    wardNames: {
      "A": "वार्ड A — कोलाबा / फोर्ट",
      "B": "वार्ड B — माँडवी / पाइधुनी",
      "C": "वार्ड C — मरीन लाइन्स / गिरगाँव",
      "D": "वार्ड D — मलबार हिल / वालकेश्वर",
      "E": "वार्ड E — भायखला / माझगाँव",
      "F-North": "वार्ड F-North — माटुंगा / सियोन",
      "F-South": "वार्ड F-South — धारावी / वडाला",
      "G-North": "वार्ड G-North — दादर पश्चिम / शिवाजी पार्क",
      "G-South": "वार्ड G-South — वर्ली / प्रभादेवी",
      "H-East": "वार्ड H-East — बांद्रा पूर्व / खेरवाड़ी",
      "H-West": "वार्ड H-West — बांद्रा पश्चिम / खार",
      "K-East": "वार्ड K-East — अंधेरी पूर्व / MIDC",
      "K-West": "वार्ड K-West — अंधेरी पश्चिम / वर्सोवा",
      "L": "वार्ड L — कुर्ला / चुनाभट्टी",
      "M-East": "वार्ड M-East — गोवंडी / मानखुर्द",
      "M-West": "वार्ड M-West — चेंबूर पश्चिम / तिलक नगर",
      "N": "वार्ड N — घाटकोपर / विक्रोली",
      "P-North": "वार्ड P-North — मालाड / मालवानी",
      "P-South": "वार्ड P-South — गोरेगाँव / आरे",
      "R-Central": "वार्ड R-Central — बोरीवली / कांदिवली",
      "R-North": "वार्ड R-North — दहिसर / कांदिवली उत्तर",
      "R-South": "वार्ड R-South — बोरीवली पश्चिम",
      "S": "वार्ड S — मुलुंड पश्चिम / नाहुर",
      "T": "वार्ड T — मुलुंड पूर्व / भांडुप",
    },

    departments: {
      roads: "सड़क एवं यातायात",
      drainage: "सीवरेज एवं नाली",
      solidWaste: "ठोस कचरा प्रबंधन",
      waterSupply: "जलापूर्ति",
      stormWater: "तूफानी जल नाली",
      streetLight: "सड़क प्रकाश",
      electrical: "विद्युत",
      gardens: "बगीचे एवं खुले स्थान",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("kaiser_language");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("kaiser_language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
