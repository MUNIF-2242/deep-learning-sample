import React, { useState } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

const ImageFileSection = ({ imageUrls }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // To track selected image
  const [imageName, setImageName] = useState(""); // To track the image name input
  const [formVisible, setFormVisible] = useState(false); // To show/hide the form

  const handleImageClick = (index) => {
    if (selectedImageIndex === index) {
      // If the same image is clicked again, deselect it and hide the form
      setSelectedImageIndex(null);
      setFormVisible(false);
    } else {
      // If a new image is selected, update the index and show the form
      setSelectedImageIndex(index);
      setFormVisible(true);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!imageName) {
      alert("Please enter a name for the image.");
      return;
    }

    const imageUrl = imageUrls[selectedImageIndex]?.url;

    try {
      const response = await fetch("/api/openai/dalle/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageName: imageName,
          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save the image.");
      }

      alert("Image saved successfully!");
      setFormVisible(false); // Hide the form after saving
      setImageName(""); // Clear the input field
    } catch (error) {}
  };

  return (
    <div className="col-lg-12">
      <div className="panel">
        <div className="panel-header">
          <h5>Recent Files</h5>
        </div>
        <div className="panel-body">
          <OverlayScrollbarsComponent>
            <div>
              <div className="file-manager-row recent-files">
                {imageUrls.map((imageObj, index) => (
                  <div key={index} className="">
                    <div
                      className="file-card"
                      style={{
                        border:
                          selectedImageIndex === index
                            ? "3px solid blue"
                            : "none",
                        cursor: "pointer",
                      }}
                      onClick={() => handleImageClick(index)}
                    >
                      <img src={imageObj.url} alt={`File ${index}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </OverlayScrollbarsComponent>

          {/* Form to enter image name */}
          {formVisible && selectedImageIndex !== null && (
            <div className="panel">
              <div className="panel-header">
                <h5>Save Image</h5>
              </div>
              <div className="panel-body">
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label htmlFor="imageName" className="form-label">
                      Image Name
                    </label>
                    <input
                      type="text"
                      id="imageName"
                      className="form-control"
                      value={imageName}
                      onChange={(e) => setImageName(e.target.value)}
                      placeholder="Enter image name"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Image
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageFileSection;
