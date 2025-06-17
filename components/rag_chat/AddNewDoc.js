import { RagChatbotContext } from "@/context/RagChatbotContext";
import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/dist/sweetalert2.min.css";

const MySwal = withReactContent(Swal);

const AddNewDoc = () => {
  const {
    setUploadedImageUrl,
    handleSubmit,
    handleFileChange,
    error,
    result,
    loading,
  } = useContext(RagChatbotContext);

  return (
    <>
      <div className="col-xxl-12 col-md-5">
        <div className="panel">
          <div className="panel-header">
            <h5>Upload PDF</h5>
          </div>
          <div className="panel-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <input
                    className="form-control"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end">
                  <div className="btn-box">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      //disabled={!selectedFile || loading}
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Success Panel */}
        {result && (
          <>
            <div className="panel-header">
              <h5>Success</h5>
            </div>
            <div className="panel-body">
              <div className="bg-success-subtle p-3 rounded">{result}</div>
            </div>
          </>
        )}

        {/* Error Panel */}
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

export default AddNewDoc;
