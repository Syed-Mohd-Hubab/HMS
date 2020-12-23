const express = require('express')
const router = express.Router()
const { ensureDoctor } = require("../middleware/checkauth")
const doctor = require('../controllers/doctor')
const { validate } = require('../functions/validate')
const validationResult = require('../controllers/validationResult')

router.get('/dashboard', ensureDoctor, doctor.getDoctorDashboard)

router.get('/profile', ensureDoctor, doctor.getDoctorProfile)

router.put('/profile', ensureDoctor, validate('Doctor-Edit'), validationResult.doctorEdit, doctor.putDoctorProfile)

router.get('/emailchange', ensureDoctor, doctor.getEmailChange )

router.put('/emailchange', ensureDoctor, validate('Email'), validationResult.emailOrPasswordChange, doctor.putEmailChange )

router.get('/passwordchange', ensureDoctor, doctor.getPasswordChange )

router.put('/passwordchange', ensureDoctor, validate('Password'), validationResult.emailOrPasswordChange, doctor.putPasswordChange )

module.exports = router