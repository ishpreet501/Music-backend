const express = require("express");
const contactRouter = express.Router();
const { sendContactEmail } = require("../Controller/contact");

contactRouter.post("/contact", sendContactEmail);

module.exports = contactRouter;
