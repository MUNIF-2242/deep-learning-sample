import React, { useEffect, useRef, useState } from "react";
import ImageFileSection from "./ImageFileSection";
import EditImageFileInputSection from "./EditImageFIleInputSection";
import axios from "axios";

const EditImagePrompt = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [openaiJSONResponse, setOpenaiJSONResponse] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [dots, setDots] = useState([]); // Store dots coordinates
  const canvasRef = useRef(null);

  const editSubmit = async (event) => {
    event.preventDefault();

    if (!inputValue) {
      setError("Please enter a prompt");
      setResult("");
      setPrompt("");
      setOpenaiJSONResponse("");
      return;
    }

    try {
      // Get the image dimensions
      const img = new Image();
      img.src = uploadedImage;
      await new Promise((resolve) => {
        img.onload = resolve; // Wait until image is loaded
      });

      const originalWidth = img.width;
      const originalHeight = img.height;

      const maxWidth = 500;
      const maxHeight = 500;

      let width = originalWidth;
      let height = originalHeight;

      // Calculate the scaling factor
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = maxWidth / aspectRatio;
        } else {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }
      }

      const scalingFactorX = width / originalWidth;
      const scalingFactorY = height / originalHeight;

      // Adjust the dots based on the scaling factors
      const scaledMarkedPoints = dots.map((dot) => ({
        x: dot.x * scalingFactorX,
        y: dot.y * scalingFactorY,
      }));

      // Now make the API call with the scaled points
      const response = await axios.post("/api/openai/dalle/edit-image", {
        imageUrl: uploadedImage,
        points: scaledMarkedPoints, // Use the scaled points here
        prompt: inputValue,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setImageUrls(data.imageResponse.data);

      setPrompt(inputValue); // Set the prompt
      setOpenaiJSONResponse(JSON.stringify(data, null, 2)); // Format and set the whole JSON response
      setError("");
      setInputValue("");
    } catch (error) {
      setResult("");
      setError("An error occurred while submitting the form");
    }
  };

  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = uploadedImage;

      img.onload = () => {
        const maxWidth = 500;
        const maxHeight = 500;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
      };
    }
  }, [uploadedImage]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setDots((prevDots) => [...prevDots, { x, y }]);
    const ctx = canvas.getContext("2d");
    const dotRadius = 5;
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  };

  const drawImageAndMask = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!uploadedImage) return;

    const img = new Image();
    img.src = uploadedImage;

    img.onload = () => {
      // Clear the canvas before drawing the new shape
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the uploaded image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Redraw all the dots
      dots.forEach((dot) => {
        const dotRadius = 5;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      });

      // Draw the mask shape if enough dots are available
      if (dots.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(dots[0].x, dots[0].y);

        dots.forEach((dot, index) => {
          if (index > 0) ctx.lineTo(dot.x, dot.y);
        });

        ctx.closePath();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent mask color
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
      }
    };
  };

  // Call drawImageAndMask whenever the dots change to ensure only the latest mask shape shows
  useEffect(() => {
    drawImageAndMask();
  }, [dots]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) canvas.addEventListener("click", handleCanvasClick);
    return () => {
      if (canvas) canvas.removeEventListener("click", handleCanvasClick);
    };
  }, []);

  return (
    <>
      <div className="col-lg-12">
        <div className="panel">
          <div className="panel-header">
            <h5>User Input</h5>
          </div>
          <div className="panel-body">
            <form className="row g-3" onSubmit={editSubmit}>
              <div className="col-md-12">
                <label htmlFor="inputCity" className="form-label">
                  Text
                </label>
                <input
                  type="text"
                  placeholder="Please enter your query here..."
                  className="form-control"
                  id="inputCity"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        <EditImageFileInputSection setImage={setUploadedImage} />
      </div>

      {/* Render Canvas */}
      <div className="col-lg-12 mt-3">
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid #ccc", maxWidth: "100%" }}
        />
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

      <ImageFileSection imageUrls={imageUrls} />

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

export default EditImagePrompt;
