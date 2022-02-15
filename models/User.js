const mongoose = require('mongoose');
const { Schema } = mongoose; // importing the schema here , or either use 'new mongoose.schema' instead of 
                             // new Schema 
const UserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true 
    },
    password : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }
  });

  const User = mongoose.model('user' , UserSchema);
//   User.createIndexes();  // Through this we can't insert duplicates
  module.exports = User;