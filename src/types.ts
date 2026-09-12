export type UrgencyLevel = "Critical" | "High" | "Medium" | "Low";
export type ComplaintStatus = "Reported" | "Assigned" | "In Progress" | "Resolved";
export type ComplaintCategory = 
  | "Pothole" 
  | "Garbage" 
  | "Drainage" 
  | "Streetlight" 
  | "Water Leakage" 
  | "Roadwork" 
  | "Other";

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  severity: number; // 1 to 100
  urgency: UrgencyLevel;
  status: ComplaintStatus;
  latitude: number;
  longitude: number;
  ward: number;
  wardName: string;
  locationAddress: string;
  imageUrl?: string;
  reporterId: string;
  reporterName: string;
  upvotes: string[];
  upvote_count: number;
  comment_count: number;
  comments: Comment[];
  assignedDepartment?: string;
  slaDays: number;
  aiSummary?: string;
  aiSuggestedAction?: string;
  isImageRejected?: boolean;
  rejectionReason?: string;
  reporterEmail?: string;
  afterImageUrl?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  resolutionOfficerName?: string;
  resolutionOfficerDepartment?: string;
  resolutionOfficerContact?: string;
  resolutionEmailSent?: boolean;
  resolutionEmailDetails?: {
    to: string;
    subject: string;
    sentAt: string;
    officerName: string;
    officerDepartment: string;
    officerContact?: string;
    resolutionNotes: string;
    trackingId: string;
    beforeImageUrl?: string;
    afterImageUrl?: string;
    emailBodyHtml?: string;
  };
  atr?: ActionTakenReport;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "Citizen" | "Officer" | "Admin";

export interface CitizenBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface CitizenRewardProfile {
  points: number;
  level: number;
  rankTitle: string;
  complaintsSubmitted: number;
  upvotesCast: number;
  servicesRated: number;
  badges: CitizenBadge[];
}

export interface ActionTakenReport {
  id: string;
  complaintId: string;
  issueTitle: string;
  category: string;
  wardName: string;
  officerName: string;
  officerDesignation: string;
  department: string;
  workOrderNumber: string;
  completionDate: string;
  materialsUsed: string[];
  contractorName: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  summary: string;
  qualitySignOff: boolean;
  qrVerificationHash: string;
}

export interface PublicServiceRating {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: "Public Restroom" | "Bus Stop / Depot" | "Waste Bin / Bin Spot" | "Public Park" | "Water Kiosk" | "Healthcare Center";
  ward: number;
  wardName: string;
  rating: number; // 1 to 5
  cleanlinessScore: number;
  maintenanceScore: number;
  safetyScore: number;
  feedback?: string;
  tags: string[];
  photoUrl?: string;
  ratedBy: string;
  ratedByName: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ward: number;
  department?: string;
  phone?: string;
  serviceId?: string;
  points?: number;
  level?: number;
  badges?: string[];
}

export interface WardOfficer {
  name: string;
  designation: string;
  contact: string;
  email: string;
  address: string;
  avatar: string;
  problemsSolved: number;
  totalAssigned: number;
  resolutionRate: number; // percentage
  avgResolutionDays: number;
  citizenSatisfaction: number; // 1-5 rating
  rank: number;
}

export interface WardWeatherAQI {
  aqi: number;
  aqiCategory: "Good" | "Moderate" | "Poor" | "Unhealthy" | "Severe";
  pm25: number;
  pm10: number;
  temp: number; // in °C
  condition: string;
  humidity: number; // percentage
  windSpeed: number; // km/h
}

export interface MumbaiWard {
  id: number;
  code: string;
  name: string;
  areaDescription: string;
  areas: string[];
  primaryRailwayStations: string;
  railwayCorridor: "Island City" | "Western Suburbs" | "Eastern Suburbs";
  officer: WardOfficer;
  weatherAndAqi: WardWeatherAQI;
  lat: number;
  lng: number;
}

