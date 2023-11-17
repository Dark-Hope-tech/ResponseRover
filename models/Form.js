const mongoose = require("mongoose");
const Question = require("./Question");

const FormSchema = new mongoose.Schema({
   id: {type: Number, required: true},
   questions: [{
    id: { type: Number, required: true },
    text: { type: String, required: true },
  }],
   description: {type: String, required: true},
   title:{type: String, required:true},
   createdAt: {type: String}
});

const Form = mongoose.model("Form", FormSchema);
module.exports = Form;