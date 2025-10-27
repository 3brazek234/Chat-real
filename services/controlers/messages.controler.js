const pool = require("../config/db");

const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { rows } = await pool.query(
      `SELECT
         m.id,
         m.sender_id,
         u_sender.name AS sender_name, 
         m.receiver_id,
         u_receiver.name AS receiver_name, 
         m.text,
         m.timestamp
       FROM messages m
       JOIN users u_sender ON m.sender_id = u_sender.id
       LEFT JOIN users u_receiver ON m.receiver_id = u_receiver.id -- LEFT JOIN عشان receiver_id ممكن يكون NULL لو شات جماعي
       WHERE m.sender_id = $1 OR m.receiver_id = $1
       ORDER BY m.timestamp ASC`,
      [userId]
    );
    res.json({
      success: true,
      message: "Messages fetched successfully!",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const { rows } = await pool.query(
      `WITH UserChats AS (
   SELECT
     CASE
       WHEN sender_id = $1 THEN receiver_id
       WHEN receiver_id = $1 THEN sender_id
     END AS chat_partner_id,
     text,
     timestamp,
     ROW_NUMBER() OVER (PARTITION BY
       CASE
         WHEN sender_id = $1 THEN receiver_id
         WHEN receiver_id = $1 THEN sender_id
       END
       ORDER BY timestamp DESC) as rn
   FROM messages
   WHERE (sender_id = $1 OR receiver_id = $1)
     AND (sender_id != receiver_id OR receiver_id IS NULL) -- 🚨 عشان يستثني الشات مع النفس أو شات عام
 )
 SELECT
   uc.chat_partner_id AS id,
   u.name AS name,
   uc.text AS last_message_text,
   uc.timestamp AS last_message_timestamp
 FROM UserChats uc
 JOIN users u ON uc.chat_partner_id = u.id
 WHERE uc.rn = 1
   AND uc.chat_partner_id IS NOT NULL
   AND uc.chat_partner_id != $1 -- 🚨 تأكد من عدم عرض المستخدم الحالي كـ "شريك محادثة" لنفسه
 ORDER BY uc.timestamp DESC;`, // رتب المحادثات بآخر رسالة
      [currentUserId]
    );

    res.json({
      success: true,
      message: "Conversations fetched successfully!",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
module.exports = {
  getMessages,
  getConversations,
};