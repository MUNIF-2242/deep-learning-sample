const OpenAI = require("openai");
const fetch = require("node-fetch");

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt } = req.body;

    // Validate the prompt
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Invalid request format. Prompt should be a non-empty string.",
      });
    }

    // Generate the initial OpenAI completion (expecting weather-related content)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      functions: [
        {
          name: "get_current_temperature",
          description: "Get the current temperature for a specific location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g., San Francisco, CA",
              },
              unit: {
                type: "string",
                enum: ["Celsius", "Fahrenheit"],
                description: "The temperature unit to use.",
              },
            },
            required: ["location"],
          },
        },
      ],
      max_tokens: 200,
      temperature: 0,
    });

    // Check if OpenAI made a function call
    const functionCall = completion?.choices?.[0]?.message?.function_call;

    if (!functionCall || functionCall.name !== "get_current_temperature") {
      return res
        .status(400)
        .json({ error: "No valid function call was made." });
    }

    const { location } = JSON.parse(functionCall.arguments);

    // Fetch the weather data
    const weatherData = await fetchWeatherData(location);

    // Create the weather response object
    const weatherResult = {
      location: weatherData.name,
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      unit: "Celsius", // OpenWeather returns data in Celsius
    };

    // Generate a natural language response from OpenAI using the weather data
    const finalCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt },
        // {
        //   role: "assistant",
        //   content: null,
        //   function_call: {
        //     name: "get_current_temperature",
        //     arguments: location,
        //   },
        //   refusal: null,
        // },
        {
          role: "function",
          name: "get_current_temperature",
          content: JSON.stringify(weatherResult),
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Send the final response back to the client
    return res.status(200).json({
      request1: completion,
      request2: weatherResult,
      request3: finalCompletion,
    });
  } catch (error) {
    handleError(error, res);
  }
}

// Helper function to fetch weather data from OpenWeather API
async function fetchWeatherData(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    location
  )}&appid=${WEATHER_API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}

// Helper function to handle errors
function handleError(error, res) {
  if (error.response) {
    return res.status(error.response.status).json(error.response.data);
  } else {
    return res
      .status(500)
      .json({ error: { message: "An internal error occurred." } });
  }
}
