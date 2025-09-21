const Vehicle = require("../models/vehicle.model");
const Booking = require("../models/booking.model");

// Helper: Calculate estimatedRideDurationHours (simplified)
function calculateEstimatedRideDurationHours(fromPincode, toPincode) {
  const fromPinNum = parseInt(fromPincode);
  const toPinNum = parseInt(toPincode);
  if (isNaN(fromPinNum) || isNaN(toPinNum)) return null;
  return Math.abs(toPinNum - fromPinNum) % 24;
}

const createVehicle = async (req, res, next) => {
  try {
    const { vehicleName, capacityKg, tyres } = req.body;

   

    const duplicate = await Vehicle.findOne({ vehicleName });
    if (duplicate) {
      return res.status(400).json({ message: "Vehicle name already exists" });
    }

    // Create vehicle
    const newVehicle = await Vehicle.create({ vehicleName, capacityKg, tyres, isDeleted: false });
    return res.status(201).json(newVehicle);
  } catch (err) {
    console.error("Error creating vehicle:", err);
    return res.status(500).json({ message: err.message });
  }
};

const listAvailableVehicles = async (req, res, next) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (
      !capacityRequired ||
      isNaN(parseInt(capacityRequired)) ||
      !fromPincode ||
      !toPincode ||
      !startTime
    ) {
      return res.status(400).json({ message: "Missing or invalid query parameters" });
    }

    const capacityNum = parseInt(capacityRequired);
    const estimatedRideDurationHours = calculateEstimatedRideDurationHours(fromPincode, toPincode);
    if (estimatedRideDurationHours === null) {
      return res.status(400).json({ message: "Invalid pincodes" });
    }

    const startDateTime = new Date(startTime);
    if (isNaN(startDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid startTime format" });
    }

    const endDateTime = new Date(startDateTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityNum }, isDeleted: false });

    const availableVehicles = [];
    for (const vehicle of vehicles) {
      const conflict = await Booking.findOne({
        vehicleId: vehicle._id,
        isDeleted: false,
        $or: [
          {
            startTime: { $lt: endDateTime },
            bookingEndTime: { $gt: startDateTime }
          }
        ]
      });

      if (!conflict) {
        availableVehicles.push(vehicle);
      }
    }

    return res.status(200).json({
      estimatedRideDurationHours,
      vehicles: availableVehicles
    });
  } catch (err) {
    console.error("Error listing available vehicles:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


const listVehicle = async (req, res, next) => {
  try {
    const list = await Vehicle.find({ isDeleted: false });
    const count = await Vehicle.countDocuments({ isDeleted: false });

    return res.status(200).json({
      list,
      count
    });
  } catch (error) {
    console.error("Error listing Vehicles:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicleExist = await Vehicle.findById(req.params.id);
    if (!vehicleExist || vehicleExist.isDeleted) {
      return res.status(400).json({ message: "Vehicle is not found" });
    }

    await Vehicle.updateOne({ _id: req.params.id }, req.body);
    return res.status(200).json({ message: "Vehicle updated successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const vehicleExist = await Vehicle.findById(req.params.id);
    if (!vehicleExist || vehicleExist.isDeleted) {
      return res.status(400).json({ message: "Vehicle is not found" });
    }

    await Vehicle.updateOne({ _id: req.params.id }, { isDeleted: true });
    return res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const dropdownList = async (req, res, next) => {
  try {
    const data = await Vehicle.find({ isDeleted: false }).select("vehicleName");
    return res.status(200).json({ list: data });
  } catch (err) {
    return res.status(200).json({ list: [] });
  }
};

module.exports = {
  createVehicle,
  listAvailableVehicles,
  listVehicle,
  updateVehicle,
  deleteVehicle,
  dropdownList
};
