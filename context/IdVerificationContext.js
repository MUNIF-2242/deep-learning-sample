import React, { createContext, useState } from "react";

export const IdVerificationContext = createContext();

export const IdVerificationProvider = ({ children }) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedNidImageUrl, setUploadedNidImageUrl] = useState("");
  const [uploadedTradeLicenseImageUrl, setUploadedTradeLicenseImageUrl] =
    useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setLoading(true);
    try {
      const response = await fetch("/api/aws/bedrock/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API error:", data.message);
        alert("Something went wrong while fetching results.");
      } else {
        // Filter out duplicate user message if API echoes it
        const newMessages = data.messages.filter(
          (msg) => !(msg.role === "user" && msg.content === inputMessage)
        );
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IdVerificationContext.Provider
      value={{
        uploadedImageUrl,
        setUploadedImageUrl,
        messages,
        uploadedTradeLicenseImageUrl,
        setUploadedTradeLicenseImageUrl,
        setUploadedNidImageUrl,
        uploadedNidImageUrl,
        handleSubmit,
        inputMessage,
        setInputMessage,
        loading,
      }}
    >
      {children}
    </IdVerificationContext.Provider>
  );
};
