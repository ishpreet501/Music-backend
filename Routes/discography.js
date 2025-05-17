const express = require("express");
const multer = require("multer");
const { addDiscography, getallDiscography } = require("../Controller/discography.js");
const storage = require("../Middleware/multerDs.js")
; // ✅ remove `.default`

const upload = multer({ storage });

const discographyRouter = express.Router();

// This matches the frontend's field name: formData.append("songimage", image)
discographyRouter.post("/addDiscography", upload.single("songimage"), addDiscography);
discographyRouter.get("/getalldiscography",getallDiscography)
module.exports = discographyRouter;
