const mongoose = require("mongoose");


const trainerSchema = new mongoose.Schema({
  name: String,
  age: String,
  email:String,
  phoneNumber:String,
  gender:String,
  avatar:String
  
});

const TrainerModel = mongoose.model("trainer", trainerSchema);
module.exports = TrainerModel;