const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
   id: {type: Number, required: true},
   ResponseId: {type: Number, required: true},
   QuestionId: {type: Number, required: true},
   text: {type: String, required: true},
   createdAt: {type: String}
});

const Answer = mongoose.model("Answers", AnswerSchema);
module.exports = Answer;