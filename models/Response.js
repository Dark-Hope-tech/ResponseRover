const mongoose = require("mongoose");

const ResponseSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    formId: {type: Number, required : true},
    createdAt: {type: String, required : true},
});
const Response = mongoose.model("Response", ResponseSchema);
module.exports = Response;