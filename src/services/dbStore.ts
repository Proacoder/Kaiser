import crypto from "crypto";
import fs from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: "Citizen" | "Officer" | "Admin";
  ward: number;
  department?: string;
  phone?: string;
  serviceId?: string;
  createdAt: string;
}

// Supabase Client Initialization (if environment variables are supplied)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase Connected Successfully:", supabaseUrl);
  } catch (e) {
    console.warn("⚠️ Supabase Client Initialization Warning:", e);
  }
} else {
  console.log("ℹ️ Running in Local Persistent Database Mode (Set SUPABASE_URL & SUPABASE_ANON_KEY to enable Supabase Cloud sync)");
}

export function isSupabaseConnected(): boolean {
  return supabase !== null;
}

// Password hashing utilities using SHA-512 with salt
export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculatedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return calculatedHash === hash;
}

// Persistent File Store Helper
const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Pre-seeded verified demo accounts with secure password hashes
const initialSalt = "kaiser_secure_salt_2026";
const citizenPass = hashPassword("citizen123", initialSalt);
const officerPass = hashPassword("officer123", initialSalt);

// Generate pre-seeded accounts for ALL 24 Ward Officers in Mumbai
const defaultOfficerUsers: StoredUser[] = MUMBAI_WARDS_DATA.map((ward) => {
  const cleanCode = ward.code.replace("/", "").toLowerCase();
  const badgeId = `BMC-OFF-${ward.id < 10 ? "0" + ward.id : ward.id}01`;
  
  return {
    id: `usr-officer-ward-${ward.id}`,
    name: ward.officer.name,
    email: ward.officer.email || `officer.ward${ward.id}@civic.com`,
    passwordHash: officerPass.hash,
    salt: initialSalt,
    role: "Officer" as const,
    ward: ward.id,
    department: `BMC Ward ${ward.code} (${ward.name}) Executive Office`,
    phone: ward.officer.contact,
    serviceId: badgeId,
    createdAt: new Date(Date.now() - 3600000 * (240 - ward.id * 5)).toISOString(),
  };
});

// Also include specific alias logins for common wards requested
const customAliasOfficers: StoredUser[] = [
  {
    id: "usr-admin-hwest",
    name: "Shri Vinayak Vispute (AMC H/West)",
    email: "officer.hwest@civic.com",
    passwordHash: officerPass.hash,
    salt: initialSalt,
    role: "Officer",
    ward: 11, // H/West is Ward 11
    department: "H-West Ward Executive Office",
    phone: "+91 22 2642 2255",
    serviceId: "BMC-OFF-1101",
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString(),
  },
  {
    id: "usr-admin-gnorth",
    name: "Shri Kiran Dighavkar (AMC G/North)",
    email: "officer.gnorth@civic.com",
    passwordHash: officerPass.hash,
    salt: initialSalt,
    role: "Officer",
    ward: 9, // G/North is Ward 9
    department: "G-North Ward Executive Office",
    phone: "+91 22 2422 4220",
    serviceId: "BMC-OFF-0901",
    createdAt: new Date(Date.now() - 3600000 * 200).toISOString(),
  },
  {
    id: "usr-admin-award",
    name: "Shri Prashant S. Gaikwad (AMC A-Ward)",
    email: "officer.award@civic.com",
    passwordHash: officerPass.hash,
    salt: initialSalt,
    role: "Officer",
    ward: 1,
    department: "A-Ward Executive Office",
    phone: "+91 22 2266 1234",
    serviceId: "BMC-OFF-0101",
    createdAt: new Date(Date.now() - 3600000 * 180).toISOString(),
  },
  {
    id: "usr-admin-kwest",
    name: "Shri Prithviraj Chauhan (AMC K/West - Andheri)",
    email: "officer.kwest@civic.com",
    passwordHash: officerPass.hash,
    salt: initialSalt,
    role: "Officer",
    ward: 13,
    department: "K-West (Andheri West) Executive Office",
    phone: "+91 22 2620 1200",
    serviceId: "BMC-OFF-1301",
    createdAt: new Date(Date.now() - 3600000 * 150).toISOString(),
  }
];

const defaultCitizenUsers: StoredUser[] = [
  {
    id: "usr-citizen-1",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    passwordHash: citizenPass.hash,
    salt: initialSalt,
    role: "Citizen",
    ward: 11,
    phone: "+91 98765 43210",
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
  {
    id: "usr-citizen-2",
    name: "Priya Mehta",
    email: "priya@example.com",
    passwordHash: citizenPass.hash,
    salt: initialSalt,
    role: "Citizen",
    ward: 9,
    phone: "+91 98765 43211",
    createdAt: new Date(Date.now() - 3600000 * 90).toISOString(),
  },
  {
    id: "usr-citizen-3",
    name: "Rohan Varma",
    email: "rohan@example.com",
    passwordHash: citizenPass.hash,
    salt: initialSalt,
    role: "Citizen",
    ward: 13,
    phone: "+91 98765 43212",
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
  },
];

const allInitialUsers: StoredUser[] = [
  ...defaultOfficerUsers,
  ...customAliasOfficers,
  ...defaultCitizenUsers,
];

export function loadUsers(): StoredUser[] {
  ensureDataDirectory();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all 24 ward officers are present in the stored list
        let modified = false;
        for (const defaultOfficer of defaultOfficerUsers) {
          const exists = parsed.some(
            (u: StoredUser) =>
              u.id === defaultOfficer.id ||
              u.email.toLowerCase() === defaultOfficer.email.toLowerCase() ||
              (u.role === "Officer" && u.ward === defaultOfficer.ward)
          );
          if (!exists) {
            parsed.push(defaultOfficer);
            modified = true;
          }
        }
        for (const alias of customAliasOfficers) {
          const exists = parsed.some((u: StoredUser) => u.email.toLowerCase() === alias.email.toLowerCase());
          if (!exists) {
            parsed.push(alias);
            modified = true;
          }
        }
        if (modified) {
          saveUsers(parsed);
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load users from file, initializing defaults", e);
  }

  // Save full 24-ward default users
  saveUsers(allInitialUsers);
  return allInitialUsers;
}

export function saveUsers(usersList: StoredUser[]) {
  ensureDataDirectory();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersList, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write users file", e);
  }
}

