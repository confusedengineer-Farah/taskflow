import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";

const app = express();
app.use(cors( { origin: env.clientUrl }));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (_req,res) => {
    res.send("Taskflow API is running");
})

app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`)
})