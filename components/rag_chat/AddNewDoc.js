import React, { useContext } from "react";
import { RagChatbotContext } from "@/context/RagChatbotContext";

const AddNewDoc = () => {
  const {
    handlePdfUploadSubmit,
    handleFileChange,
    error,
    loading,
    uploadedPdfUrl,
    uploadPhase,
    indexingProgress,
    getButtonText,
  } = useContext(RagChatbotContext);

  return (
    <div className="col-xxl-12 col-md-5">
      <div className="panel">
        <div className="panel-header">
          <h5>Upload PDF</h5>
        </div>
        <div className="panel-body">
          <form onSubmit={handlePdfUploadSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <input
                  className="form-control"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </div>

              <div className="col-12 d-flex justify-content-end">
                <div className="btn-box">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {getButtonText()}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Progress indicator for indexing */}
          {uploadPhase === "indexing" && (
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">Indexing documents...</small>
                <small className="text-muted">
                  {indexingProgress.current}/{indexingProgress.total}
                </small>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{
                    width: `${
                      (indexingProgress.current / indexingProgress.total) * 100
                    }%`,
                  }}
                  aria-valuenow={indexingProgress.current}
                  aria-valuemin="0"
                  aria-valuemax={indexingProgress.total}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

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
  );
};

export default AddNewDoc;
