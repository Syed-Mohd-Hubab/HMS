const express = require('express')
const router = express.Router()
const { ensurePatient } = require("../middleware/checkauth")
const patient = require('../controllers/patient')
const { validate } = require('../functions/validate')
const validationResult = require('../controllers/validationResult')

router.get('/dashboard', ensurePatient, patient.getPatientDashboard)

router.get('/profile', ensurePatient, patient.getPatientProfile)

router.put('/profile', ensurePatient, validate('Patient-Edit'), validationResult.patientEdit, patient.putPatientProfile)

router.get('/emailchange', ensurePatient, patient.getEmailChange )

router.put('/emailchange', ensurePatient, validate('Email'), validationResult.emailOrPasswordChange, patient.putEmailChange )

router.get('/passwordchange', ensurePatient, patient.getPasswordChange )

router.put('/passwordchange', ensurePatient, validate('Password'), validationResult.emailOrPasswordChange, patient.putPasswordChange )

module.exports = router