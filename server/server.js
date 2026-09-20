require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("taskFlow API is working on port ")
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Your server runnig on port "+ PORT)
})