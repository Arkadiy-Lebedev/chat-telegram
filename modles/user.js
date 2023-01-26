const mongoose = require("mongoose");

// Создаем схему
const userSchema = new mongoose.Schema({
   name: {
    type: String,
    trim: true,
    require: true,
    unique: true
  },
  password: {
    type: String,
      trim: true,
      require: true
  } 
});

const User = mongoose.model("User", userSchema);

module.exports = User;