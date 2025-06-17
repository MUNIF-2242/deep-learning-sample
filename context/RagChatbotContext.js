import React, { createContext, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";

const MySwal = withReactContent(Swal);

export const RagChatbotContext = createContext();

export const RagChatbotProvider = ({ children }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedPdfResponse, setUploadPdfResponse] = useState(null);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setUploadedPdfUrl([]);
    setError("");
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setLoading(true);

    console.log("📥 User Message:", userMessage);
    try {
      const response = await fetch(
        "https://ktfv5go9o2.execute-api.us-east-1.amazonaws.com/prod/ask",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: inputMessage }),
        }
      );

      const data = await response.json();
      const botMessage = {
        role: "assistant",
        content: data.answer || "No answer found.",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      console.log("API Response:", data);
    } catch (error) {
      console.error("❌ Error :", error);
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error during query submission",
        text: error.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "colored-toast",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Call indexing endpoint
  const handleEmbedding = async (pdfUrl) => {
    try {
      const res = await fetch(
        "https://ktfv5go9o2.execute-api.us-east-1.amazonaws.com/prod/index",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: pdfUrl }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to index the PDF");
      }

      console.log("📄 Embedding Response:", data);

      // ✅ Check if skipped
      if (data.skipped) {
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Already indexed. Skipped.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "colored-toast",
          },
        });
      } else {
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Document indexed successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "colored-toast",
          },
        });
      }
    } catch (error) {
      console.error("❌ Error during embedding:", error);
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Embedding failed",
        text: error.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "colored-toast",
        },
      });
    }
  };

  // Handle file upload and trigger embedding
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);
      setError("");
      setUploadedPdfUrl([]);

      const res = await fetch(
        "https://ktfv5go9o2.execute-api.us-east-1.amazonaws.com/prod/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setUploadPdfResponse(data);

      if (!res.ok || data.successfulUploads === 0) {
        setError(data.message || "Upload failed");
        return;
      }

      const urls = data.files?.map((f) => f.s3Url).filter(Boolean) || [];
      setUploadedPdfUrl(urls);

      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "PDF uploaded successfully!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: "colored-toast",
        },
      });

      // Index each uploaded document
      for (let i = 0; i < urls.length; i++) {
        console.log(`📥 Indexing file ${i + 1} of ${urls.length}`);
        await handleEmbedding(urls[i]);
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError("Something went wrong while uploading");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RagChatbotContext.Provider
      value={{
        uploadedPdfUrl,
        handleSubmit,
        loading,
        handleFileChange,
        error,
        uploadedPdfResponse,
        handleEmbedding, // exposed for reuse elsewhere if needed
        messages,
        handleQuerySubmit,
        setInputMessage,
      }}
    >
      {children}
    </RagChatbotContext.Provider>
  );
};
