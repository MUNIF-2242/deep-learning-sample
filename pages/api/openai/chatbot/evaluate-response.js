const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Extract userMessage and assistantMessage from the request body
      const { userMessage, assistantMessage } = req.body;

      // Validate input
      if (
        typeof userMessage !== "string" ||
        typeof assistantMessage !== "string"
      ) {
        return res.status(400).json({ error: "Invalid message format" });
      }

      // Call OpenAI API for evaluation
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              Assistant's Response: "${assistantMessage}"
              User's Response: "${userMessage}"

              Please evaluate the user's response based on the following categories and score each out of 10:
              - Problem-Solving Skills
              - Communication Skills
              - Technical Knowledge
              - Professionalism and Empathy

              If the user's response is irrelevant, illogical, or nonsensical, please assign a score of 0 for all categories. Otherwise, provide scores based on the quality of the response.

              Provide the output in the following format:
              {
                "scores": {
                  "Problem-Solving Skills": 0-10,
                  "Communication Skills": 0-10,
                  "Technical Knowledge": 0-10,
                  "Professionalism and Empathy": 0-10
                },
                "feedback": "Provide an evaluation summary explaining the scores and offering feedback."
              }
            `,
          },
        ],
        max_tokens: 300,
        temperature: 0,
      });

      if (!completion.choices || completion.choices.length === 0) {
        return res
          .status(500)
          .json({ error: "No choices returned from OpenAI API" });
      }

      // Extract the evaluation scores and feedback content from the response
      const evaluationContent = completion.choices[0].message.content;

      // Try to parse the response, with error handling for incomplete responses
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(evaluationContent);

        // Ensure that the scores and feedback exist
        const scores = parsedResponse.scores || {};
        const feedback = parsedResponse.feedback || "No feedback provided.";

        // Extract individual scores or assign default values
        const problemSolving = scores["Problem-Solving Skills"] || 0;
        const communication = scores["Communication Skills"] || 0;
        const technical = scores["Technical Knowledge"] || 0;
        const professionalism = scores["Professionalism and Empathy"] || 0;

        // Return the evaluated scores and feedback to the client
        res.status(200).json({
          scores: {
            problemSolving,
            communication,
            technical,
            professionalism,
          },
          feedback, // Feedback message included in the response
        });
      } catch (parseError) {
        return res.status(200).json({
          scores: {
            problemSolving: 0,
            communication: 0,
            technical: 0,
            professionalism: 0,
          },
          feedback: "Evaluation not provided or incomplete.",
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
