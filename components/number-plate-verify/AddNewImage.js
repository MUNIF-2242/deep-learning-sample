import { IdVerificationContext } from "@/context/IdVerificationContext";
import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";

const MySwal = withReactContent(Swal);

const AddNewImage = () => {
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visionApiJSONResponse, setVisionApiJSONResponse] = useState(null);
  const [openAiApiJSONResponse, setOpenAiApiJSONResponse] = useState(null);
  const { setUploadedImageUrl } = useContext(IdVerificationContext);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Please select a valid image file.");
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");
    setVisionApiJSONResponse(null);
    setUploadedImageUrl("");
    setOpenAiApiJSONResponse(null);

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result;

        // Step 1: Upload image
        const uploadResponse = await fetch("/api/cloud-vision/uploadImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || "Image upload failed.");
        }

        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.imageUrl;

        setUploadedImageUrl(imageUrl);

        // Show success toast
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Image uploaded successfully!",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          customClass: {
            timerProgressBar: "my-custom-progress",
          },
        });

        // Step 2: Analyze text
        const visionResponse = await fetch(
          "/api/cloud-vision/features/text-detection/vehicle-number-plate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl }),
          }
        );

        if (!visionResponse.ok) {
          const errorData = await visionResponse.json();
          throw new Error(errorData.error || "Vision API failed.");
        }

        const visionData = await visionResponse.json();
        setVisionApiJSONResponse(visionData);

        // Step 3: Call OpenAi API with banglaConvertedText
        const analyzeResponse = await fetch("/api/openai/vehicle/analyzeText", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputText: visionData.banglaConvertedText }),
        });

        if (!analyzeResponse.ok) {
          const errorData = await analyzeResponse.json();
          throw new Error(errorData.error || "OpenAI Text Analysis failed.");
        }

        const analyzeData = await analyzeResponse.json();
        setOpenAiApiJSONResponse(analyzeData.result);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <>
      <div className="col-xxl-4 col-md-5">
        <div className="panel">
          <div className="panel-header">
            <h5>Add New Image</h5>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end">
                  <div className="btn-box">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!selectedFile || loading}
                    >
                      {loading ? "Processing..." : "Upload and Analyze"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Vehicle Number */}
        {openAiApiJSONResponse && (
          <div className="panel mt-4">
            <div className="panel-header">
              <h5>Vehicle Number</h5>
            </div>
            <div className="panel-body">
              <div
                className="bg-light p-2 rounded"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {openAiApiJSONResponse}
              </div>
            </div>
          </div>
        )}

        {/* Full Text */}
        {visionApiJSONResponse && (
          <div className="panel mt-4">
            <div className="panel-header">
              <h5>Extracted Full Text</h5>
            </div>
            <div className="panel-body">
              <div
                className="bg-light p-2 mb-3 rounded"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {visionApiJSONResponse.fullText}
              </div>
            </div>
          </div>
        )}

        {/* Bangla Text */}
        {visionApiJSONResponse && (
          <div className="panel mt-4">
            <div className="panel-header">
              <h5>Converted Bangla Text</h5>
            </div>
            <div className="panel-body">
              <div
                className="bg-light p-2 rounded"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {visionApiJSONResponse.banglaConvertedText}
              </div>
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

export default AddNewImage;
