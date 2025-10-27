require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");
const registerChatHandlers = require("./socket/chatHandlers");
const { removeUser, addUser } = require("./socket/socketState");
const corsOptions = {
  origin: "http://localhost:3000", // الـ frontend بتاعك هيشتغل على بورت 3000
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/chat.routes"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("authenticate", async (token) => {
    if (!token) {
      return socket.emit("auth_failure", { message: "No token provided" });
    }
    try {
      const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;

      const decodedToken = jwt.verify(actualToken, process.env.JWT_SECRET);

      socket.userId = decodedToken.id;
      socket.username = decodedToken.name || "User";

      addUser(socket, socket.userId, socket.username);
      socket.emit("auth_success", {
        userId: socket.userId,
        username: socket.username,
      });
    } catch (error) {
      console.error("Socket Authentication Error:", error.message);
      socket.emit("auth_failure", { message: "Invalid token" });
      socket.disconnect();
    }
  });
  registerChatHandlers(io, socket);
  socket.on("disconnect", () => {
    removeUser(socket);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port} and Socket.IO is ready.`);
});
