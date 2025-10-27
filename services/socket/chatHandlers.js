// socket/chatHandlers.js
const pool = require("../config/db");
const { getSocketIdByUserId } = require("./socketState");

const registerChatHandlers = (io, socket) => {
  socket.on("request_private_messages", async (receiverId) => {
    if (!socket.userId) {
      // 👈 دلوقتي الشرط ده هيشتغل صح
      return socket.emit("auth_failure", { message: "Not authenticated" });
    }
    if (!receiverId) {
      return socket.emit("private_messages_error", {
        message: "Receiver ID is required",
      });
    }

    try {
      const { rows } = await pool.query(
        `SELECT
            m.id, m.sender_id, u_sender.name AS sender_name,
            m.receiver_id, u_receiver.name AS receiver_name,
            m.text, m.timestamp
         FROM messages m
         JOIN users u_sender ON m.sender_id = u_sender.id
         LEFT JOIN users u_receiver ON m.receiver_id = u_receiver.id
         WHERE (m.sender_id = $1 AND m.receiver_id = $2)
            OR (m.sender_id = $2 AND m.receiver_id = $1)
         ORDER BY m.timestamp ASC`,
        [socket.userId, receiverId]
      );
      socket.emit("private_messages", { success: true, data: rows });
    } catch (error) {
      console.error("Error fetching private messages:", error);
      socket.emit("private_messages_error", {
        message: "Failed to fetch messages",
      });
    }
  });

  socket.on("chat message", async (messageData) => {
    if (!socket.userId) {
      return socket.emit("chat_message_error", {
        message: "Not authenticated",
      });
    }

    const { text, receiver_id } = messageData;
    const sender_id = socket.userId;

    if (!text || !receiver_id) {
      return socket.emit("chat_message_error", {
        message: "Text and receiver_id are required",
      });
    }

    try {
      const insertResult = await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, text)
         VALUES ($1, $2, $3)
         RETURNING id, timestamp`,
        [sender_id, receiver_id, text]
      );

      const newMessageId = insertResult.rows[0].id;

      const { rows: fullMessageRows } = await pool.query(
        `SELECT
            m.id, m.sender_id, u_sender.name AS sender_name,
            m.receiver_id, u_receiver.name AS receiver_name,
            m.text, m.timestamp
         FROM messages m
         JOIN users u_sender ON m.sender_id = u_sender.id
         LEFT JOIN users u_receiver ON m.receiver_id = u_receiver.id
         WHERE m.id = $1`,
        [newMessageId]
      );

      const messageWithNames = fullMessageRows[0];

      // 4. إرسال الرسالة للطرفين (باستخدام الدالة العامة)
      const receiverSocketId = getSocketIdByUserId(receiver_id);

      if (receiverSocketId) {
        console.log(
          `Sending message to receiver ${receiver_id} at socket ${receiverSocketId}`
        );
        io.to(receiverSocketId).emit("chat message", {
          success: true,
          message: "New message received!",
          data: messageWithNames,
        });
      } else {
        console.log(`Receiver ${receiver_id} is not online.`);
      }

 
      socket.emit("chat message", {
        success: true,
        message: "Message sent!",
        data: messageWithNames,
      });
    } catch (error) {
      console.error("Error saving or emitting chat message:", error);
      socket.emit("chat_message_error", {
        message: "Failed to send message",
      });
    }
  });
};

module.exports = registerChatHandlers;
