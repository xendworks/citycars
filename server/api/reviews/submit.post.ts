import { getDb } from '~/server/utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { bookingId, review } = body;

  if (!bookingId || !review) {
    throw createError({ statusCode: 400, statusMessage: 'Missing bookingId or review text' });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    throw createError({ statusCode: 500, statusMessage: 'AI API Key is missing' });
  }

  const systemInstructions = `You are a sentiment analyzer for a taxi service. 
You will be given a ride review by a customer.
Analyze the review for sentiment, safety concerns, and quality.
Output STRICTLY JSON with these keys: 
"sentiment" (string: "positive", "neutral", "negative"), 
"score" (number: 1-10 where 1 is worst, 10 is best), 
"flagForReview" (boolean: true if there are serious safety, cleanliness, or severe professional concerns, false otherwise).`;

  try {
    let resultJson = "";

    if (geminiKey) {
      const response: any = await $fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        body: {
          system_instruction: { parts: [{ text: systemInstructions }] },
          contents: [{ parts: [{ text: review }] }],
          generationConfig: { responseMimeType: "application/json" }
        }
      });
      resultJson = response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    } 
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
             { role: 'system', content: systemInstructions },
             { role: 'user', content: review }
           ],
           response_format: { type: "json_object" }
        }
      });
      resultJson = response.choices?.[0]?.message?.content || '{}';
    }

    const aiData = JSON.parse(resultJson);

    // Save to Firestore
    const db = getDb();
    await db.collection('reviews').add({
      bookingId,
      text: review,
      sentiment: aiData.sentiment || 'neutral',
      score: aiData.score || 5,
      flagged: aiData.flagForReview || false,
      createdAt: new Date().toISOString()
    });

    if (aiData.flagForReview) {
      // In a real app, this might send an email, trigger a Slack webhook, etc.
      console.warn(`\n\n🚨 HIGH PRIORITY ALERT: Booking ${bookingId} flagged for review! Sentiment: ${aiData.sentiment}. Review: "${review}"\n\n`);
    }

    return { 
      success: true, 
      message: aiData.flagForReview 
        ? "Thank you for your feedback. We have alerted our safety team to review this immediately."
        : "Thank you! Your review has been submitted."
    };

  } catch (err: any) {
    console.error("Review Submit Error:", err);
    throw createError({ statusCode: 500, statusMessage: err.message || 'Failed to submit review' });
  }
});
