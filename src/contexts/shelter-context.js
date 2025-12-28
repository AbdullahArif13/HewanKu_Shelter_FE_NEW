"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ShelterContext = createContext();

export function ShelterProvider({ children }) {
  const [hasShelter, setHasShelter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔹 nanti ganti ke API / backend
    const stored = localStorage.getItem("hasShelter");
    setHasShelter(stored === "true");
    setIsLoading(false);
  }, []);

  const markShelterCreated = () => {
    setHasShelter(true);
    localStorage.setItem("hasShelter", "true");
  };

  const resetShelter = () => {
    setHasShelter(false);
    localStorage.removeItem("hasShelter");
  };

  return (
    <ShelterContext.Provider
      value={{ hasShelter, isLoading, markShelterCreated, resetShelter }}
    >
      {children}
    </ShelterContext.Provider>
  );
}

export function useShelter() {
  return useContext(ShelterContext);
}
