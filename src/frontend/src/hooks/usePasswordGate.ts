import { useState } from "react";

const SESSION_KEY = "district_status_unlocked";

export function usePasswordGate() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  const unlock = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage may be unavailable in some contexts
    }
    setIsUnlocked(true);
  };

  return { isUnlocked, unlock };
}
