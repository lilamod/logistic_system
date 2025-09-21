const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleName: { 
      type: String, 
      required: true 
    },
    capacity: { 
      type: Number,
       required: true
    },
    tyres: {
       type: String, 
       required: true
    },
    isDeleted :{
      type: Boolean,
      default: false
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Vehicle", vehicleSchema);