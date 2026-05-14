"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext({
  settings: {
    businessName: "Chanan Spa",
    address: "02 Phan Long Băng, Quảng Ngãi",
    phone: "035 630 8211",
    email: "info@chanan.vn",
    openHours: "Thứ 2 - Chủ nhật: 8:00 - 20:00",
    mapsUrl: "https://www.google.com/maps?q=02+Phan+Long+Băng,+Quảng+Ngãi&output=embed",
    voucherCode: "",
    voucherDiscount: "",
    voucherExpiry: "",
  },
  loading: true,
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    businessName: "Chanan Spa",
    address: "02 Phan Long Băng, Quảng Ngãi",
    phone: "035 630 8211",
    email: "info@chanan.vn",
    openHours: "Thứ 2 - Chủ nhật: 8:00 - 20:00",
    mapsUrl: "https://www.google.com/maps?q=02+Phan+Long+Băng,+Quảng+Ngãi&output=embed",
    voucherCode: "",
    voucherDiscount: "",
    voucherExpiry: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        const result = await res.json();
        if (result.success) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
