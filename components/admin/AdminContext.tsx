"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import {
  type StaffUser,
  MOCK_STAFF_USERS,
  ROLE_PERMISSIONS,
} from "@/data/admin-mock";

interface AdminContextType {
  currentUser: StaffUser;
  allStaffUsers: StaffUser[];
  switchUser: (userId: string) => void;
  loginWithEmail: (email: string) => StaffUser | null;
  hasPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEY = "cake_eats_admin_mock_user_id";

// Event for notifying subscribers within the same tab when mock user switches
const USER_CHANGE_EVENT = "cake-eats-user-change";

function subscribeUserChange(callback: () => void) {
  window.addEventListener(USER_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(USER_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getUserSnapshot(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || MOCK_STAFF_USERS[0].id;
  } catch {
    return MOCK_STAFF_USERS[0].id;
  }
}

function getServerSnapshot(): string {
  return MOCK_STAFF_USERS[0].id;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const currentUserId = useSyncExternalStore(
    subscribeUserChange,
    getUserSnapshot,
    getServerSnapshot
  );

  const currentUser =
    MOCK_STAFF_USERS.find((u) => u.id === currentUserId) || MOCK_STAFF_USERS[0];

  const switchUser = (userId: string) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, userId);
      window.dispatchEvent(new Event(USER_CHANGE_EVENT));
    } catch {
      // Fallback if sessionStorage is disabled
    }
  };

  const loginWithEmail = (email: string): StaffUser | null => {
    const normalized = email.trim().toLowerCase();
    const found = MOCK_STAFF_USERS.find(
      (u) => u.email.toLowerCase() === normalized
    );
    if (found) {
      switchUser(found.id);
      return found;
    }
    return null;
  };

  const hasPermission = (permission: string): boolean => {
    const permissions = ROLE_PERMISSIONS[currentUser.role] || [];
    return permissions.includes(permission);
  };

  return (
    <AdminContext.Provider
      value={{
        currentUser,
        allStaffUsers: MOCK_STAFF_USERS,
        switchUser,
        loginWithEmail,
        hasPermission,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminUser() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminUser must be used within an AdminProvider");
  }
  return context;
}