export interface Stats {
  total: number;
  resolved: number;
  inProgress: number;
  assigned: number;
  reported: number;
  avgSeverity: number;
  slaComplianceRate: number;
  categoryData: { name: string; count: number }[];
  wardData: { ward: string; count: number }[];
}

export interface AIAnalysisResult {
  severity: number;
  urgency: UrgencyLevel;
  category: ComplaintCategory;
  assignedDepartment: string;
  slaDays: number;
  aiSummary: string;
  aiSuggestedAction: string;
}

export interface YoloBoundingBox {
  label: string;
  confidence: number; // 0 to 1 or 0 to 100
  bbox: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in percentages (0-100)
  color: "green" | "red" | "yellow" | "blue";
  isHazard?: boolean;
  isFraud?: boolean;
}

export interface YoloDetectionMeta {
  model: string;
  inferenceTimeMs: number;
  detectedBoxes: YoloBoundingBox[];
  cameraMetadata?: {
    isOriginalSensor: boolean;
    deviceType: string;
    hasExifGps?: boolean;
  };
}

export interface AIVerifyImageResult {
  isValidCivicIssue: boolean;
  detectedObject: string;
  isCategoryMatch: boolean;
  isAIGenerated?: boolean;
  isRealCameraPhoto?: boolean;
  confidenceScore: number;
  rejectionReason?: string;
  suggestedCategory?: string;
  yoloDetection?: YoloDetectionMeta;
  aiProbability?: number;
  authenticityScore?: number;
  severityScore?: number;
  metadataStatus?: string;
  resolutionSla?: string;
  recommendedDepartment?: string;
  analysisSummary?: string;
  confidence?: number;
}

export interface UnifiedAIAnalysisResponse {
  success: boolean;
  message: string;
  timestamp: string;
  yolo: {
    status: string;
    model: string;
    detections: Array<{
      class_id: number;
      class_name: string;
      confidence: number;
      bbox: { x1: number; y1: number; x2: number; y2: number };
    }>;
    object_count: number;
    inference_time_ms: number;
    annotated_image_base64?: string;
  };
  segmentation: {
    status: string;
    model: string;
    masks: Array<{
      class_name: string;
      confidence: number;
      bbox: [number, number, number, number];
      mask_area: number;
    }>;
    total_mask_area_px: number;
  };
  ocr: {
    raw_text: string;
    confidence: number;
    asset_ids: string[];
    pole_ids: string[];
    street_names: string[];
    ocr_engine_used: string;
    possible_text_regions_detected?: number;
  };
  gis?: {
    ward_id: number;
    ward_code: string;
    ward_name: string;
    officer_name: string;
    designation: string;
    contact: string;
    email: string;
    address: string;
    corridor: string;
    distance_km: number;
    confidence: string;
  };
  dispatch?: {
    recommended_contractor: string;
    department: string;
    depot_name: string;
    depot_distance_km: number;
    estimated_eta_minutes: number;
    squad_size: number;
    required_equipment: string[];
    priority_tier: string;
    dispatch_status: string;
  };
  gemini: {
    verified: boolean;
    category: string;
    severity_score?: number;
    severity?: number;
    reason: string;
    recommended_department?: string;
  };
  triage: {
    category: ComplaintCategory;
    severity_score?: number;
    priorityScore?: number;
    priority_score?: number;
    priorityLevel?: UrgencyLevel;
    urgency?: UrgencyLevel;
    assignedDepartment?: string;
    department?: string;
    slaTargetDays?: number;
    recommended_sla_days?: number;
    explanation?: string;
  };
  duplicates: Array<{
    complaintId: string;
    title?: string;
    distanceMeters: number;
    imageSimilarity: number;
    textSimilarity: number;
    compositeSimilarity?: number;
    status: ComplaintStatus;
    ward?: number;
    wardName?: string;
  }>;
  execution_time_ms: number;
}

