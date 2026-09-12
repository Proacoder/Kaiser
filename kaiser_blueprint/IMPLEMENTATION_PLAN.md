# 🛠️ KAISER AI — Step-by-Step Implementation Roadmap

This document outlines the sequential, phase-by-phase execution plan for building the 10 Master Core Modules. Each phase can be triggered independently.

---

## 🚦 Implementation Phases

```text
  Phase 1: Codebase Pruning & Gimmick Purge
     │
     ▼
  Phase 2: PostgreSQL Relational Database Setup (AWS RDS / Supabase)
     │
     ▼
  Phase 3: Citizen Authentication (Phone OTP / Google) & "My Grievances" Portal
     │
     ▼
  Phase 4: High-Speed Reporting Client with Voice Dictation & Marathi/Hindi
     │
     ▼
  Phase 5: Real Gemini 3.6 Flash Vision Pipeline & pHash Duplicate Shield
     │
     ▼
  Phase 6: Municipal Command Center, Contractor Penalties & Printable ATR
     │
     ▼
  Phase 7: Cloud DevOps Containerization & AWS SNS Notification Delivery
```

---

### 🧹 Phase 1: Codebase Pruning & Dead-Weight Purge
* **Goal:** Eliminate fluff, gimmicks, and performance bottlenecks.
* **Tasks:**
  1. Remove `src/components/EmergencySOSModal.tsx` (off-topic for civic maintenance).
  2. Remove `src/components/CivicPollWidget.tsx` (distraction from hazard dispatch).
  3. Strip parallax scroll-jacking wrappers (`SmoothScroll.tsx`, `ScrollExpand.tsx`, `InteractiveScrollShowcase.tsx`).
  4. Remove simulated JavaScript YOLO generator (`generateYoloDetections` in `server.ts`).
  5. Clean up unused placeholder files in `ai_service/modules/`.

---

### 🗄️ Phase 2: PostgreSQL Relational Database Setup
* **Goal:** Establish ACID-compliant database architecture replacing `reports.json`.
* **Tasks:**
  1. Execute `DATABASE_SCHEMA.sql` in PostgreSQL instance (Supabase or AWS RDS).
  2. Implement connection pooling in `lib/db.ts` with retry logic.
  3. Seed initial 24 Mumbai administrative ward centroids and active contractors.

---

### 🔐 Phase 3: Citizen Authentication & "My Grievances" Portal
* **Goal:** Permanent citizen identity and personal complaint tracking.
* **Tasks:**
  1. Implement Phone OTP routes (`POST /api/auth/send-otp`, `POST /api/auth/verify-otp`).
  2. Set up JWT session tokens in secure HTTP-only cookies.
  3. Wire `MyReportsPage.tsx` to display user's personal complaint timeline with live status badges.
  4. Wire `BeforeAfterSlider.tsx` for visual repair confirmation.

---

### 🎙️ Phase 4: High-Speed Reporting with Voice Dictation & Localization
* **Goal:** $< 5$-second mobile reporting accessible in English, Marathi, and Hindi.
* **Tasks:**
  1. Refactor `ReportPage.tsx` for immediate camera viewfinder access on load.
  2. Plug `VoiceGrievanceDictation.tsx` (Web Speech API) directly into the description field.
  3. Ensure `LanguageContext.tsx` toggles English (`en`), Marathi (`mr`), and Hindi (`hi`) across all reporting components.

---

### 🧠 Phase 5: Gemini 3.6 Flash Vision & pHash Anti-Spam Pipeline
* **Goal:** Ensure 100% of tickets reaching municipal engineers are real, unique, and verified.
* **Tasks:**
  1. Implement 64-bit perceptual image hashing (pHash) utility.
  2. Wire Google Gemini 3.6 Flash for hazard categorization and automated P1–P4 severity scoring.
  3. Implement `POST /api/ai/verify-resolution` for automated Before/After repair validation.

---

### 👮 Phase 6: Municipal Command Center, Contractor Penalties & ATR
* **Goal:** Equip municipal officers with real-time operations and contractor enforcement.
* **Tasks:**
  1. Polish `Dashboard.tsx` into a dark-mode 24-Ward GIS operations room.
  2. Connect `ContractorPenaltyScorecard.tsx` to calculate overdue delay fines in Indian Rupees (₹).
  3. Connect `ActionTakenReportModal.tsx` for generating printable official BMC compliance certificates with SHA-256 hashes.

---

### ☁️ Phase 7: Cloud DevOps Containerization & AWS SNS Alerts
* **Goal:** Production-grade deployment and real-time citizen communication.
* **Tasks:**
  1. Connect AWS SNS SDK to dispatch SMS text alerts on status transitions (`Submitted`, `Dispatched`, `Resolved`).
  2. Configure AWS API Gateway for SSL and rate limiting.
  3. Build and test multi-stage Docker container on port 8080.
