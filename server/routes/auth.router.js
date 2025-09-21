const router = require('express').Router();
const auth = require('../controller/auth.controller');
const validateMiddleware = require('../middleware/validation.middleware');
const { userSiginValidation, userLoginValidation } = require('../utils/validation');

router.post('/register', userSiginValidation,validateMiddleware, auth.register);
router.post('/login', userLoginValidation,validateMiddleware, auth.login);

module.exports = router;