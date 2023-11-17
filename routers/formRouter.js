const express = require("express");
const formRouter = new express.Router();
const formController = require("../controllers/FormController");

authRouter.post("/login", authController.login);

authRouter.post("/signup", authController.signup);

module.exports = authRouter;