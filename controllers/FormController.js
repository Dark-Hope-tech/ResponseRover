const express = require('express');
const app  = express();
const {Question,QuestionModel} = require("../models/Question");
const Form  = require("../models/Form");
const {google} = require('googleapis');


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
app.post("/AddFrom",async (req,res) =>{
    try {
        // checking if incomming request in valid
        const{questions,description,title} = req.body;
        if(!questions ||!description || !title){
            return res
                .status(400)
                .json({errorMessage: "Please enter all details"});
        }

        //checking if there is already a form with same title
        const existingForm = await Form.findOne({ title: title });
        if (existingForm) {
            return res.status(400).json({ errorMessage: "A form with the same title already exists" });
        }

        // creating new Form of given date
        const date = new Date();
        const NewForm = new Form({
            id: getCurrentDateInNumberFormat(),
            questions: questions.map((questionData) => {
                // Create Question instances for each question
                const questionInstance = QuestionModel(
                  questionData.id,
                  questionData.text
                );
                return questionInstance;
              }),
            description:description,
            title:title,
            createdAt: date.toDateString()
        });

        //creating new sheet in spreedsheet for new form with title from given request
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
        const sheetExists = metaData.data.sheets.some(sheet => sheet.properties.title === title);
        if (sheetExists) {
            return res.status(400).json({ errorMessage: "A sheet with the same title already exists" });
        }
        //creating new google sheet for new form
        const response = await googleSheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: title,
                            },
                        },
                    },
                ],
            },
        });
        const numberOfColumns = questions.length;
        const endColumnLetter = getColumnLetter(numberOfColumns);
        const range = `${title}!A1:${endColumnLetter}1`;
        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            valueInputOption: "USER_ENTERED",
            range: range,
            resource: {
                values: [questions.map(question => question.text)],
            },
        });

        await NewForm.save();
        res.send(true);
        console.log("done");
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

app.get("/getForm", async (req, res) => {
    try {
        // Retrieve the title from query parameters
        const { title } = req.body;

        // Validate the input
        if (!title) {
            return res.status(400).json({ errorMessage: "Title is required" });
        }

        // Search for the form with the given title
        const form = await Form.findOne({ title: title });

        // Check if the form exists
        if (!form) {
            return res.status(404).json({ errorMessage: "Form not found" });
        }

        // Send the form as a response
        res.json(form);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = app;
