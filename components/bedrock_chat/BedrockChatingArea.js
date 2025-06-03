import React from "react";
import BedrockMessageArea from "./BedrockMessageArea";
import BedrockMessageInput from "./BedrockMessageInput";
import BedrockChatTopBar from "./BedrockChatTopBar";

const BedrockChatingArea = () => {
  return (
    <div className="chatting-area">
      <BedrockChatTopBar />
      <BedrockMessageArea />
      <BedrockMessageInput />
    </div>
  );
};

export default BedrockChatingArea;
