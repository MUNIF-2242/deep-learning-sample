import React, { useContext } from "react";
import { RagChatbotContext } from "@/context/RagChatbotContext";

const AddNewDoc = () => {
  const {
    handlePdfUploadSubmit,
    handleFileChange,
    error,
    loading,
    uploadedPdfUrl,
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
                    {loading ? "Processing..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* {uploadedPdfUrl.length > 0 &&
        uploadedPdfUrl.map((url, index) => (
          <>
            <div className="panel-header">
              <h5>Uploaded pdf url</h5>
            </div>
            <div className="panel-body ">
              <div className="bg-success-subtle p-3 rounded custom-bg-success-subtle">
               
                <p>{url}</p>
              </div>
            </div>
          </>
        ))} */}

      {uploadedPdfUrl.length > 0 &&
        uploadedPdfUrl.map((url, index) => (
          <>
            <div className="panel-header">
              <h5>Total index cost: $ {0.007}</h5>
            </div>
            {/* <div className="panel-body ">
              <h5>Total index cost: $ {0.007}</h5>
            </div> */}
          </>
        ))}

      {/* Show error */}
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
