-- ==============================================================================
-- KAISER AI — PostgreSQL Production Database Schema
-- Supports PostGIS Spatial Indexing, User Profiles, Contractor Penalties, & ATRs
-- ==============================================================================

-- Enable UUID and PostGIS extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE (Citizen Identity, Officers, Contractors)
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'Citizen' CHECK (role IN ('Citizen', 'Officer', 'Admin', 'Contractor')),
    ward_id INT,
    ward_name VARCHAR(100),
    total_reports_filed INT DEFAULT 0,
    total_reports_resolved INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. WARDS TABLE (24 Mumbai Administrative Wards & Health Scores)
-- ------------------------------------------------------------------------------
CREATE TABLE wards (
    id INT PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL, -- e.g. 'K-W', 'H-W', 'A'
    name VARCHAR(100) NOT NULL,       -- e.g. 'K-West (Andheri West / Juhu)'
    headquarters VARCHAR(255),
    officer_in_charge VARCHAR(100),
    centroid_lat DECIMAL(10, 8) NOT NULL,
    centroid_lng DECIMAL(11, 8) NOT NULL,
    civic_health_score DECIMAL(5, 2) DEFAULT 85.00,
    total_open_issues INT DEFAULT 0,
    total_resolved_issues INT DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 3. CONTRACTORS TABLE (Assigned Municipal Vendors & Penalty Pool)
-- ------------------------------------------------------------------------------
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL, -- 'Roads & Traffic', 'Solid Waste Management', 'SWD'
    assigned_wards TEXT,
    contact_phone VARCHAR(20),
    total_jobs_assigned INT DEFAULT 0,
    resolved_on_time INT DEFAULT 0,
    overdue_count INT DEFAULT 0,
    sla_compliance_rate DECIMAL(5, 2) DEFAULT 100.00,
    total_penalties_accrued_inr DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. COMPLAINTS TABLE (Grievances, Coordinates, Severity, pHash)
-- ------------------------------------------------------------------------------
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. 'COMP-1042'
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ward_id INT REFERENCES wards(id),
    contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Pothole', 'Garbage', 'Water Leakage', 'Streetlight', 'Drainage', 'Footpath')),
    severity VARCHAR(10) NOT NULL DEFAULT 'P3' CHECK (severity IN ('P1', 'P2', 'P3', 'P4')),
    urgency_score INT DEFAULT 50, -- 1 to 100
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Crew Dispatched', 'In Progress', 'Resolved', 'Rejected')),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    geom GEOMETRY(Point, 4326), -- PostGIS Spatial Point
    location_address TEXT,
    image_url TEXT NOT NULL,
    resolution_image_url TEXT,
    phash VARCHAR(64),          -- 64-bit Perceptual Image Hash for duplicate detection
    upvote_count INT DEFAULT 1,
    target_sla_hours INT NOT NULL DEFAULT 72, -- P1: 24, P2: 48, P3: 72, P4: 120
    is_overdue BOOLEAN DEFAULT FALSE,
    penalty_inr DECIMAL(10, 2) DEFAULT 0.00,
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PostGIS Spatial Index for 50-meter radius proximity deduplication
CREATE INDEX idx_complaints_geom ON complaints USING GIST (geom);
CREATE INDEX idx_complaints_phash ON complaints (phash);
CREATE INDEX idx_complaints_user_id ON complaints (user_id);
CREATE INDEX idx_complaints_ward_id ON complaints (ward_id);

-- ------------------------------------------------------------------------------
-- 5. ACTION TAKEN REPORTS (ATR Table - Official Printable Sign-Off)
-- ------------------------------------------------------------------------------
CREATE TABLE action_taken_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    atr_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'ATR-COMP-1042'
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    work_order_number VARCHAR(50) NOT NULL,
    officer_name VARCHAR(100) NOT NULL,
    officer_designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    contractor_name VARCHAR(255) NOT NULL,
    materials_used TEXT[], -- e.g. ['High-durability Asphalt Cold Mix', 'Hydraulic Sealant']
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    quality_sign_off BOOLEAN DEFAULT TRUE,
    qr_verification_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. AUDIT LOGS (Immutable History Tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role VARCHAR(20) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'Submitted', 'Assigned_Contractor', 'Status_Changed', 'Resolved'
    previous_status VARCHAR(30),
    new_status VARCHAR(30),
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
