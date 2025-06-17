import { RagChatbotContext } from "@/context/RagChatbotContext";
import React, { useContext } from "react";
import { Form } from "react-bootstrap";

const RagMessageInput = () => {
  const { inputMessage, setInputMessage, handleQuerySubmit, loading } =
    useContext(RagChatbotContext);
  return (
    <div className="panel-body msg-type-area">
      <form onSubmit={handleQuerySubmit}>
        <Form.Control
          autoComplete="off"
          type="text"
          className="form-control chat-input"
          autoFocus=""
          id="chat-input"
          placeholder="Type your message..."
          value={inputMessage}
          disabled={loading}
          onChange={(e) => setInputMessage(e.target.value)}
        />

        <button className="btn btn-icon btn-outline-primary">
          <i className="fa-light fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default RagMessageInput;
