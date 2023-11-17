const router =  require("express").Router();
const jwt = require("jsonwebtoken");
const app = require('../index');
const {Question,QuestionModel} = require("../models/Question");
const Answer = require("../models/Answer");
const Form  = require("../models/Form");
const Response = require("../models/Response");

function getCurrentDateInNumberFormat() {
    const currentDate = new Date();
    console.log(currentDate.getMonth());
    const formattedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = currentDate.getDate().toString().padStart(2, '0');
    const formattedYear = currentDate.getFullYear().toString().slice(-2); // Get the last two digits
    const formattedHour = (currentDate.getHours() % 12 || 12).toString().padStart(2, '0');
    const formattedMinute = currentDate.getMinutes().toString().padStart(2, '0');
    const period = currentDate.getHours() < 12 ? 'A.M.' : 'P.M.';
    const result = parseInt(`${formattedDay}${formattedMonth}${formattedYear}${formattedHour}${formattedMinute}`, 10);
    return result;
}
router.post("/AddFromResponse",async (req,res) =>{
    try {
        const{email,questions,text} = req.body;
        if(!email ||!questions || !text){
            if(!email) console.log("email");
            return res
                .status(400)
                .json({errorMessage: "Please enter all details"});
        }
        const date = new Date();
        // const QuestionArray =  questions.map(q => Question.QuestionModel(q.id,q.text));
        // const QuestionArray = questions.map((q) => {
        //     const questionText =  q.text;
        //     return new QuestionModel(questionId,questionText);
        // });
        // console.log(QuestionArray);
        const NewForm = new Form({
            id: getCurrentDateInNumberFormat(),
            email: email,
            questions: questions.map((questionData) => {
                // Create Question instances for each question
                const questionInstance = QuestionModel(
                  questionData.id,
                  questionData.text
                );
                return questionInstance;
              }),
            text:text,
            createdAt: date.toDateString()
        });
        
        await NewForm.save();
        res.send(true);
        console.log("done");
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;