const router = require('express').Router();
const {  bookingCreationValidation } = require('../utils/validation');
const booking = require("../controller/booking.controller");
const validateMiddleware = require('../middleware/validation.middleware');

router.post('/create',bookingCreationValidation, validateMiddleware, booking.createBooking );
router.post('/list', booking.listBooking);
router.put('/update/:id', booking.updateBooking);
router.post('/delete/:id', booking.deleteBooking);
router.post('/get/:id', booking.getBooking);

module.exports = router;