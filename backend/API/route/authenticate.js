const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require("../middleware/checkauth")
const authenticate = require('../controllers/authenticate')
const { validate } = require('../functions/validate')
const validationResult = require('../controllers/validationResult')
const  { checkEmailExist }  = require("../middleware/checkEmailExist")
const  { verified }  = require("../middleware/verified")

router.get('/admin/login', ensureGuest, authenticate.getAdminLogin)

router.post('/admin/login', ensureGuest, authenticate.postAdminLogin)

router.get('/admin/register', ensureGuest, authenticate.getAdminSignup)

router.post('/admin/register', ensureGuest, validate('Admin-Signup'), validationResult.adminSignup, authenticate.postAdminSignup)

router.get('/doctor/login', ensureGuest, authenticate.getDoctorLogin)

router.post('/doctor/login', ensureGuest, authenticate.postDoctorLogin)

router.get('/patient/login', ensureGuest, authenticate.getPatientLogin)

router.post('/patient/login',  ensureGuest, verified, authenticate.postPatientLogin)

router.get('/patient/register',  ensureGuest, authenticate.getPatientSignup)

router.post('/patient/register',  ensureGuest, validate('Patient-Signup'), validationResult.patientSignup, authenticate.postPatientSignup)

router.get('/logout', ensureAuth, authenticate.logout)

router.get('/forget', ensureGuest, authenticate.getForget)

router.post('/forget', ensureGuest, checkEmailExist, authenticate.postForget)

router.get('/forget/:token', ensureGuest, authenticate.getResetPassword)

router.put('/forget/:token', ensureGuest, validate('Password'), authenticate.putResetPassword)

router.get('/verifyaccount', ensureGuest, authenticate.getVerifyAccountAgain)

router.put('/verifyaccount', ensureGuest, checkEmailExist, authenticate.putVerifyAccountAgain)

router.get('/verifyaccount/:token', ensureGuest, authenticate.getVerifyAccount)

module.exports = router