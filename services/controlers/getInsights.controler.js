const pool = require("../config/db");
const model = require("../config/gemini");

const getInsights = async (req, res) => {
  try {
    const userId = req.userId;
    const partenerId = req.params.partenerId;
    if (!partenerId) {
      return res.status(400).json({ message: "Partner ID is required" });
    }

    const user1 = Math.min(userId, partenerId);
    const user2 = Math.max(userId, partenerId);

    const { rows: messages } = await pool.query(
      `SELECT m.text, u.name AS sender_name 
       FROM messages m
       JOIN users u ON m.sender_id = u.id 
       WHERE (m.sender_id = $1 AND m.receiver_id = $2)
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.timestamp ASC`,
      [userId, partenerId]
    );

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this chat." });
    }

    const chatTranscript = messages
      .map((msg) => `${msg.sender_name}: ${msg.text}`)
      .join("\n");

    const prompt = `
      Analyze the following chat transcript. 
      Provide a concise, one-sentence summary, the overall sentiment (Positive, Negative, or Neutral), and 3 relevant tags.
      Return your response ONLY as a valid JSON object with this exact structure: {"summary": "...", "sentiment": "...", "tags": ["...", "..."]}
      Transcript:
      ---
      ${chatTranscript}
      ---
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJsonString = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let insightData;
    try {
      insightData = JSON.parse(cleanJsonString);
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini response:",
        parseError,
        "Raw text:",
        text
      );
      return res.status(500).json({ message: "AI response format error." });
    }

    await pool.query(
      `INSERT INTO insights (user_1_id, user_2_id, summary, sentiment) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_1_id, user_2_id) DO UPDATE 
       SET summary = $3, sentiment = $4, last_updated = CURRENT_TIMESTAMP`,
      [user1, user2, insightData.summary, insightData.sentiment]
    );

    return res.status(200).json({
      success: true,
      message: "Insights generated successfully",
      data: insightData,
    });
  } catch (error) {
    console.error("Error in getInsights:", error); // 👈 اطبع الخطأ هنا
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getInsights };
