const mongoose = require("mongoose")

const discographySchema = new mongoose.Schema({
    songTitle :{type : String},
   
    songimage:{
        type : String
    }
    })
    const discographyModel = mongoose.model("discographyDetails",discographySchema);
    module.exports = discographyModel