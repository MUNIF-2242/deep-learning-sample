import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { personalities } from "../data/AthleteData";

const OpenAIContext = createContext();

export const OpenAIContextProvider = ({ children }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "You are an assistant" },
  ]);
  const [isConversationEnded, setIsConversationEnded] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState("");

  // State to store scores from backend
  const [scores, setScores] = useState({
    problemSolving: 0,
    communication: 0,
    technical: 0,
    professionalism: 0,
  });

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // State to track how many evaluations have been made for averaging
  const [scoreCount, setScoreCount] = useState({
    problemSolving: 0,
    communication: 0,
    technical: 0,
    professionalism: 0,
  });

  // State to store average scores
  const [averageScores, setAverageScores] = useState({
    problemSolving: 0,
    communication: 0,
    technical: 0,
    professionalism: 0,
  });

  useEffect(() => {
    if (!selectedOption && personalities.length > 0) {
      handleAthleteSelect(personalities[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);

  useEffect(() => {
    // Calculate averages whenever scores or count changes
    calculateAverageScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores, scoreCount]);

  const handleAthleteSelect = (personality) => {
    if (selectedOption?.title === personality.title) {
      return;
    }

    setSelectedOption(personality);
    setIsConversationEnded(false);
    resetScores();

    const messages = createMessages(personality); // Create messages
    setMessages(messages);
  };
  const createMessages = (personality) => {
    const shuffledProblems = shuffleArray([...personality.problems]); // Shuffle the problems

    const systemMsg = {
      role: "system",
      content: `You are acting as ${
        personality.title
      }, a famous athlete known for ${personality.description}. 
Introduce yourself in less than 10 words.

Your goal is to engage the user in helping **you** (as the personality) solve your own challenges. Present your challenges and ask the user for advice, as if you are seeking their expertise or perspective. The challenges you are dealing with include: ${shuffledProblems.join(
        ", "
      )}.

If the user's response does not directly address your challenges, gently steer the conversation back by reminding them of the specific difficulties you're facing and asking for their thoughts. Stay supportive and curious about the user's ideas, and avoid giving solutions to the user's problems. Always focus on discussing your own struggles and exploring how the user can help you.`,
    };

    const initialMessage = {
      role: "assistant",
      content: `Hello, I am ${personality.title}. ${personality.description} ${shuffledProblems[0]}`,
    };

    return [systemMsg, initialMessage]; // Return the messages as an array
  };

  // Function to evaluate user responses
  const evaluateResponse = async (userMessage, assistantResponse) => {
    try {
      // Call the backend API for evaluation
      const evaluationResponse = await axios.post(
        "/api/openai/chatbot/evaluate-response",
        {
          userMessage,
          assistantMessage: assistantResponse,
        }
      );

      // Extract new scores from the evaluation response
      const newScores = evaluationResponse.data.scores;

      setAnswerFeedback(evaluationResponse.data.feedback);

      // Update scores based on the evaluation response
      setScores((prevScores) => ({
        problemSolving: prevScores.problemSolving + newScores.problemSolving,
        communication: prevScores.communication + newScores.communication,
        technical: prevScores.technical + newScores.technical,
        professionalism: prevScores.professionalism + newScores.professionalism,
      }));

      // Update score count for averaging
      setScoreCount((prevCount) => ({
        problemSolving: prevCount.problemSolving + 1,
        communication: prevCount.communication + 1,
        technical: prevCount.technical + 1,
        professionalism: prevCount.professionalism + 1,
      }));
    } catch (error) {}
  };

  // Function to calculate average scores
  const calculateAverageScores = () => {
    const averages = {
      problemSolving:
        scoreCount.problemSolving > 0
          ? (scores.problemSolving / scoreCount.problemSolving).toFixed(2)
          : 0,
      communication:
        scoreCount.communication > 0
          ? (scores.communication / scoreCount.communication).toFixed(2)
          : 0,
      technical:
        scoreCount.technical > 0
          ? (scores.technical / scoreCount.technical).toFixed(2)
          : 0,
      professionalism:
        scoreCount.professionalism > 0
          ? (scores.professionalism / scoreCount.professionalism).toFixed(2)
          : 0,
    };

    setAverageScores(averages); // Update average scores in state
  };

  // Function to reset scores and score counts
  const resetScores = () => {
    setScores({
      problemSolving: 0,
      communication: 0,
      technical: 0,
      professionalism: 0,
    });
    setScoreCount({
      problemSolving: 0,
      communication: 0,
      technical: 0,
      professionalism: 0,
    });
  };

  // Function to reset the conversation
  const resetConversation = () => {
    if (selectedOption) {
      setIsConversationEnded(false);
      resetScores();

      const messages = createMessages(selectedOption); // Create messages
      setMessages(messages);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputMessage.trim() !== "") {
      const updatedMessages = [
        ...messages,
        { role: "user", content: inputMessage },
      ];

      try {
        // Add the user's message to the state
        setMessages(updatedMessages);
        setInputMessage("");

        // Check if this is the last message to end the conversation
        if (updatedMessages.length >= 10) {
          // Evaluate the last user response before ending the conversation
          await evaluateResponse(inputMessage, ""); // Passing an empty string for assistantResponse

          const goodbyeMessage = {
            role: "assistant",
            content:
              "Thank you for chatting! Your evaluation report shows on the right side of the screen. Goodbye!",
          };
          setMessages((prevMessages) => [...prevMessages, goodbyeMessage]);

          setIsConversationEnded(true);
          return; // Stop the conversation and avoid further API calls
        }

        // Make the API call for the assistant's response
        const response = await axios.post("/api/openai/chatbot/chat-messages", {
          messages: updatedMessages,
        });

        const assistantResponse = response.data.choices[0].message.content;

        // Add the assistant's response to the conversation
        const updatedMessagesWithResponse = [
          ...updatedMessages,
          { role: "assistant", content: assistantResponse },
        ];
        setMessages(updatedMessagesWithResponse);

        // Evaluate the user response with the assistant's response
        await evaluateResponse(inputMessage, assistantResponse);
      } catch (error) {}
    }
  };

  return (
    <OpenAIContext.Provider
      value={{
        selectedOption,
        setSelectedOption,
        messages,
        setMessages,
        inputMessage,
        setInputMessage,
        handleSubmit,
        handleAthleteSelect,
        personalities,
        scores,
        averageScores, // Expose average scores in the context
        isConversationEnded,
        resetConversation,
        answerFeedback,
      }}
    >
      {children}
    </OpenAIContext.Provider>
  );
};

export const useOpenAIContext = () => useContext(OpenAIContext);
