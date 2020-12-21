const express = require('express')
const router = express.Router()
const { ensurePatient } = require("../middleware/checkauth")
const patient = require('../controllers/patient')
const { validate } = require('../functions/validate')
const validationResult = require('../controllers/validationResult')

const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)
const {v4 : uuidv4} = require('uuid')

router.get('/dashboard', ensurePatient, patient.getPatientDashboard)

router.get('/profile', ensurePatient, patient.getPatientProfile)

router.put('/profile', ensurePatient, validate('Patient-Edit'), validationResult.patientEdit, patient.putPatientProfile)

router.get('/emailchange', ensurePatient, patient.getEmailChange )

router.put('/emailchange', ensurePatient, validate('Email'), validationResult.emailOrPasswordChange, patient.putEmailChange )

router.get('/passwordchange', ensurePatient, patient.getPasswordChange )

router.put('/passwordchange', ensurePatient, validate('Password'), validationResult.emailOrPasswordChange, patient.putPasswordChange )

router.get('/appointmentbook', ensurePatient, (req, res) =>{
    connection.query("select distinct specialization from doctor;", [], (err, rows) => {
        if(err) console.log(err);
        else{
            console.log("HERE: "+rows)
            return res.render('../views/patient/appointment', {doctors:rows})
        }
    })
})

router.post('/appointmentbook', ensurePatient, (req, res, next) => {
    if(!req.body.specialization || !req.body.message){
        req.flash("Please fill in all the details.")
        res.redirect('/patient/dashboard')    
    }
    else{
        const newID = uuidv4();
        console.log('paitent appt uuid: ' + newID)
        let query="insert into appointment (Appointment_id, message, department, Patient_id) values (?,?,?,?)"
        connection.query(query,
            [newID, req.body.message, req.body.specialization, req.user.Patient_id],
            (err, rows) =>{
                if(err){
                    req.flash('error', 'Error in appointment post')
                    console.log('Err in appt post: '+err)
                    res.redirect('/patient/dashboard')
                }
                else{
                    req.flash('success', 'Appointment posted successfully')
                    console.log("Appointment post: "+rows)
                    res.redirect('/patient/dashboard')
                }
            })
    }

})

router.get('/allappointments', ensurePatient, (req, res, next) => {
    connection.query("select * from appointment where patient_id = ? ", [req.user.Patient_id], (err, rows) => {
        if(err){
            console.log("ERR:"+err)
            res.redirect('/patient/dashboard')
        }else{
            console.log("Showing all prescriptions")
            res.render('../views/patient/oldappointments.ejs', {rows:rows})
        }
    })
})

module.exports = router