const path = require("path");
const ideasRouter = require("./routes/ideas");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
// Static folder
app.use(express.static(path.join(__dirname, "public")));
// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the RandomIdeas API" });
});
app.use("/api/ideas", ideasRouter);

app.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
