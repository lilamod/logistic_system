const Booking = require("../models/booking.model");
const Vehicle = require("../models/vehicle.model");
const Distance = require('pincode-distance-calculator');

const createBooking = async (req, res, next) => {
  try {
    const { vehicle, fromPincode, toPincode, startTime, customerId } = req.body;

    const vehicleDetails = await Vehicle.findOne({ _id: vehicle, isDeleted: false });
    if (!vehicleDetails) {
      return res.status(404).json({ message: "Vehicle ID does not exist" });
    }

    const fromPinNum = parseInt(fromPincode);
    const toPinNum = parseInt(toPincode);
    if (isNaN(fromPinNum) || isNaN(toPinNum)) {
      return res.status(400).json({ message: "Invalid pincodes provided" });
    }
    const estimatedRideDurationHours = Math.abs(toPinNum - fromPinNum) % 24;

    const startDateTime = new Date(startTime);
    if (isNaN(startDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid startTime format" });
    }
    const bookingEndTime = new Date(startDateTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    const conflictingBooking = await Booking.findOne({
      vehicleId: vehicleId,
      isDeleted: false,
      $or: [
        {
          startTime: { $lt: bookingEndTime },
          bookingEndTime: { $gt: startDateTime }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({ message: "Vehicle is already booked for the specified time slot" });
    }

    const newBooking = new Booking({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: startDateTime,
      bookingEndTime,
      customerId,
      estimatedRideDurationHours,
      isDeleted: false
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json(savedBooking);

  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const listBooking = async (req, res, next) => {
    const list = await Booking.find({isDeleted: false }).populate([
      { path: "vehicle", select: "vehicleName" }
    ]).exec();
    const count = await Vehicle.countDocuments();
    if (count > 0) {
        return res.status(200).json({
            list: list || [],
            count: count || 0
        });
    } else {
        return res.status(200).json({
            list:  [],
            count: 0
        });
    }

};

const updateBooking = async (req, res, next) => {
    const bookingDetails = await Booking.findOne({_id:req.params.id, isDeleted: false});
    if (bookingDetails) {
        await Booking.updateOne({_id: req.params.id}, req.body)
        .then(() => {
            return res.status(200).json({ message : "Booking details successfully updated"})
        })
        .catch(err => {
            return res.status(400).json({ message: err.message})
        })
    } else {
        return res.status(400).json({ message: "Booking details does not found"})
    }
 };

 const deleteBooking = async (req, res, next) => {
    const bookingDetails = await Booking.findOne({_id:req.params.id, isDeleted: false});
    if (bookingDetails) {
        await Booking.updateOne({_id: req.params.id}, {isDeleted: true})
        .then(() => {
            return res.status(200).json({ message : "Booking details has been deleted successfully"})
        })
        .catch(err => {
            return res.status(400).json({ message: err.message})
        })
    } else {
        return res.status(400).json({ message: "Booking details does not found"})
    }
 };

 const getBooking = async (req, res, next) => {
    const bookingDetails = await Booking.findOne({_id:req.params.id, isDeleted: false});
    if (bookingDetails) {
        return res.status(200).json({item: bookingDetails})
    } else {
        return res.status(400).json({ message: "Booking details does not found"})
    }
 }
 async function calculatePincodeDistance(pincode1, pincode2) {
    try {
        let distance = await Distance.getDistance(pincode1, pincode2);
        console.log(`The distance between ${pincode1} and ${pincode2} is: ${distance} km`);
        return distance;
    } catch (error) {
        console.error("Error calculating distance:", error);
        throw error;
    }
}



module.exports = {
    createBooking,
    listBooking,
    updateBooking,
    deleteBooking,
    getBooking
}