import React from "react";
import AthleteChatTopBar from "./AthleteChatTopBar";
import AthleteMessageArea from "./AthleteMessageArea";
import AthleteMessageInput from "./AthleteMessageInput";

const ChatingArea = () => {
  return (
    <div className="chatting-area">
      <AthleteChatTopBar />
      <AthleteMessageArea />
      <AthleteMessageInput />
    </div>
  );
};

export default ChatingArea;
