"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FilterContextType {
  city: string;
  zipCode: string;
  setCity: (city: string) => void;
  setZipCode: (zipCode: string) => void;
  resetFilters: () => void;
  debouncedCity: string;
  debouncedZipCode: string;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [debouncedCity, setDebouncedCity] = useState("");
  const [debouncedZipCode, setDebouncedZipCode] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [city]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedZipCode(zipCode.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [zipCode]);

  const resetFilters = () => {
    setCity("");
    setZipCode("");
  };

  return (
    <FilterContext.Provider
      value={{
        city,
        zipCode,
        setCity,
        setZipCode,
        resetFilters,
        debouncedCity,
        debouncedZipCode,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useDashboardFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useDashboardFilters must be used within a FilterProvider");
  }
  return context;
};
