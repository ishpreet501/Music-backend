const mongoose = require("mongoose")

const songsSchema = new mongoose.Schema({
    songTitle :{type : String},
    songlabel : {
        type : String
    },
    songTrack :{
        type : String
    }
    })
    const songsModel = mongoose.model("songsDetails",songsSchema);
    module.exports = songsModel