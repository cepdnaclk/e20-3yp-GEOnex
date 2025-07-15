import { useState, useEffect } from "react";

/* Returns true on phones & tablets, false on desktop/laptop */
export default function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(
    typeof navigator !== "undefined" && navigator.maxTouchPoints > 0
  );

  useEffect(() => {
    /* Some 2-in-1 laptops can toggle touch; update once we see any pointer */
    const check = () => setIsTouch(navigator.maxTouchPoints > 0);
    window.addEventListener("pointerdown", check, { once: true });
    return () => window.removeEventListener("pointerdown", check);
  }, []);

  return isTouch;
}
