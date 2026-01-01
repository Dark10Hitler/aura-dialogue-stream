interface Message {
  role: "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";

const SYSTEM_PROMPT = `You are a World-Class Analytical Strategist.

- DO NOT use robotic headers like 'CRITICAL ANALYSIS' or 'ANALOGY'.
- Write in a natural, fluid, and professional style.
- Use 'First Principles Thinking' to break down concepts to their core truths.
- Explain complex ideas through simple, elegant metaphors integrated directly into your sentences.
- Use **bold text** for key insights and bullet points for technical data.
- Maintain an expert-level, slightly futuristic, and calm tone.`;

export async function sendMessage(messages: Message[]): Promise<string> {
  const messagesWithSystem = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "HTTP-Referer": "https://lovable.dev",
      "X-Title": "AuraChat Pro",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: messagesWithSystem,
      temperature: 0.7,
    }),
  });

  console.log("OpenRouter Response:", response);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.log("OpenRouter Error Data:", errorData);
    throw new Error(
      errorData.error?.message || `API request failed with status ${response.status}`
    );
  }

  const data: OpenRouterResponse = await response.json();
  console.log("OpenRouter Data:", data);

  if (data.error) {
    throw new Error(data.error.message);
  }

  if (!data.choices?.[0]?.message?.content) {
    throw new Error("No response content received from AI");
  }

  return data.choices[0].message.content;
}

export type { Message };
