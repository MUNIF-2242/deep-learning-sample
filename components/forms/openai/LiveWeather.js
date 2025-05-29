import React, { useState } from "react";

const LiveWeather = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [openaiJSONResponse, setOpenaiJSONResponse] = useState("");

  const [selectedOption, setSelectedOption] = useState("");
  const [messages, setMessages] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetStates();

    if (!inputValue) {
      setError("Please enter a prompt");
      return;
    }

    try {
      const response = await fetch("/api/openai/live-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputValue }),
      });

      if (!response.ok) {
        const { error: err } = await response.json();
        setError(err);
        return;
      }

      const data = await response.json();
      setPrompt(inputValue);
      setResult(data.request3.choices[0].message.content);
      setOpenaiJSONResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setError("An error occurred while submitting the form");
    }
  };

  const resetStates = () => {
    setError("");
    setResult("");
    setPrompt("");
    setOpenaiJSONResponse("");
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

  const ResultPanel = ({ title, content }) => (
    <div className="col-lg-12">
      <div className="panel">
        <div className="panel-header">
          <h5>{title}</h5>
        </div>
        <div className="panel-body">
          <div className="row g-3">
            <div className="bg-success-subtle p-3 mb-15 rounded">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const JSONResponsePanel = ({ json }) => (
    <div className="col-lg-12">
      <div className="panel">
        <div className="panel-header">
          <h5>Response</h5>
        </div>
        <div className="panel-body">
          <div className="row g-3">
            <div className="bg-primary-subtle p-3 mb-15 rounded">
              <pre>{json}</pre>
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
      {error && <ErrorPanel error={error} />}
      {prompt && <ResultPanel title="Prompt" content={prompt} />}
      {result && <ResultPanel title="Result" content={result} />}
      {openaiJSONResponse && <JSONResponsePanel json={openaiJSONResponse} />}
    </>
  );
};

export default LiveWeather;
