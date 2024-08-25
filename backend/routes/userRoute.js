const router = require('express').Router();
const {registration, login, updateuser, forgetPassword, resetPassword, getUser, verifyOTP, updatePassword, deleteUser} = require('../controllers/userController.js')
const upload = require('../middleware/multermiddleware.js')
const {authenticateToken, isLoggedIn, forgetPasswordAuthToken} = require('../middleware/auth.js')
const {getGoogleURL, googleCallback, verifyToken} = require('../controllers/googleController.js')

router.post('/register', upload.single('image'), registration);
router.post('/login', login);
router.put('/update-user', authenticateToken, isLoggedIn, upload.single('image'), updateuser);
router.post('/forgetpassword', forgetPassword);
router.post('/resetpassword',forgetPasswordAuthToken, resetPassword);
router.get('/record', authenticateToken, isLoggedIn, getUser);
router.post('/verify-otp', verifyOTP);
router.get('/googleurl', getGoogleURL);
// Note: If callback NOT in google credentials then app access blocked
router.get('/google/callback', googleCallback);
router.post('/verifyToken', verifyToken);
router.put('/updatepassword', authenticateToken, isLoggedIn, updatePassword);
router.delete('/delete/:id', deleteUser);

module.exports = router;