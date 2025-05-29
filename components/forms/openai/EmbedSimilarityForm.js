import React, { useState } from "react";

const EmbedSimilarityForm = () => {
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [openaiJSONResponse, setOpenaiJSONResponse] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValue1 || !inputValue2) {
      setError("Please enter both inputs");
      setResult("");
      setOpenaiJSONResponse("");
      return;
    }

    try {
      const response = await fetch(
        "/api/openai/embeddings-similarity/embeddings-similarity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt1: inputValue1,
            prompt2: inputValue2,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Set result from the API response

      setResult(data.similarity); // Set the result message
      setPrompt1(inputValue1); // Set the prompt
      setPrompt2(inputValue2); // Set the prompt
      setOpenaiJSONResponse(JSON.stringify(data, null, 2)); // Format and set the whole JSON response
      setError("");
      setInputValue1("");
      setInputValue2("");
    } catch (error) {
      setError("An error occurred while submitting the form");
    }
  };

  return (
    <>
      <div className="col-lg-12">
        <div className="panel">
          <div className="panel-header">
            <h5>User Input </h5>
          </div>
          <div className="panel-body">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label htmlFor="inputCity" className="form-label">
                  Text
                </label>
                <input
                  type="text"
                  placeholder="Please enter your query here..."
                  className="form-control"
                  id="inputCity"
                  value={inputValue1}
                  onChange={(e) => setInputValue1(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputCity" className="form-label">
                  Text
                </label>
                <input
                  type="text"
                  placeholder="Please enter your query here..."
                  className="form-control"
                  id="inputCity"
                  value={inputValue2}
                  onChange={(e) => setInputValue2(e.target.value)}
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
      {error ? (
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
      ) : null}

      {prompt1 && prompt2 ? (
        <div className="col-lg-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Prompt1</h5>
            </div>
            <div className="panel-body">
              <div className="row g-3">
                <div className="bg-primary-subtle p-3 mb-15 rounded">
                  Similarity between {prompt1} and {prompt2}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {result ? (
        <div className="col-lg-12">
          <div className="panel">
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
      ) : null}
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

export default EmbedSimilarityForm;
