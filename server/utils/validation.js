const { body } = require("express-validator");

const vehicleCreationValidation = [
    body('vehicleName')
      .notEmpty().withMessage('vehicleName is required'),
    body('capacity') 
      .notEmpty().withMessage("capacity is required"),
    body('tyres')
      .notEmpty().withMessage('tyres is required'),
    
  ];

  const userSiginValidation = [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ];

  const userLoginValidation =[
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
    body('password')
     .notEmpty().withMessage('Password is required')
     .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ];

  const bookingCreationValidation = [
    body('vehicle')
    .notEmpty().withMessage('Vehicle is required'),
    body('fromPincode')
    .notEmpty().withMessage('FromPincode is required')
    .isLength({ min: 6, max: 6}).withMessage(' FromPincode length must be atleast 6 characters'),
    body('toPincode')
    .notEmpty().withMessage('ToPincode is required')
    .isLength({ min: 6, max: 6}).withMessage(' ToPincode must be atleast 6 character long'),
    body('startTime')
    .notEmpty().withMessage('StartTime is required')

  ]

  module.exports = {
    vehicleCreationValidation,
    userSiginValidation,
    userLoginValidation,
    bookingCreationValidation
  }

