import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/Db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database before starting the server
await connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running..."));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
