import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookieparser());

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], // Specify which headers can be sent
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};
app.use(cors({ origin: true, credentials: true }));
// app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello from Memory card game!");
});

import userRouter from "./routes/user.routes.js";
import gameRouter from "./routes/game.routes.js";
app.use("/game", gameRouter);
app.use("/user", userRouter);

export default app;
