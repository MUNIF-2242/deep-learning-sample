import React from "react";
import { useOpenAIContext } from "@/context/OpenAIContext";
import AddNewImage from "../nid/AddNewImage";
import AddNewDoc from "./AddNewDoc";

const BedrockChatSidebar = () => {
  const {
    selectedOption,
    isConversationEnded,
    averageScores,
    resetConversation,
  } = useOpenAIContext();

  return (
    <div className="panel border-start rounded-0 closed">
      <div className="card">
        <AddNewDoc />
      </div>
    </div>
  );
};

export default BedrockChatSidebar;
