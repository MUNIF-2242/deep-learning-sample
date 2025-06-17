import React, { createContext, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";
const MySwal = withReactContent(Swal);

export const RagChatbotContext = createContext();

export const RagChatbotProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState([]);
  const [response, setResponse] = useState(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setUploadedPdfUrl([]); // reset previous results
    setError("");
  };

  // Inside RagChatbotProvider
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
        "https://jvnc17fe92.execute-api.us-east-1.amazonaws.com/prod/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Lambda response:", data);
      setResponse(data);

      if (!res.ok || data.successfulUploads === 0) {
        setError(data.message || "Upload failed");
      } else {
        const urls = data.files?.map((f) => f.s3Url).filter(Boolean) || [];
        setUploadedPdfUrl(urls);

        // ✅ Show SweetAlert on success
        MySwal.fire({
          toast: true,
          position: "top-end", // Top-right corner
          icon: "success",
          title: "PDF uploaded successfully!",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "colored-toast",
          },
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
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
        response,
      }}
    >
      {children}
    </RagChatbotContext.Provider>
  );
};
