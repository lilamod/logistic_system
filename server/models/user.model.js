const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
  
var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },  
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    default: "user"
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  password: {
    type: String,
  },
  salt: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: "User",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: "User",
  }, 
}, {
  versionKey: false,
  timestamps: true
});


module.exports = mongoose.model("User", UserSchema);
