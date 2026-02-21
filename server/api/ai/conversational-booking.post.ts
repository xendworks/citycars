import { collections } from '~/server/utils/db';
import { Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, history, sessionId } = body;

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    throw createError({ statusCode: 500, statusMessage: 'AI API Key is missing in environment variables (.env)' });
  }

  const currentDate = new Date().toISOString();

  const systemInstructions = `You are an intelligent voice assistant for 'City Cars' taxi booking.
Your job is to have a natural conversation, gather booking details, and finalize the booking.

The booking process has two phases:

PHASE 1: Gather Journey Details
The required fields are:
1. Pickup Location
2. Drop-off Location
3. Date and Time (Current reference time: \${currentDate})
4. Passengers (ask if you don't know)
5. Luggage (ask if you don't know)

Once you have gathered ALL 5 details, DO NOT ask which cab type they want. Instead, you MUST automatically suggest the most comfortable Cab Type based on their passengers and luggage.
Guidelines:
- Saloon (up to 4 pax, 2 medium luggage): E.g., Toyota Prius, Skoda Octavia.
- Estate (up to 4 pax, 4 luggage): E.g., Skoda Superb Estate, VW Passat Estate.
- MPV (up to 6 pax, 4 luggage): E.g., VW Touran, Ford Galaxy.
- 7 Seater (up to 7 pax, 5 luggage): E.g., Mercedes V-Class, Ford Tourneo.
- 9 Seater (up to 9 pax, 6 luggage): Large minibus.
- Wheelchair (if requested specifically): Up to 4 pax, 2 luggage.

Tell them you are getting quotes for these requirements.
When you are ready to show them prices, append exactly this block at the very end of your message to trigger a Quote Result Card inside the chat:
___SHOW_QUOTES___
{
  "from": "Pickup address",
  "to": "Dropoff address",
  "pickupDateTime": "YYYY-MM-DDThh:mm",
  "passengers": 1,
  "luggage": 0,
  "suggestedVehicleType": "suggested type"
}
CRITICAL INSTRUCTION: You MUST ONLY output the ___SHOW_QUOTES___ block EXACTLY ONCE. Never repeat it in subsequent messages.

PHASE 2: Let the User choose a Cab
Once you have shown them the quotes using ___SHOW_QUOTES___, wait for them to reply with which vehicle they'd like to book (e.g., "I'll take the Estate", "Saloon").
Acknowledge their choice and IMMEDIATELY move to Phase 3. DO NOT output the quotes block again.

PHASE 3: Gather Booking Preferences
After getting their cab agreement, you MUST now gather their final booking preferences to complete the booking.
Ask them questions (one at a time) to determine:
- Flight details (if either location is an airport)
- Meet & Greet service (yes/no, £10)
- Child Seat (yes/no, £5)
- Promo code (if they have an offer)
- Payment Method (Cash, Card, or Paypal)

PHASE 4: Final Confirmation & Booking
Once you have ALL journey details, the agreed cab type, AND all booking preferences, summarize everything for them and ask for their final confirmation to book.
When they confirm, acknowledge it, tell them they are booked and you will redirect them to their success page! Ask "Is there anything else I can help you with?".
Append exactly this block at the very end of your final message:
___CONFIRM_BOOKING___
{
  "vehicleType": "estate",
  "paymentMethod": "card",
  "meetAndGreet": true,
  "childSeat": false,
  "promoCode": "DISCOUNT10",
  "flightNumber": "BA123"
}

Rules:
1. Be concise, polite, and conversational.
2. Ask for ONLY ONE missing piece of information at a time.
3. NEVER repeat the ___SHOW_QUOTES___ payload block more than once in the entire conversation! If the user gives you a response choosing their vehicle, instantly proceed to gathering Flight Details / Meet & Greet preferences.

IMPORTANT GEOGRAPHY RULES:
- You are strictly operating a taxi service in the UNITED KINGDOM (UK).
- Assume all locations, addresses, airports, and towns are in the UK.
- The user is talking to you via Voice-to-Text. Due to accents, the text may contain phonetic misspellings of UK towns (e.g., "Rampot", "Ramford" -> Romford; "Brighten" -> Brighton; "Gatwick" might be misspelled).
- ALWAYS intelligently autocorrect phonetic spelling mistakes to the actual correct UK town, city, or airport name before confirming the location with the user.
- Ask for clarification ONLY if the location is completely unrecognizable as a UK place.
`;

  try {
    let reply = "I'm sorry, I'm having trouble processing that.";

    if (geminiKey) {
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

    // Parse the reply to see if it contains the booking object
    let isComplete = false;
    let isShowQuotes = false;
    let isConfirmBooking = false;
    let bookingData: any = null;
    let spokenReply = reply;

    if (reply.includes('___SHOW_QUOTES___')) {
      const parts = reply.split('___SHOW_QUOTES___');
      spokenReply = parts[0].trim();
      try {
        bookingData = JSON.parse(parts[1].trim());
        isShowQuotes = true;
      } catch(e) {
        console.error("Failed to parse quote JSON from AI", parts[1]);
      }
    } else if (reply.includes('___CONFIRM_BOOKING___')) {
      const parts = reply.split('___CONFIRM_BOOKING___');
      spokenReply = parts[0].trim();
      try {
        bookingData = JSON.parse(parts[1].trim());
        isConfirmBooking = true;
      } catch(e) {
        console.error("Failed to parse confirm JSON from AI", parts[1]);
      }
    } else if (reply.includes('___BOOKING_COMPLETE___')) {
      const parts = reply.split('___BOOKING_COMPLETE___');
      spokenReply = parts[0].trim();
      try {
        bookingData = JSON.parse(parts[1].trim());
        isShowQuotes = true;
      } catch(e) {}
    }

    const sessionKey = sessionId || `session_${Date.now()}`;
    const logData = {
      sessionId: sessionKey,
      updatedAt: Timestamp.now(),
      history: [...history, { role: 'user', content: message }, { role: 'assistant', content: spokenReply }],
      bookingData,
      isComplete: isShowQuotes || isConfirmBooking
    };
    
    // Fire and forget server log
    collections.aiChatLogs().doc(sessionKey).set(logData, { merge: true })
      .catch((e: any) => console.error("Failed to save AI chat log:", e));

    return { 
      reply: spokenReply,
      isComplete: isShowQuotes || isConfirmBooking,
      isShowQuotes,
      isConfirmBooking,
      bookingData
    };

  } catch (error: any) {
    console.error("Conversational AI Error:", error);
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to connect to AI server' });
  }
});
