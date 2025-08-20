import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./utils/database";
import docs from "./docs/route";
import cors from "cors";

dotenv.config();

async function init() {
  try {
    const result = await db();
    console.log("Database status:", result);
    
    const app = express();
    const { PORT } = process.env;

    app.use(cors());
    app.use(bodyParser.json());

    app.use("/api", router);
    app.get("/", (req, res) => {
      res.json({
        status: "OK 🚀",
        message: "Welcome to Zyvent API",
        version: "v1",
        serverTime: new Date().toISOString(),
      });
    });
    docs(app);

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.log("Failed to initialize application", error);
  }
}

init();
