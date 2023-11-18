const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    formTitle :{type: String, required: true},
    phoneNumber :{type: String, require :true},
    answers: [{
        questionId: { type: Number, required: true },
        text: { type: String, required: true },
    }],
    createdAt: {type: String, required : true},
});
const Response = mongoose.model("Response", ResponseSchema);
module.exports = Response;