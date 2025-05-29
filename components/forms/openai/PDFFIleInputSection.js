import React, { useState } from "react";

const PDFFIleInputSection = () => {
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openaiJSONResponse, setOpenaiJSONResponse] = useState("");

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

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result;

        // Step 1: Upload the image
        const uploadResponse = await fetch("/api/id-verification/uploadImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();

          throw new Error(errorData.message || "Failed to upload image.");
        }

        const uploadData = await uploadResponse.json();

        setResult(`Image uploaded successfully: ${uploadData.imageUrl}`);

        // Step 2: Call OpenAI to describe the image
        const openaiResponse = await fetch("/api/id-verification/extract-nid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: uploadData.imageUrl }),
        });

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json();

          throw new Error(
            errorData.message || "Failed to get OpenAI response."
          );
        }

        const openaiData = await openaiResponse.json();

        setOpenaiJSONResponse(JSON.stringify(openaiData.description, null, 2));
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError(err.message || "An error occurred while processing the image.");
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <>
      <div className="row">
        <div className="panel mb-30">
          <div className="panel-header">
            <h5>Image Upload</h5>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="formFile" className="form-label">
                    Upload Image
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!selectedFile || loading}
                  >
                    {loading ? "Processing..." : "Upload and Analyze"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {error && (
        <div className="col-lg-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Error</h5>
            </div>
            <div className="panel-body">
              <div className="row g-3">
                <div className="bg-danger-subtle p-3 mb-15 rounded">
                  {error}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="row">
          <div className="panel mb-30">
            <div className="panel-header">
              <h5>Result</h5>
            </div>
            <div className="panel-body">
              <div className="row g-3">
                <div className="bg-success-subtle p-3 mb-15 rounded">
                  {result}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {openaiJSONResponse && (
        <div className="col-lg-12">
          <div className="panel">
            <div className="panel-header">
              <h5>OpenAI Response</h5>
            </div>
            <div className="panel-body">
              <div className="row g-3">
                <div className="bg-primary-subtle p-3 mb-15 rounded">
                  <pre>{openaiJSONResponse}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFFIleInputSection;
