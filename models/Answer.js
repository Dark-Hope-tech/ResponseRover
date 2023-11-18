const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
   questionId: {type: Number, required: true},
   text: {type: String, required: true},
   createdAt: {type: String}
});

function answerModel(questionId, text) {
    return new Answer({questionId, text });
}
const Answer = mongoose.model("Answers", AnswerSchema);
module.exports = {
    Answer,
    answerModel
}