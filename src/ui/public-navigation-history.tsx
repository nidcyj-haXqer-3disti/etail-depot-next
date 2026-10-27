"use client";

import { useEffect } from "react";

/** Keep native section links in the same browser history as client-side routes. */
export function PublicNavigationHistory() {
  useEffect(() => {
    function registerSectionEntry() {
      if (window.history.state === null) {
        window.history.replaceState({ publicSection: true }, "", window.location.href);
      }
    }
    // A same-document navigation can emit popstate before hashchange. Register
    // its URL immediately so pending route synchronization cannot restore an old hash.
    window.addEventListener("popstate", registerSectionEntry);
    window.addEventListener("hashchange", registerSectionEntry);
    return () => {
      window.removeEventListener("popstate", registerSectionEntry);
      window.removeEventListener("hashchange", registerSectionEntry);
    };
  }, []);
  return null;
}
