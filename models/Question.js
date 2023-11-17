const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    text: {type: String, required: true}
});
function QuestionModel(id, text) {
    return new Question({ id, text });
}
const Question = mongoose.model("Question", QuestionSchema);
module.exports = {
    Question,
    QuestionModel 
};
