"use client";

import { Role } from "@/store/services/rolesApi";
import React, { createContext, useContext, useState, ReactNode } from "react";


interface AppContextType {
  roles: Role[];
  setRoles: (roles: Role[]) => void;

  permissions: string[];
  setPermissions: (permissions: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);

  return (
    <AppContext.Provider
      value={{
        roles,
        setRoles,
        permissions,
        setPermissions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
