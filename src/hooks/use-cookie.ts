// lib/hooks/useCookie.ts
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// Type for cookie value
type CookieValue = string | undefined;


// Client-side: Get cookie using js-cookie
export function getCookieClient(name: string): CookieValue {
  return Cookies.get(name);
}

// Hook for client components
export function useCookie(name: string): CookieValue {
  const [cookie, setCookie] = useState<CookieValue>(undefined);

  useEffect(() => {
    const value = getCookieClient(name);
    console.log(value,'sdih')
    setCookie(value);
  }, [name]);

  return cookie;
}