import React, { useEffect, useRef } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useOpenAIContext } from "@/context/OpenAIContext";

const AthleteMessageArea = () => {
  const { messages, selectedOption, resetConversation, isConversationEnded } =
    useOpenAIContext();
  const scrollRef = useRef(null); // Ref for the scrollable area

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to the last message
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight; // Scroll to the bottom
    }
  }, [messages]);

  return (
    <div className="panel-body msg-area" id="my-cellibrity-chat-area">
      <OverlayScrollbarsComponent
        className="main-menu"
        options={{
          className: "os-theme-light",
          scrollbars: {
            autoHide: "scroll",
          },
        }}
      >
        <div
          ref={scrollRef} // Attach the ref here
          className="scrollable main-chat-area"
          style={{ maxHeight: "900px", overflowY: "auto" }} // Set max height and overflow
        >
          {messages
            .filter((message) => message.role !== "system") // Exclude system messages
            .map((message, index) => {
              if (message.role === "user") {
                return (
                  <div
                    key={index}
                    className="single-message outgoing"
                    style={{ justifyContent: "flex-end", textAlign: "right" }}
                  >
                    <div className="msg-box">
                      <div className="msg-box-inner">
                        <div className="msg-option">
                          <span className="msg-time">1 day</span>
                          <button className="btn-flush">
                            <i className="fa-light fa-ellipsis-vertical"></i>
                          </button>
                        </div>
                        <span className="sent-status seen" title="seen">
                          <i className="fa-solid fa-circle-check"></i>
                        </span>
                        <p>{message.content}</p>
                      </div>
                    </div>
                    <div className="avatar">
                      <img
                        src="/assets/images/munif.jpg"
                        alt="User Avatar"
                        width={35}
                        height={35}
                      />
                    </div>
                  </div>
                );
              } else if (message.role === "assistant") {
                return (
                  <div
                    key={index}
                    className="single-message"
                    style={{ justifyContent: "flex-start", textAlign: "left" }}
                  >
                    <div className="avatar">
                      <img
                        src={selectedOption.image}
                        alt="Assistant Avatar"
                        width={35}
                        height={35}
                      />
                    </div>
                    <div className="msg-box">
                      <div className="msg-box-inner">
                        <div className="msg-option">
                          <span className="msg-time">1 day</span>
                          <button className="btn-flush">
                            <i className="fa-light fa-ellipsis-vertical"></i>
                          </button>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          <div ref={scrollRef} />
          {isConversationEnded && (
            <div className="d-flex justify-content-center mt-2">
              <button
                type="button"
                className="btn bg-success-subtle mb-20"
                onClick={resetConversation}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default AthleteMessageArea;
