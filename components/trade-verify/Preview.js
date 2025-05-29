import React, { useContext } from "react";

import { IdVerificationContext } from "@/context/IdVerificationContext";

const Preview = () => {
  const { uploadedImageUrl } = useContext(IdVerificationContext);

  return (
    <div className="col-xxl-4 col-md-7">
      <div className="panel">
        <div className="panel-header">
          <h5>Uploaded Image Preview</h5>
        </div>
        <div className="panel-body">
          {uploadedImageUrl && (
            <div className="mb-3">
              <img
                key={uploadedImageUrl}
                src={uploadedImageUrl}
                alt="Uploaded category"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
