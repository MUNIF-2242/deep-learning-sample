import React from "react";
import { useOpenAIContext } from "@/context/OpenAIContext";

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
        <div className="btn bg-success-subtle">Student Evaluation Report</div>
        <div className="scrollable">
          <div className="">
            <div className="col-lg-12 col-6 col-xs-12">
              <div className="dashboard-top-box d-block rounded border-0 panel-bg">
                <div className="progress-box">
                  <p className="d-flex justify-content-between mb-1">
                    Problem-Solving Skills{" "}
                    <small>{averageScores.problemSolving}/10</small>
                  </p>
                  <div
                    className="progress openai-progress"
                    role="progressbar"
                    aria-label="Problem-Solving Skills"
                    aria-valuenow={averageScores.problemSolving * 10}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: `${averageScores.problemSolving * 10}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Communication Skills */}
          <div className="">
            <div className="col-lg-12 col-6 col-xs-12">
              <div className="dashboard-top-box d-block rounded border-0 panel-bg">
                <div className="progress-box">
                  <p className="d-flex justify-content-between mb-1">
                    Communication Skills{" "}
                    <small>{averageScores.communication}/10</small>
                  </p>
                  <div
                    className="progress openai-progress"
                    role="progressbar"
                    aria-label="Communication Skills"
                    aria-valuenow={averageScores.communication * 10}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar bg-primary"
                      style={{
                        width: `${averageScores.communication * 10}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Knowledge */}
          <div className="">
            <div className="col-lg-12 col-6 col-xs-12">
              <div className="dashboard-top-box d-block rounded border-0 panel-bg">
                <div className="progress-box">
                  <p className="d-flex justify-content-between mb-1">
                    Technical Knowledge{" "}
                    <small>{averageScores.technical}/10</small>
                  </p>
                  <div
                    className="progress openai-progress"
                    role="progressbar"
                    aria-label="Technical Knowledge"
                    aria-valuenow={averageScores.technical * 10}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar bg-warning"
                      style={{
                        width: `${averageScores.technical * 10}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professionalism and Empathy */}
          <div className="">
            <div className="col-lg-12 col-6 col-xs-12">
              <div className="dashboard-top-box d-block rounded border-0 panel-bg">
                <div className="progress-box">
                  <p className="d-flex justify-content-between">
                    Professionalism and Empathy{" "}
                    <small>{averageScores.professionalism}/10</small>
                  </p>
                  <div
                    className="progress openai-progress"
                    role="progressbar"
                    aria-label="Professionalism and Empathy"
                    aria-valuenow={averageScores.professionalism * 10}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="progress-bar bg-danger"
                      style={{
                        width: `${averageScores.professionalism * 10}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="d-flex justify-content-center mt-2">
          <button
            type="button"
            className="btn bg-success-subtle mb-20"
            onClick={resetConversation}
          >
            Try again
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AthleteChatSidebar;
