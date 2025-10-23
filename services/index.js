require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./config/db");
const port = process.env.PORT || 3000;
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", require("./routes/auth.routes"));
app.get("/messages", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM messages");
  res.json(rows);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
