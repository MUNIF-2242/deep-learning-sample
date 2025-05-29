import React, { useState } from "react";

const ContactForm1 = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [openaiJSONResponse, setOpenaiJSONResponse] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputValue) {
      setError("Please enter a prompt");
      setResult("");
      setPrompt("");
      setOpenaiJSONResponse("");
      return;
    }

    try {
      const response = await fetch("/api/openai/chat-completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setResult(data.choices[0].message.content); // Set the result message
      setPrompt(inputValue); // Set the prompt
      setOpenaiJSONResponse(JSON.stringify(data, null, 2)); // Format and set the whole JSON response
      setError("");
      setInputValue("");
    } catch (error) {
      setResult("");
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

      {prompt ? (
        <div className="col-lg-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Prompt</h5>
            </div>
            <div className="panel-body">
              <div className="row g-3">
                <div className="bg-primary-subtle p-3 mb-15 rounded">
                  {prompt}
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

export default ContactForm1;
