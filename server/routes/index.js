const express = require("express")
const router = express.Router();

router.use("/auth", require("./auth.router"));
router.use("/vehicle", require("./vehicle.rouer"));
router.use("/booking", require("./booking.router"));

module.exports= router;