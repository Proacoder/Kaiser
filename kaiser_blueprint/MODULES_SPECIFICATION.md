# 📦 KAISER AI — 10 Master Modules Specification

This document details each of the **10 Master Core System Modules**, outlining target users, code locations, core philosophy, and functional capabilities.

---

### 🔐 Module 1: Citizen Authentication & User Profile Layer
* **Target Audience:** All citizens reporting hazards or checking ticket progress.
* **Core Philosophy:** **Zero Password Friction, Permanent Database Identity**.
* **Primary Code Locations:** `src/context/AuthContext.tsx`, `src/pages/CitizenLogin.tsx`, `server/routes/auth.ts`
* **Key Capabilities:**
  * **Phone Number + 4-Digit OTP:** Instant SMS verification via AWS SNS (no passwords to remember).
  * **1-Click Google Sign-In:** Alternative OAuth option for instant mobile or desktop access.
  * **Auto-Account Creation:** Automatically provisions a verified user profile in the PostgreSQL `users` table on first verification.
  * **Citizen Impact Profile:** Tracks community metrics (`total_reports_filed`, `total_resolved`, `ward_name`).

---

### 🎙️ Module 2: High-Speed Reporting & Voice Dictation Client
* **Target Audience:** Ordinary citizens standing on the street with a mobile phone.
* **Core Philosophy:** **$< 5$ Seconds, Accessible to Everyone**.
* **Primary Code Locations:** `src/pages/ReportPage.tsx`, `src/components/ImageUploader.tsx`, `src/components/VoiceGrievanceDictation.tsx`
* **Key Capabilities:**
  * **Instant Camera Viewfinder:** Opens phone camera directly upon tapping "Report".
  * **Zero-Tap GPS Lock:** Automatically extracts high-accuracy latitude/longitude via HTML5 Geolocation.
  * **Voice Grievance Dictation (Web Speech API):** Citizens speak their complaint in Marathi, Hindi, or English; it transcribes into text automatically.
  * **Gemini Instant Vision:** Auto-detects category (Pothole, Water Leak, Garbage) and urgency before submission.

---

### 📂 Module 3: Citizen "My Grievances" Activity Portal
* **Target Audience:** Citizens tracking their submitted issues.
* **Core Philosophy:** **Proof of Action Builds 100x More Trust Than Badges**.
* **Primary Code Locations:** `src/pages/MyReportsPage.tsx`, `src/components/ComplaintCard.tsx`, `src/components/BeforeAfterSlider.tsx`
* **Key Capabilities:**
  * **Personal Complaint Feed:** Complete history of all reports submitted by the citizen (`WHERE user_id = current_user`).
  * **Live Status Progression:** Visual stage indicators (`Submitted` ➔ `Crew Assigned` ➔ `In Progress` ➔ `Resolved`).
  * **Interactive Before/After Slider:** Visual slider allowing citizens to swipe left/right between the broken hazard and the repaired road surface.

---

### 🌐 Module 4: Trilingual State Localization
* **Target Audience:** All residents of Mumbai and municipal ground staff.
* **Core Philosophy:** **No Citizen Left Behind Due to Language**.
* **Primary Code Locations:** `src/context/LanguageContext.tsx`
* **Key Capabilities:**
  * **1-Tap Language Switcher:** Instant switching between **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)**.
  * **Official Municipal Glossary:** Accurately translates official BMC ward terms, departments, and legal statuses.

---

### 👮 Module 5: Municipal Command Center & 24-Ward GIS Operations Room
* **Target Audience:** BMC Ward Junior Engineers, Assistant Commissioners, and Department Heads.
* **Core Philosophy:** **Triage Fast, Route Accurately**.
* **Primary Code Locations:** `src/pages/Dashboard.tsx`, `src/components/Heatmap.tsx`, `src/components/MumbaiMap.tsx`
* **Key Capabilities:**
  * **24-Ward GIS Heatmap:** Real-time incident clusters and hotspot density across all Mumbai wards (A to T).
  * **P1–P4 Prioritized Action Queue:** Emergency tickets (`P1` 24h SLA) float to the top with live countdown badges.
  * **Point-in-Polygon Ward Routing:** Coordinates automatically assign complaints to the correct local ward office.

