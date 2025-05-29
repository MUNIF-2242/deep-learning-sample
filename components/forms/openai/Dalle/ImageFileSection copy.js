import React, { useState } from "react";

const ImageFileSection = ({ imageUrls }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [imageName, setImageName] = useState("");
  const [formVisible, setFormVisible] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setFormVisible(true);
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
      setFormVisible(false);
      setImageName("");
    } catch (error) {}
  };

  return (
    <div>
      <h5>Recent Files</h5>
      <div>
        {imageUrls.map((imageObj, index) => (
          <div
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={imageObj.url}
              alt={`File ${index}`}
              style={{ display: "block", maxWidth: "100px", height: "auto" }}
            />
          </div>
        ))}
      </div>

      {formVisible && selectedImageIndex !== null && (
        <div>
          <h5>Save Image</h5>
          <form onSubmit={handleSave}>
            <div>
              <label htmlFor="imageName">Image Name</label>
              <input
                type="text"
                id="imageName"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="Enter image name"
              />
            </div>
            <button type="submit">Save Image</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ImageFileSection;
