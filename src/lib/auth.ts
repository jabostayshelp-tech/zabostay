// Client-side authentication using localStorage.
// NOTE: This is a demo/frontend-only auth implementation. In production,
// replace with a real backend (NextAuth / Laravel Sanctum) + hashed passwords.

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin" | "superadmin";
  avatar?: string;
  createdAt: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

const USERS_KEY = "staybook_users";
const SESSION_KEY = "staybook_session";

// Seeded admin account. Credentials are shared with the site owner privately,
// NOT displayed anywhere in the UI.
const ADMIN_ACCOUNT: StoredUser = {
  id: "admin-001",
  name: "Administrator StayBook",
  email: "admin@staybook.id",
  phone: "081200000001",
  role: "superadmin",
  password: "StayBook@Admin2026",
  createdAt: "2026-01-01T00:00:00.000Z",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users: StoredUser[] = raw ? JSON.parse(raw) : [];
    // Ensure admin account always exists (self-healing seed).
    if (!users.some((u) => u.email.toLowerCase() === ADMIN_ACCOUNT.email)) {
      users.push(ADMIN_ACCOUNT);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch {
    return [ADMIN_ACCOUNT];
  }
}

function writeUsers(users: StoredUser[]) {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Ensures the admin account is seeded. Safe to call on app load. */
export function seedAuth() {
  if (!isBrowser()) return;
  readUsers();
}

export interface RegisterInput {
  name?: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  user?: AuthUser;
}

function stripPassword(user: StoredUser): AuthUser {
  const { password: _password, ...rest } = user;
  void _password;
  return rest;
}

export function register(input: RegisterInput): AuthResult {
  const name = (input.name || "").trim();
  const email = input.email.trim().toLowerCase();
  const phone = (input.phone || "").trim();

  if (!email || !input.password) {
    return { ok: false, error: "Email dan password wajib diisi." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, error: "Format email tidak valid." };
  }
  if (input.password.length < 6) {
    return { ok: false, error: "Password minimal 6 karakter." };
  }

  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "Email sudah terdaftar. Silakan masuk." };
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name: name || email.split("@")[0],
    email,
    phone,
    role: "customer",
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);
  setSession(newUser.id);

  return { ok: true, user: stripPassword(newUser) };
}

export function login(email: string, password: string): AuthResult {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return { ok: false, error: "Email dan password wajib diisi." };
  }

  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password) {
    return { ok: false, error: "Email atau password salah." };
  }

  setSession(user.id);
  return { ok: true, user: stripPassword(user) };
}

function setSession(userId: string) {
  if (!isBrowser()) return;
  localStorage.setItem(SESSION_KEY, userId);
  // Notify listeners in the same tab.
  window.dispatchEvent(new Event("staybook-auth-changed"));
}

export function logout() {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("staybook-auth-changed"));
}

export function getCurrentUser(): AuthUser | null {
  if (!isBrowser()) return null;
  const userId = localStorage.getItem(SESSION_KEY);
  if (!userId) return null;
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  return user ? stripPassword(user) : null;
}

export function updateProfile(
  userId: string,
  updates: Partial<Pick<AuthUser, "name" | "phone" | "avatar">>
): AuthResult {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false, error: "User tidak ditemukan." };
  users[idx] = { ...users[idx], ...updates };
  writeUsers(users);
  window.dispatchEvent(new Event("staybook-auth-changed"));
  return { ok: true, user: stripPassword(users[idx]) };
}
