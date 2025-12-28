"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useGetShelter } from "@/hooks/shelter.hooks";

const ShelterContext = createContext(null);

export function ShelterProvider({ children }) {
  const { user, isLoading: authLoading } = useAuth();

  const { shelter, isLoading, refetch } = useGetShelter({
    id: user?.id,
  });

  const hasShelter = Boolean(shelter?.statusShelter === true);

  const value = useMemo(
    () => ({
      hasShelter,
      isLoading: authLoading || isLoading,
      refetchShelter: refetch,
      shelter,
    }),
    [hasShelter, authLoading, isLoading, refetch, shelter]
  );

  return (
    <ShelterContext.Provider value={value}>{children}</ShelterContext.Provider>
  );
}

export function useShelter() {
  const ctx = useContext(ShelterContext);
  if (!ctx) {
    throw new Error("useShelter must be used within ShelterProvider");
  }
  return ctx;
}
