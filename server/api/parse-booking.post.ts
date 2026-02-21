export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { prompt } = body;

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    throw createError({ statusCode: 500, statusMessage: 'AI API Key is missing in environment variables (.env)' });
  }

  const currentDate = new Date().toISOString();

  const systemPrompt = `You are a helpful AI assistant for a taxi booking company called 'City Cars'.
Your job is to extract booking information from user text and return it strictly as a JSON object.
Use the current date and time as a reference point for any relative times (like 'tomorrow', 'next week').
Current Date/Time (ISO): ${currentDate}

Rules:
1. Return ONLY raw JSON. Do not wrap it in markdown blockquotes like \`\`\`json.
2. If a piece of information is missing and cannot be guessed, set it to null.
3. If they say "tomorrow at 3pm", calculate the correct ISO timestamp and put it in pickupDateTime in the format "YYYY-MM-DDThh:mm".
4. If passengers are not specified but they ask for a ride, default passengers to 1.
5. If luggage is not specified, default to 0.

Required JSON Structure:
{
  "from": string | null, // The pickup location, use best guess to spell out fully
  "to": string | null, // The dropoff location, use best guess to spell out fully
  "passengers": number | null, // Total passengers
  "luggage": number | null, // Total luggage items
  "pickupDateTime": string | null // string in format "YYYY-MM-DDThh:mm" based on the user's request
}`;

  try {
    let resultJson = "";

    // Prefer Gemini if available
    if (geminiKey) {
      const response: any = await $fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        body: {
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        }
      });
      resultJson = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    } 
    // Fallback to OpenAI
    else if (openaiKey) {
      const response: any = await $fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        }
      });
      resultJson = response.choices?.[0]?.message?.content || '{}';
    }

    const data = JSON.parse(resultJson);
    return data;

  } catch (error: any) {
    console.error("AI Parsing Error:", error);
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to parse booking data from AI' });
  }
});
