import { IdVerificationContext } from "@/context/IdVerificationContext";
import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";

const MySwal = withReactContent(Swal);

const AddTradeLicenseImage = () => {
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { uploadedTradeLicenseImageUrl, setUploadedTradeLicenseImageUrl } =
    useContext(IdVerificationContext);

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
  // ////////////
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    setUploadedTradeLicenseImageUrl("");

    if (!selectedFile) {
      setError("No file selected.");
      setLoading(false);
      return;
    }

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result;

        try {
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

          setUploadedTradeLicenseImageUrl(imageUrl);

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
        } catch (uploadErr) {
          setError(uploadErr.message || "Upload failed.");
        } finally {
          setLoading(false); // ✅ move here
          setSelectedFile(null);
        }
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError(err.message || "An error occurred.");
      setLoading(false); // in case FileReader setup fails
    }
  };

  return (
    <>
      <div className="col-xxl-4 col-md-5">
        <div className="panel">
          <div className="panel-header">
            <h5>Trade License Image</h5>
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
                      {loading ? "Processing..." : "Upload"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="panel-body">
          {uploadedTradeLicenseImageUrl && (
            <div className="mb-3">
              <img
                key={uploadedTradeLicenseImageUrl}
                src={uploadedTradeLicenseImageUrl}
                alt="Uploaded category"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
        </div>

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

export default AddTradeLicenseImage;
