import React, { createContext, useState } from "react";

export const RagChatbotContext = createContext();

export const RagChatbotProvider = ({ children }) => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedNidImageUrl, setUploadedNidImageUrl] = useState("");
  const [uploadedTradeLicenseImageUrl, setUploadedTradeLicenseImageUrl] =
    useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Upload button");
  };
  const handleFileChange = (event) => {
    console.log("File changed", event.target.files);
  };

  return (
    <RagChatbotContext.Provider
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
        handleFileChange,
        error,
        result,
      }}
    >
      {children}
    </RagChatbotContext.Provider>
  );
};
