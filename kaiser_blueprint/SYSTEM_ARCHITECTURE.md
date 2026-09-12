# 🏗️ KAISER AI — System Architecture & Operational Data Flows

This document details the operational data flows and high-level system interactions across citizens, municipal engineers, AI vision models, and cloud infrastructure.

---

## 1. High-Level System Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CITIZEN CLIENT LAYER                                   │
│  [ React 19 Mobile Viewfinder ] ──► [ Voice Dictation (मराठी / हिंदी / English) ]       │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTPS / REST (Port 8080)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               AWS API GATEWAY & SECURITY SHIELD                        │
│   - Rate Limiting (max 10 req/min per IP)                                              │
│   - 0ms pHash Duplicate Image Blocker                                                  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               EXPRESS BACKEND CORE (server.ts)                         │
│   - Phone OTP & JWT Session Authentication                                             │
│   - 24-Ward Point-in-Polygon GIS Centroid Router                                       │
│   - Dynamic SLA Countdown Engine (P1 Critical ➔ P4 Low)                                │
└───────────────────────┬────────────────────────────────────────┬───────────────────────┘
                        │                                        │
                        ▼                                        ▼
┌──────────────────────────────────────────────┐ ┌───────────────────────────────────────┐
│     EXTERNAL AI: GOOGLE GEMINI 3.6 FLASH     │ │       POSTGRESQL RELATIONAL DATABASE  │
│  - Multimodal Civic Hazard Verification      │ │  - users (Identity & Profile Stats)   │
│  - Automated Severity Scoring (P1 to P4)     │ │  - complaints (Coordinates & Details) │
│  - "Before & After" Repair Verification      │ │  - contractors (Work Orders & Fines ₹)│
└──────────────────────────────────────────────┘ │  - atrs (Official Printable Sign-Offs)│
                                                 └───────────────────┬───────────────────┘
                                                                     │
                                                                     ▼
                                                 ┌───────────────────────────────────────┐
                                                 │       AWS SNS NOTIFICATION ENGINE     │
                                                 │  - Transactional 4-Digit Login OTPs   │
                                                 │  - Real-Time "Pothole Fixed!" SMS     │
                                                 └───────────────────────────────────────┘
```

---

## 2. End-to-End Operational Lifecycle

### Flow A: The 5-Second Citizen Submission Flow
1. Citizen opens the web app on mobile $\rightarrow$ Camera viewfinder prompts immediately.
2. Citizen takes a photo of a road crater; GPS coordinates are locked in the background.
3. Citizen taps the mic and says in Hindi: *"Andheri station ke bahar sadak toot gayi hai"*; it auto-transcribes.
4. Gemini Flash analyzes the photo in ~800ms: confirms it's a real road hazard, scores it as `P2 High`, and routes it to `Ward K-West`.
5. Report is stored in PostgreSQL under the citizen's `user_id` and an instant tracking SMS is dispatched via AWS SNS.

### Flow B: Municipal Triage & Contractor Accountability
1. Ward Engineer opens the **Municipal Command Center**; the new `P2` ticket glows on the 24-Ward GIS Heatmap with a 48-hour SLA countdown badge.
2. Engineer assigns the job to *Shree Infrastructure & Roads Ltd* with 1 click.
3. Contractor receives work order with coordinates, required materials, and deadline.
4. **Enforced Penalty Rule:** If the contractor exceeds the SLA, the **Contractor Penalty Scorecard** automatically bills delay fines in Indian Rupees (₹) against their contract pool.
5. Contractor uploads an after photo of the filled road. Gemini AI performs the **Before/After Verification**.
6. When verified, a printable **Action Taken Report (ATR)** with a SHA-256 digital hash is generated for municipal audit records, and the citizen gets an SMS: *"Fixed! View before/after photo proof: [link]"*.
