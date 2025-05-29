import React, { useEffect, useState } from "react";
import ImageFileSection from "./ImageFileSection";

const CreateImagePrompt = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [openaiJSONResponse, setOpenaiJSONResponse] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

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
      const response = await fetch("/api/openai/dalle/create-image", {
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

      setImageUrls(data.imageResponse.data);

      //setResult(data.choices[0].message.content); // Set the result message
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
    setImageUrls([
      {
        url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-UNjXN33nLtRMxluJS1H19BuG/user-iYwgSqPYiuPmUZvCTHfumprH/img-kGqRj51JhGH7wB5bSrhHPPUf.png?st=2024-10-12T18%3A06%3A09Z&se=2024-10-12T20%3A06%3A09Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-11T23%3A07%3A54Z&ske=2024-10-12T23%3A07%3A54Z&sks=b&skv=2024-08-04&sig=hrwtpqhucSobtfueJ49YfIMT4GnmgmFIF05AZAxJe3Y%3D",
      },
      {
        url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-UNjXN33nLtRMxluJS1H19BuG/user-iYwgSqPYiuPmUZvCTHfumprH/img-EDGHrTXHJehuh0P1e2iWPCA4.png?st=2024-10-12T18%3A06%3A09Z&se=2024-10-12T20%3A06%3A09Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-10-11T23%3A07%3A54Z&ske=2024-10-12T23%3A07%3A54Z&sks=b&skv=2024-08-04&sig=JAE1Ijq63qzX70ozslfGW6qmc1ovS4%2BKt%2BzkeYcnrHU%3D",
      },
    ]);
  }, []);

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

      <ImageFileSection imageUrls={imageUrls} />
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

export default CreateImagePrompt;
