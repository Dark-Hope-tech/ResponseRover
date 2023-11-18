const express = require('express');
const app  = express();
const Form  = require("../models/Form");
const {google} = require('googleapis');
const {Answer,answerModel} = require("../models/Answer");
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

function getColumnLetter(columnNumber) {
    let columnLetter = '';
    while (columnNumber > 0) {
        let modulo = (columnNumber - 1) % 26;
        columnLetter = String.fromCharCode(65 + modulo) + columnLetter;
        columnNumber = Math.floor((columnNumber - modulo) / 26);
    }
    return columnLetter;
}
app.post("/addResponse",async(req,res) =>{
    try{
        const {formTitle,phoneNumber,answers} = req.body;
        if(!formTitle || !answers || !phoneNumber)
            return res
                .status(400)
                .json({errorMessage: "Please enter all details"});

        const existingForm = await Form.findOne({   title: formTitle });
        if(!existingForm)
            return res
                    .status(400)
                    .json({errorMessage :"No form with this title exist"});

        const date = new Date();
        console.log(
            answers.map((answerData) => {
                const AnswerInstance = answerModel(
                  answerData.questionId,
                  answerData.text
                );
                return AnswerInstance;
            })
        );
        const newResponse = new Response({
            id:getCurrentDateInNumberFormat(),
            formTitle : formTitle,
            phoneNumber : phoneNumber,
            answers: answers.map((answerData) => {
                const AnswerInstance = answerModel(
                  answerData.questionId,
                  answerData.text
                );
                return AnswerInstance;
            }),
            createdAt: date.toDateString()
        });

        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        const client = await auth.getClient();
        const googleSheets = google.sheets({ version: "v4", auth: client });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        const metaData = await googleSheets.spreadsheets.get({
            auth,
            spreadsheetId,
        });
        
        //Checking if there is already a sheet with same title
        const sheetExists = metaData.data.sheets.some(sheet => sheet.properties.title === formTitle);
        if (!sheetExists) {
            return res.status(400).json({ errorMessage: "Sheet with this from doesn't exist" });
        }

        const numberOfColumns = answers.length;
        const endColumnLetter = getColumnLetter(numberOfColumns);
        const range = `${formTitle}!A1:${endColumnLetter}1`;
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            valueInputOption: "USER_ENTERED",
            range: range,
            resource: {
                values: [answers.map(answers => answers.text)],
            },
        });

        await newResponse.save();
        res.send(true);
        console.log("done");
    }catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
module.exports = app;