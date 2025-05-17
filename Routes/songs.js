const express = require("express");
const songsrouter = express.Router();
const upload = require("../Middleware/multer");
const { addsongs,  getallsongs , deletesong  } = require("../Controller/songs");

songsrouter.post("/addsongs", upload.single("songTrack"), addsongs);
songsrouter.delete("/deletesong/:id", deletesong);
songsrouter.get("/getallsongs", getallsongs);  // ✅ This line fetches all songs

module.exports = songsrouter;
