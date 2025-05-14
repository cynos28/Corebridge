import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, it's better to make API calls from the backend
});

export const processVoiceInput = async (input: string, context: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant helping to schedule meetings. Convert user's natural language input into structured meeting information."
        },
        {
          role: "user",
          content: `Context: ${context}\nUser input: ${input}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content || input;
  } catch (error) {
    console.error('Error processing voice input with OpenAI:', error);
    return input; // Fallback to original input if API fails
  }
};
