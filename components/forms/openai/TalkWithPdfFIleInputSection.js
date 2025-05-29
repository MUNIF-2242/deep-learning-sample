import axios from "axios";
import React, { useState } from "react";

const TalkWithPdfFIleInputSection = () => {
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [maxWords, setMaxWords] = useState(50);
  const [selectedFile, setSelectedFile] = useState(null); // Changed to null initially
  const [loading, setLoading] = useState(false);
  const [openaiJSONResponse, setOpenaiJSONResponse] = useState("");

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
      setError("Please select a file.");
      return;
    }

    if (!maxWords || maxWords < 10) {
      setError("Please enter a valid number of words (minimum 10).");
      setResult("");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      formData.append("maxWords", maxWords);

      const response = await axios.post(
        "/api/openai/talk-with-pdf/conversation-began",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setOpenaiJSONResponse(JSON.stringify(response.data, null, 2)); // Format and set the whole JSON response

      setResult(response.data.choices[0].message.content);
      setError("");
    } catch (error) {
      setResult("");
      setError("An error occurred while processing the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row">
        <div className="panel mb-30">
          <div className="panel-header">
            <h5>PDF Summariser</h5>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label htmlFor="formFile" className="form-label">
                    Upload PDF
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="inputWords" className="form-label">
                    Number of Words
                  </label>
                  <input
                    type="number"
                    placeholder="Enter number of words"
                    className="form-control"
                    min="10"
                    value={maxWords}
                    onChange={(e) => setMaxWords(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!selectedFile || loading}
                  >
                    {loading
                      ? "Analyzing PDF..."
                      : `Summarize PDF in about ${maxWords} words`}
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
      {openaiJSONResponse ? (
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
      ) : null}
    </>
  );
};

export default TalkWithPdfFIleInputSection;
