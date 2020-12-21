const passport = require('passport')

module.exports = {
    getAdminSignup: function(req, res, next){
        return res.render('../views/admin/register')
    },

    postAdminSignup: passport.authenticate('local-signup-admin', {
        successRedirect : '/admin/dashboard', // redirect to the secure profile section
        failureRedirect : 'login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),

    getAdminLogin: function(req, res, next){
        return res.render('../views/admin/login')
    },

    postAdminLogin: passport.authenticate('local-login-admin', {
        successRedirect : '/admin/dashboard', // redirect to the secure profile section
        failureRedirect : 'login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),

    //Doctor is being registered by admin so his registering controller would be in admin.js
    getDoctorLogin: function(req, res, next){
        res.render('../views/doctor/login')
    },

    postDoctorLogin: passport.authenticate('local-login-doctor', {
        successRedirect : '/doctor/dashboard', // redirect to the secure profile section
        failureRedirect : 'login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),

    getPatientSignup: function(req, res, next){
        return res.render('../views/patient/register')
    },

    postPatientSignup: passport.authenticate('local-signup-patient', {
        successRedirect : '/patient/dashboard', // redirect to the secure profile section
        failureRedirect : 'register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),

    getPatientLogin: function(req, res, next){
        return res.render('../views/patient/login')
    },

    postPatientLogin: passport.authenticate('local-login-patient', {
        successRedirect : '/patient/dashboard', // redirect to the secure profile section
        failureRedirect : 'login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),

    logout: function(req, res, next){ 
        req.logout()
        req.session.passport.user = null;
        res.redirect("/home")
    },
}