// Database Service Interface
export const dbService = {
  getUsers: (): StoredUser[] => {
    return loadUsers();
  },

  findUserByIdentifier: (identifier: string, role?: string, ward?: number): StoredUser | undefined => {
    const users = loadUsers();
    const cleanId = identifier.trim().toLowerCase();

    // 1. Direct email match
    let matched = users.find((u) => u.email.toLowerCase() === cleanId);
    if (matched) return matched;

    // 2. Direct service badge ID match
    matched = users.find((u) => u.serviceId && u.serviceId.toLowerCase() === cleanId);
    if (matched) return matched;

    // 3. Match by phone or alternative format
    matched = users.find((u) => u.phone && u.phone.replace(/\D/g, "") === cleanId.replace(/\D/g, "") && cleanId.length > 6);
    if (matched) return matched;

    // 4. If officer and specified ward, match by ward officer
    if (role === "Officer" && ward) {
      matched = users.find((u) => u.role === "Officer" && u.ward === Number(ward));
      if (matched) return matched;
    }

    return undefined;
  },

  findUserByEmail: (email: string): StoredUser | undefined => {
    const users = loadUsers();
    return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  findUserById: (id: string): StoredUser | undefined => {
    const users = loadUsers();
    return users.find((u) => u.id === id);
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role: "Citizen" | "Officer" | "Admin";
    ward: number;
    phone?: string;
    department?: string;
    serviceId?: string;
  }): Promise<StoredUser> => {
    const users = loadUsers();
    const cleanEmail = userData.email.trim().toLowerCase();
    
    // Check duplicate
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    const { hash, salt } = hashPassword(userData.password);
    const isOfficer = userData.role === "Officer";
    const wardNum = Number(userData.ward) || 9;
    const wardInfo = MUMBAI_WARDS_DATA.find((w) => w.id === wardNum) || MUMBAI_WARDS_DATA[0];

    if (existingIndex >= 0) {
      // If updating an existing account's credentials
      const existingUser = users[existingIndex];
      existingUser.name = userData.name.trim();
      existingUser.passwordHash = hash;
      existingUser.salt = salt;
      existingUser.role = userData.role;
      existingUser.ward = wardNum;
      if (userData.phone) existingUser.phone = userData.phone.trim();
      if (userData.department) existingUser.department = userData.department.trim();
      if (userData.serviceId) existingUser.serviceId = userData.serviceId.trim();
      
      saveUsers(users);
      return existingUser;
    }

    const newUser: StoredUser = {
      id: `usr-${isOfficer ? "officer" : "citizen"}-${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      passwordHash: hash,
      salt: salt,
      role: userData.role,
      ward: wardNum,
      phone: userData.phone?.trim() || wardInfo.officer.contact,
      department: userData.department?.trim() || (isOfficer ? `BMC Ward ${wardInfo.code} (${wardInfo.name}) Executive Office` : ""),
      serviceId: userData.serviceId?.trim() || (isOfficer ? `BMC-OFF-${wardNum < 10 ? "0" + wardNum : wardNum}01` : ""),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Sync to Supabase if connected
    if (supabase) {
      try {
        await supabase.from("users").upsert({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          ward: newUser.ward,
          phone: newUser.phone,
          department: newUser.department,
          service_id: newUser.serviceId,
          created_at: newUser.createdAt,
        });
      } catch (sbErr) {
        console.warn("Supabase user sync error (offline fallback preserved):", sbErr);
      }
    }

    return newUser;
  },

  updateUserPassword: (emailOrId: string, newPassword: string): StoredUser | null => {
    const users = loadUsers();
    const userIndex = users.findIndex(
      (u) => u.id === emailOrId || u.email.toLowerCase() === emailOrId.trim().toLowerCase()
    );
    if (userIndex === -1) return null;

    const { hash, salt } = hashPassword(newPassword);
    users[userIndex].passwordHash = hash;
    users[userIndex].salt = salt;
    saveUsers(users);
    return users[userIndex];
  },

  verifyUserCredentials: (
    identifier: string, 
    password: string, 
    requiredRole?: "Citizen" | "Officer",
    ward?: number
  ): { user: StoredUser | null; error?: string } => {
    const user = dbService.findUserByIdentifier(identifier, requiredRole, ward);
    if (!user) {
      return { 
        user: null, 
        error: `Account not found for "${identifier}". Please create an account via Officer Onboarding / Registration.` 
      };
    }

    if (requiredRole && user.role !== requiredRole) {
      return { 
        user: null, 
        error: `This account is registered as a ${user.role}. Please log in through the ${user.role} Portal.` 
      };
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      return { user: null, error: "Incorrect password. Please verify your credentials and try again." };
    }

    return { user };
  }
};

