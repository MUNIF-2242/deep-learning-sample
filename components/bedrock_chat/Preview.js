import React, { useContext } from "react";

import { IdVerificationContext } from "@/context/IdVerificationContext";
import ChatingArea from "./ChatingArea";
import AthleteChatSidebar from "./AthleteChatSidebar";

const Preview = () => {
  const { uploadedImageUrl } = useContext(IdVerificationContext);

  return (
    <div className="col-xxl-8 col-md-7">
      <div className="panel">
        <div className="panel-header">
          <h5>Uploaded Image Preview</h5>
        </div>
        <div className="panel-body">
          <div className="chatting-panel">
            <div className="d-flex">
              <div className="">
                <div className="panel-body border-bottom panelbody-openai"></div>
              </div>

              <div className="panel position-relative">
                <ChatingArea />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
