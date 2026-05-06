const path = require("path");
// Load environment variables 
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./configs/swagger");

const db = require("./configs/db");
const apiRoutes = require("./routes");

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_API_KEY = process.env.SERVER_API_KEY;

if (!SERVER_PORT) {
  console.error("SERVER_PORT is not defined — aborting.");
  process.exit(1);
}
if (!SERVER_API_KEY) {
  console.error("SERVER_API_KEY is not defined — aborting.");
  process.exit(1);
}

console.log("──────────────────────────────────────────");
console.log(" Environment Check");
console.log(`├─ NODE_ENV : ${process.env.NODE_ENV}`);
console.log(`├─ PORT     : ${SERVER_PORT}`);
console.log(`└─ API_KEY  : ${SERVER_API_KEY.slice(0, 6)}*****`);
console.log("──────────────────────────────────────────");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/api", apiRoutes);
app.use("/v1/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const start = async () => {
  try {
    await db.connect();

    app.listen(SERVER_PORT, () => {
      console.log("──────────────────────────────────────────");
      console.log(`Server running on http://localhost:${SERVER_PORT}`);
      console.log(`Docs   → http://localhost:${SERVER_PORT}/v1/api/docs`);
      console.log(`Health → http://localhost:${SERVER_PORT}/v1/api/health`);
      console.log("──────────────────────────────────────────");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
