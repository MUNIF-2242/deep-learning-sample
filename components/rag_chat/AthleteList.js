import React from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useOpenAIContext } from "@/context/OpenAIContext";

const AthleteList = () => {
  const { personalities, handleAthleteSelect, selectedOption } =
    useOpenAIContext();

  return (
    <div className="panel-body message-list">
      <OverlayScrollbarsComponent
        className="main-menu"
        options={{
          className: "os-theme-light",
          scrollbars: {
            autoHide: "scroll",
          },
        }}
      >
        <div className="scrollable">
          {personalities.map((personality) => (
            <div
              key={personality.title}
              className="single-message"
              onClick={() => handleAthleteSelect(personality)}
              style={{
                border:
                  selectedOption?.title === personality.title
                    ? "1px solid #0D99FF"
                    : "none",
              }}
            >
              <div className="avatar">
                <img
                  src={personality.image}
                  alt={personality.title}
                  width={40}
                  height={40}
                />
                {/* <span className="active-status active"></span> */}
              </div>
              <div className="part-txt">
                <div className="top">
                  <span className="user-name">{personality.title}</span>
                  {/* <span className="msg-time">13 min.</span> */}
                </div>
                <div className="msg-short">
                  <span>{personality.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default AthleteList;
