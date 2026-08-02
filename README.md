# Kaiser
Final Project
FRONTEND LAYER  (Vercel / EC2)
React.js + Vite + Tailwind CSS + Leaflet.js
Citizen Portal   |   Ward Officer Dashboard
↓  HTTPS / REST API
BACKEND API LAYER  (EC2 / Render)
Node.js + Express.js  (Port 5000)
JWT Auth  |  Input Validation  |  Rate Limiting  |  Audit Logging
↓
RDS PostgreSQL
(Encrypted)
8 Tables	S3 Bucket
(Encrypted, Versioned)
Complaint Images	Lambda Functions
YOLOv8 | Embeddings
Severity Scoring
↓
AWS SNS
Email Notifications	CloudWatch
Logs, Metrics, Alarms	External APIs
Gemini | OpenWeather | Google OAuth

