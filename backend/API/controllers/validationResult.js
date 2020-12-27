const { validationResult } = require('express-validator')

module.exports = {
    adminSignup: function(req, res, next){
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('/authenticate/admin/register')
        }
        next()
    },

    //doctor is registered by admin so the use of this function is in 
    doctorSignup: function(req, res ,next){
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('/admin/addnewdoctor')
        }
        next()
    },

    patientSignup: function(req, res, next){
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy .log("here ")
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('/authenticate/patient/register')
        }
        next()
    },

    adminEdit: function(req, res, next){
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('/admin/profile')
        }
        next()
    },

    doctorEdit: function(req, res ,next){
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('/doctor/profile')
        }
        next()
    },

    patientEdit: function(req, res, next){
        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy .log("here ")
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('/patient/profile')
        }
        next()
    },

    adminDoctorEdit: function(req, res, next){
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('/admin/showalldoctors')
        }
        next()
    },

    emailOrPasswordChange: function(req, res, next){
        const errors = validationResult(req); 
        if(!errors.isEmpty()){
            const errlist = errors.array().map(error => error.msg)
            req.flash('error', errlist)
            return res.redirect('dashboard')
        }
        next()
    },
}