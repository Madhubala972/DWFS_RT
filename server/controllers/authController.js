const registerUser = require('./authController/registerUser');
const loginUser = require('./authController/loginUser');
const logoutUser = require('./authController/logoutUser');

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
