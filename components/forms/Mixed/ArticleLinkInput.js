import React, { useState } from "react";

const ArticleLinkInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetStates();

    if (!inputValue) {
      setError("Please enter a valid article link");
      return;
    }

    try {
      const response = await fetch("/api/mixed/og-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputValue }),
      });

      if (!response.ok) {
        const { error: err } = await response.json();
        setError(err || "Failed to fetch data");
        return;
      }

      const data = await response.json();

      setResult(data);
    } catch (error) {
      setError("An error occurred while submitting the form");
    }
  };

  const resetStates = () => {
    setError("");
    setResult(null);
  };

  const ErrorPanel = ({ error }) => (
    <div className="col-lg-12">
      <div className="panel">
        <div className="panel-header">
          <h5>Error</h5>
        </div>
        <div className="panel-body">
          <div className="row g-3">
            <div className="bg-danger-subtle p-3 mb-15 rounded">{error}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const ResultPanel = ({ title, description, image, date, articleLink }) => (
    <div className="col-lg-4">
      <div
        className=""
        style={{
          backgroundColor: "#232323",
          borderRadius: 32,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          padding: 15,
        }}
      >
        <p style={{ color: "#fff" }}>{title || "No OG Title found"}</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            {/* Image on the left */}
            {image && image !== "No OG Image found" ? (
              <img
                src={image}
                alt="OG Image"
                style={{
                  width: "230px",
                  height: "150px",
                  borderRadius: 16,
                  marginRight: "20px",
                }}
              />
            ) : (
              <p>No OG image found</p>
            )}
          </div>

          {/* Right side content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Right side content top portion*/}
            <div>
              {date && (
                <p style={{ color: "#fff", fontSize: "14px" }}>{date}</p>
              )}

              {/* Article Link */}
              {articleLink && (
                <p
                  style={{
                    color: "#fff",
                    fontSize: "14px",
                    whiteSpace: "nowrap", // Prevent wrapping
                    overflow: "hidden", // Hide overflow
                    textOverflow: "ellipsis", // Add ellipsis if the text overflows
                    width: "100%", // Adjust the width as needed
                    display: "inline-block", // Ensures the link stays on one line
                    maxWidth: "200px", // Adjust width as needed
                  }}
                >
                  <a
                    href={articleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#00d4ff",
                      textDecoration: "none",
                      overflow: "hidden", // Prevent overflow
                      textOverflow: "ellipsis", // Add ellipsis if needed
                      whiteSpace: "nowrap", // Ensure no wrapping
                      display: "block", // Make it a block-level element to respect width
                    }}
                  >
                    {articleLink}
                  </a>
                </p>
              )}
            </div>

            {/* Bottom Buttons */}
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, height: "40px", borderRadius: 20 }}
              ></button>
              <button
                className="btn"
                style={{
                  height: "40px",
                  width: "40px",
                  borderRadius: 20,
                  backgroundColor: "#f64d17",
                }}
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="col-lg-12">
        <div className="panel">
          <div className="panel-header">
            <h5>Article Link</h5>
          </div>
          <div className="panel-body">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-12">
                <label htmlFor="inputCity" className="form-label">
                  Enter Article Link
                </label>
                <input
                  type="text"
                  placeholder="Please enter your article link here"
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
      </div>
      {error && <ErrorPanel error={error} />}
      {result && (
        <ResultPanel
          title={result.title}
          description={result.description}
          image={result.image}
          date={result.date}
          articleLink={result.articleLink}
        />
      )}
    </>
  );
};

export default ArticleLinkInput;
