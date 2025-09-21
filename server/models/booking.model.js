const mongoose = require("mongoose");

const bookingSchema= new mongoose.Schema(
    {
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: "Vehicle"
        },
        fromPincode: {
            type:String,
            require: true
        },
        toPincode: {
            type: String,
            require: true,
        },
        startTime: {
            type: Date,
            default: Date.now
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        customerId:{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: "User"
        }
    },    
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.model('Booking', bookingSchema)