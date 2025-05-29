import { IdVerificationContext } from "@/context/IdVerificationContext";
import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";

const CompareAndVerify = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { uploadedNidImageUrl, uploadedTradeLicenseImageUrl } = useContext(
    IdVerificationContext
  );
  const [visionApiJSONResponse, setVisionApiJSONResponse] = useState(null);
  const [openAiApiJSONResponse, setOpenAiApiJSONResponse] = useState(null);
  const [isFaceMatched, setIsFaceMatched] = useState(null); // null initially

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const nidKey = uploadedNidImageUrl.split("/").pop();
      const tradeLicenseKey = uploadedTradeLicenseImageUrl.split("/").pop();

      //Step 1: Compare faces using AWS Rekognition

      const rekognitionResponse = await fetch(
        "/api/aws/rekognition/compare-face",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceImageName: nidKey,
            targetImageName: tradeLicenseKey,
          }),
        }
      );

      const compareFaceResult = await rekognitionResponse.json();
      console.log("Face comparison result:", compareFaceResult);
      setIsFaceMatched(compareFaceResult.matched);

      console.log(compareFaceResult.matched);

      // Step 2: Analyze text
      const visionResponse = await fetch(
        "/api/cloud-vision/features/text-detection/extract-trade",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: uploadedTradeLicenseImageUrl }),
        }
      );

      if (!visionResponse.ok) {
        const errorData = await visionResponse.json();
        throw new Error(errorData.error || "Vision API failed.");
      }

      const visionData = await visionResponse.json();
      setVisionApiJSONResponse(visionData);

      // Step 3: Call OpenAi API with banglaConvertedText
      const analyzeResponse = await fetch("/api/openai/trade/analyzeText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputText: visionData.fullText }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || "OpenAI Text Analysis failed.");
      }

      const analyzeData = await analyzeResponse.json();
      const parsedResult = JSON.parse(analyzeData.result); // <-- parse it
      setOpenAiApiJSONResponse(parsedResult); // <-- now it's an object
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-xxl-4 col-md-5">
        <div className="panel">
          <div className="panel-header">
            <h5>Trade License Verification Requirements</h5>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <div className="icon-col">
                    <div className="icon-box d-flex align-items-center gap-2">
                      <span className="icon">
                        {isFaceMatched === true ? (
                          <i className="fa-duotone fa-check text-success fs-3"></i> // Green tick, large size
                        ) : isFaceMatched === false ? (
                          <i className="fa-solid fa-xmark text-danger fs-3"></i>
                        ) : (
                          <>1.</> // Default/neutral
                        )}
                      </span>
                      <span
                        className={`icon-name fw-bold ${
                          isFaceMatched === true
                            ? "text-success"
                            : isFaceMatched === false
                            ? "text-danger"
                            : ""
                        }`}
                      >
                        Compare Face
                      </span>
                    </div>
                  </div>
                  <div className="icon-col">
                    <div className="icon-box d-flex align-items-center gap-2">
                      <span className="icon">
                        {openAiApiJSONResponse?.documentType ===
                        "Trade License" ? (
                          <i className="fa-duotone fa-check text-success fs-3"></i>
                        ) : openAiApiJSONResponse ? (
                          <i className="fa-solid fa-xmark text-danger fs-3"></i>
                        ) : (
                          <>2.</>
                        )}
                      </span>
                      <span
                        className={`icon-name fw-bold ${
                          openAiApiJSONResponse?.documentType ===
                          "Trade License"
                            ? "text-success"
                            : openAiApiJSONResponse
                            ? "text-danger"
                            : "      "
                        }`}
                      >
                        Document Type Detection
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 d-flex justify-content-end">
                  <div className="btn-box">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      // disabled={!selectedFile || loading}
                    >
                      {loading ? "Processing..." : "Verify"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {openAiApiJSONResponse && (
          <div className="panel mt-4">
            <div className="panel-header">
              <h5>License Type</h5>
            </div>
            <div className="panel-body">
              <div
                className="bg-light p-2 rounded"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {JSON.stringify(openAiApiJSONResponse, null, 2)}
              </div>
            </div>
          </div>
        )}

        {visionApiJSONResponse && (
          <div className="panel mt-4">
            <div className="panel-header">
              <h5>Extracted Full Text</h5>
            </div>
            <div className="panel-body">
              <div
                className="bg-light p-2 mb-3 rounded"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {visionApiJSONResponse.fullText}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="panel mt-4">
            <div className="panel-header">
              <h5>Error</h5>
            </div>
            <div className="panel-body">
              <div className="bg-danger-subtle p-3 rounded">{error}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CompareAndVerify;
