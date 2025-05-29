import React, { useState } from "react";

const StreamForm = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValue) {
      setError("Please enter a prompt");
      return;
    }

    setError("");
    setIsLoading(true);
    setResult(""); // Clear previous results
    setPrompt(inputValue); // Set the prompt for display

    try {
      const response = await fetch("/api/openai/chat-completion-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completeText = "";

      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        completeText += chunk;
        setResult((prev) => prev + chunk); // Append new data to the result
      }

      setIsLoading(false);
    } catch (error) {
      setError("An error occurred while submitting the form.");
      setIsLoading(false);
    }
  };

  return (
    <div className="col-lg-12">
      <div className="panel">
        <div className="panel-header">
          <h5>User Input</h5>
        </div>
        <div className="panel-body">
          <form className="row g-3" onSubmit={handleSubmit}>
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
                disabled={isLoading}
              />
            </div>
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="col-lg-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Error</h5>
            </div>
            <div className="panel-body">
              <div className="bg-danger-subtle p-3 mb-15 rounded">{error}</div>
            </div>
          </div>
        </div>
      )}

      {prompt && (
        <div className="col-lg-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Prompt</h5>
            </div>
            <div className="panel-body">
              <div className="bg-primary-subtle p-3 mb-15 rounded">
                {prompt}
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="col-lg-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Result</h5>
            </div>
            <div className="panel-body">
              <div className="bg-success-subtle p-3 mb-15 rounded">
                {result}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamForm;
