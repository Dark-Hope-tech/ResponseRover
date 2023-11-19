const express =  require("express");

const rules = {
    'checkLimitOfColumn': function(form,answers) {
        if(!form.limit) return false;
        const threshold =  form.limit;
        const actualValue = answers[0];
        if(actualValue > threshold)
            return false;
        return true;
    },
    'checkCoumnsLessThanOrEqualTo': function(form,answers) {
        console.log("Call Hua");
        console.log(answers);
        column1 = answers[0].text;
        column2 = answers[1].text;
        console.log("here it is" + column1<=column2);
        if(column1 <= column2) 
            return true;
        return false;
    },
    // Add more rules as needed
};

module.exports = rules;