---

### ⚖️ Module 6: Contractor Penalty Scorecard & SLA Engine
* **Target Audience:** Municipal audit officials, road department heads, and contractor managers.
* **Core Philosophy:** **Financial Consequences for Delays**.
* **Primary Code Locations:** `src/components/ContractorPenaltyScorecard.tsx`, `src/components/WardSlaCalculator.tsx`
* **Key Capabilities:**
  * **Contractor Directory:** Tracks assigned contractors (e.g. *Shree Infrastructure & Roads Ltd, Brihanmumbai Waste Logistics*).
  * **Overdue Delay Calculator:** Automatically flags work orders exceeding their 24h/48h/72h SLA deadlines.
  * **Penalty Pool (₹):** Calculates accumulating delay fines in Indian Rupees (e.g. `₹2,500 per day overdue`) deducted from contractor payouts.

---

### 📄 Module 7: Action Taken Report (ATR) Compliance Engine
* **Target Audience:** Government auditors, engineering supervisors, and public RTI records.
* **Core Philosophy:** **Tamper-Proof Administrative Transparency**.
* **Primary Code Locations:** `src/components/ActionTakenReportModal.tsx`
* **Key Capabilities:**
  * **Official Printable BMC Certificate:** Standardized completion report ready for printing or PDF export.
  * **Materials & Work Order Audit:** Details Work Order #, sub-engineer sign-off, and materials used (e.g. *High-durability Cold Mix Asphalt*).
  * **Digital Verification Hash:** Embedded SHA-256 verification hash to prevent forged repair sign-offs.

---

### 🧠 Module 8: Real Multimodal AI Vision & Anti-Spam Shield
* **Target Audience:** Automated backend verification system.
* **Core Philosophy:** **Zero Garbage Data Reaches Engineers**.
* **Primary Code Locations:** `server.ts`, `server/services/geminiVision.ts`, `server/utils/phash.ts`
* **Key Capabilities:**
  * **0ms Duplicate Blocker (pHash):** Generates a visual fingerprint for every image; re-uploading the same photo is blocked instantly.
  * **Deep Anti-Fraud Filter:** Rejects IDE code screenshots, indoor photos, memes, and AI synthetic roads.
  * **Mandatory Before/After Verification:** Contractors cannot close a ticket without uploading a photo that Gemini AI validates against the original damage.

---

### 🗄️ Module 9: PostgreSQL Relational Data Architecture
* **Target Audience:** Production application data layer.
* **Core Philosophy:** **Rock-Solid Enterprise Data Integrity**.
* **Primary Code Locations:** `kaiser_blueprint/DATABASE_SCHEMA.sql`, `lib/db.ts`
* **Key Capabilities:**
  * **Relational Tables:** Strict foreign-key linking between `users`, `complaints`, `contractors`, `penalties`, and `atrs`.
  * **Audit Trails:** Immutable timestamps recording every status update, who dispatched, and who repaired.
  * **Spatial Proximity Indexing:** Microsecond radius queries to group multiple reports of the same pothole within 50 meters into 1 master ticket.

---

### ☁️ Module 10: Cloud Infrastructure & AWS Notification Dispatcher
* **Target Audience:** Cloud operations & mobile notification delivery.
* **Core Philosophy:** **High Reliability, Fast Delivery**.
* **Primary Code Locations:** `Dockerfile`, `server/services/awsSns.ts`, `render.yaml`
* **Key Capabilities:**
  * **AWS SNS SMS Alerts:** Delivers transactional 4-digit OTPs and instant resolution SMS alerts (*"Your pothole in Bandra has been fixed!"*).
  * **AWS API Gateway:** Rate limits traffic and protects against DDoS attacks.
  * **Production Docker Container:** Multi-stage build running on port 8080 for Google Cloud Run, Render, or AWS ECS.
