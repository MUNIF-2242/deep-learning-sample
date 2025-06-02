import { IdVerificationContext } from "@/context/IdVerificationContext";
import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";

const MySwal = withReactContent(Swal);

const AddNewDoc = () => {
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setUploadedImageUrl } = useContext(IdVerificationContext);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please select a valid PDF file.");
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setError("");
      setResult("");

      const response = await fetch("/api/aws/bedrock/uploadPdf", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("Content-Type") || "";
      if (!response.ok) {
        if (contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("Upload failed:", errorData);
          setError(errorData.message || "Upload failed.");
        } else {
          setError("Upload failed. Server did not respond with JSON.");
        }
        return;
      }

      if (!contentType.includes("application/json")) {
        setError("Unexpected response format. Server did not return JSON.");
        return;
      }

      const data = await response.json();
      setResult(`Upload successful! File URL: ${data.fileUrl}`);
      setUploadedImageUrl(data.fileUrl);

      MySwal.fire({
        title: "Upload Successful!",
        html: `<a href="${data.fileUrl}" target="_blank" rel="noopener noreferrer">View uploaded file</a>`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("An error occurred while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-xxl-4 col-md-5">
        <div className="panel">
          <div className="panel-header">
            <h5>Upload PDF Document</h5>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <input
                    className="form-control"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end">
                  <div className="btn-box">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!selectedFile || loading}
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Success Panel */}
        {result && (
          <div className="panel mt-4">
            <div className="panel-header">
              <h5>Success</h5>
            </div>
            <div className="panel-body">
              <div className="bg-success-subtle p-3 rounded">{result}</div>
            </div>
          </div>
        )}

        {/* Error Panel */}
        {error && (
          <div className="panel mt-4">
            <div className="panel-header">
              <h5>Error</h5>
            </div>
            <div className="panel-body">
              <div className="bg-danger-subtle p-3 rounded">{error}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddNewDoc;
