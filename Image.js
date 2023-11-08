const mongoose = require("mongoose");


const imageSchema = new mongoose.Schema({
  filename: String,      
  originalname: String,  
  contentType: String,   
  data: Buffer, 
});


const ImageModel = mongoose.model("images", imageSchema);
module.exports = ImageModel;