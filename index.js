// import { run } from './services/Database.js';
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = express.Router();
const port = 8000;
const uri="mongodb+srv://iit2020180:Tabish1382000@cluster0.rhesiqc.mongodb.net/?retryWrites=true&w=majority"
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:8000"],
    credentials: true
}));

const db=mongoose.connect(uri).then(() => {console.log("DB Connected");});
app.use("/form",require("./routers/formRouter"));
app.listen(port, () => console.log('Server started on port:'+ port));
