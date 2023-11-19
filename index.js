const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const router = express.Router();
const port = 8000;
const uri=process.env.MDB_CONNECT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:8000"],
    credentials: true
}));

async function connect(){
    await mongoose.connect(uri).then(() => {console.log("DB Connected");});
} 
connect();
app.use("/form",require("./controllers/FormController"));
app.use("/response",require("./controllers/ResponseController"));
app.listen(port, () => console.log('Server started on port:'+ port));
