export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, history } = body;

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    throw createError({ statusCode: 500, statusMessage: 'AI API Key is missing in environment variables (.env)' });
  }

  const systemInstructions = `You are a highly capable AI customer support agent for 'City Cars', a premium taxi service.
You act as a 24/7 concierge.
Your capabilities (simulated in this environment):
- Actively modifying bookings (tell the user you have modified it if they ask).
- Answer questions about driver locations.
- Handle lost-item reports.
- If a user asks about heavy traffic, suggest alternative routing (e.g. dropping them near a fast train station) or adjusting their pickup time to ensure they don't miss a flight.
- Be extremely polite, concise, and helpful.

Keep your answers short and conversational. Do not output raw JSON, just speak naturally to the customer.
  `;

  try {
    let reply = "I'm sorry, I cannot process your request right now.";

    if (geminiKey) {
      // Format history for Gemini
      const contents = history.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response: any = await $fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        body: {
          system_instruction: { parts: [{ text: systemInstructions }] },
          contents: contents
        }
      });
      reply = response.candidates?.[0]?.content?.parts?.[0]?.text || "I didn't quite catch that.";
    } 
    else if (openaiKey) {
      const messages = [
        { role: 'system', content: systemInstructions },
        ...history,
        { role: 'user', content: message }
      ];

      const response: any = await $fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: {
          model: "gpt-4o-mini",
          messages: messages
        }
      });
      reply = response.choices?.[0]?.message?.content || "I didn't quite catch that.";
    }

    return { reply };

  } catch (error: any) {
    console.error("AI Chat Error:", error);
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to connect to AI server' });
  }
});
