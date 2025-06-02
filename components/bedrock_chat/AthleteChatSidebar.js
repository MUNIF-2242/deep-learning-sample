import React from "react";
import { useOpenAIContext } from "@/context/OpenAIContext";
import AddNewImage from "../nid/AddNewImage";
import AddNewDoc from "./AddNewDoc";

const AthleteChatSidebar = () => {
  const {
    selectedOption,
    isConversationEnded,
    averageScores,
    resetConversation,
  } = useOpenAIContext();

  return (
    <div className="panel border-start rounded-0 closed">
      <div className="panel-body border-bottom">
        <div className="user-short">
          <button className="back-to-chat-btn btn-flush fs-14 d-xxl-none">
            <i className="fa-light fa-arrow-left"></i>
          </button>
          <div className="avatar avatar-lg">
            <img
              src={selectedOption.image}
              alt={`${selectedOption.title} Image`}
              width={60}
              height={60}
            />
          </div>
          <div className="part-txt">
            <span className="user-name">{selectedOption.title}</span>
            <span className="user-mail">{selectedOption.description}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <AddNewDoc />
      </div>
    </div>
  );
};

export default AthleteChatSidebar;
