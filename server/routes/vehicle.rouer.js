const router = require('express').Router();
const { vehicleCreationValidation } = require('../utils/validation');
const vehicle = require("../controller/vehicle.controller");
const validateMiddleware = require('../middleware/validation.middleware');

router.post('/create',vehicleCreationValidation, validateMiddleware, vehicle.createVehicle );
router.post('/list', vehicle.listVehicle);
router.put('/update/:id', vehicle.updateVehicle);
router.post('/delete/:id', vehicle.deleteVehicle);
router.post('/dropdown-list', vehicle.dropdownList);

module.exports = router;