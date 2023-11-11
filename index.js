import connection from "./config/connection.js";

import dotenv from "dotenv";
import express from "express";
import vehicleRoutes from "./routes/vehicleRoutes.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", vehicleRoutes);

connection();

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server is running on ${process.env.SERVER_PORT}`);
});
