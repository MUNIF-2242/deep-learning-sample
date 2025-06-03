import React, { createContext, useState } from "react";

export const IdVerificationContext = createContext();

export const IdVerificationProvider = ({ children }) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedNidImageUrl, setUploadedNidImageUrl] = useState("");
  const [uploadedTradeLicenseImageUrl, setUploadedTradeLicenseImageUrl] =
    useState("");
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = async (e) => {
    console.log("handleSubmit called with inputMessage:", inputMessage);
    e.preventDefault();

    if (!inputMessage.trim()) return;

    try {
      const response = await fetch("/api/aws/bedrock/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputMessage }),
      });

      const data = await response.json();

      console.log("API response:", data);

      if (!response.ok) {
        console.error("API error:", data.message);
        alert("Something went wrong while fetching results.");
      } else {
        console.log("Results:", data.results);
        // 🔥 Optionally update context or state with the results here!
      }

      setInputMessage("");
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <IdVerificationContext.Provider
      value={{
        uploadedImageUrl,
        setUploadedImageUrl,

        uploadedTradeLicenseImageUrl,
        setUploadedTradeLicenseImageUrl,
        setUploadedNidImageUrl,
        uploadedNidImageUrl,
        handleSubmit,
        inputMessage,
        setInputMessage,
      }}
    >
      {children}
    </IdVerificationContext.Provider>
  );
};
