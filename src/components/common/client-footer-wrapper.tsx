"use client";

import { MobileFooter } from "./mobile-footer";

export function ClientFooterWrapper() {
  const handleSearchClick = () => {
    document.dispatchEvent(new CustomEvent("toggle-search"));
  };

  return <MobileFooter isLoggedIn={false} onSearchClick={handleSearchClick} />;
} 