const express = require('express')
const router = express.Router()
const { ensureAdmin } = require('../middleware/checkauth')
const admin = require('../controllers/admin')
const { validate } = require('../functions/validate')
const validationResult = require('../controllers/validationResult')

router.get('/dashboard', ensureAdmin, admin.getAdminDashboard)

router.get('/profile', ensureAdmin, admin.getAdminProfile)

router.put('/profile', ensureAdmin, validate('Admin-Edit'), validationResult.adminEdit, admin.putAdminProfile)

router.get('/emailchange', ensureAdmin, admin.getEmailChange)

router.put('/emailchange', ensureAdmin, validate('Email'), validationResult.emailOrPasswordChange, admin.putEmailChange)

router.get('/passwordchange', ensureAdmin, admin.getPasswordChange)

router.put('/passwordchange', ensureAdmin, validate('Password'), validationResult.emailOrPasswordChange, admin.putPasswordChange)

router.get('/addnewdoctor', ensureAdmin, admin.getAddNewDoctor) //get doctor register page(by admin)

router.post('/addnewdoctor', ensureAdmin, validate('Doctor-Signup'), validationResult.doctorSignup, admin.postAddNewDoctor) // this is doctor registeration by admin

router.get('/showalldoctors', ensureAdmin, admin.getShowAllDoctors)

router.get('/editdoctor/:id', ensureAdmin, admin.getEditDoctor)

router.put('/editdoctor/:id', ensureAdmin, validate('Admin-DoctorEdit'), validationResult.adminDoctorEdit, admin.putEditDoctor)

router.get('/deletedoctor/:id', ensureAdmin, admin.getDeleteDoctor)

module.exports = router