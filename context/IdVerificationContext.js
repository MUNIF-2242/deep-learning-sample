import React, { createContext, useState } from "react";

export const IdVerificationContext = createContext();

export const IdVerificationProvider = ({ children }) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedNidImageUrl, setUploadedNidImageUrl] = useState("");
  const [uploadedTradeLicenseImageUrl, setUploadedTradeLicenseImageUrl] =
    useState("");

  // 🟢 Dropdown expand/collapse logic from old DigiContext
  const [dropdowns, setDropdowns] = useState({
    openAI: false,
    cloudVision: false,
  });

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <IdVerificationContext.Provider
      value={{
        uploadedImageUrl,
        setUploadedImageUrl,
        dropdowns,
        toggleDropdown,
        uploadedTradeLicenseImageUrl,
        setUploadedTradeLicenseImageUrl,
        setUploadedNidImageUrl,
        uploadedNidImageUrl,
      }}
    >
      {children}
    </IdVerificationContext.Provider>
  );
};
