const LocalStrategy = require('passport-local').Strategy
const mysql = require('mysql2')
const configDB = require('./configDB')
const connection = mysql.createConnection(configDB.connection)
const bcrypt = require('bcrypt')
const generateUserId = require('../functions/generateuserid')
const { sendmail } = require('../functions/sendmail')
const jwt = require('jsonwebtoken')
const saltRounds = 10

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        if( user.Patient_id )
            done(null, { Patient_id: user.Patient_id })
        else if( user.Admin_id )
            done(null, { Admin_id:user.Admin_id })
        else if(user.Doctor_id )
            done(null, { Doctor_id:user.Doctor_id })
        else
            done(null, user)
    })

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        if( user.Patient_id )
        {
            connection.query("SELECT * FROM PATIENT WHERE PATIENT_ID = ?", [user.Patient_id], (err,rows) =>{
                done(null, rows[0])
            })
        }
        else if( user.Admin_id )
        {
            connection.query("SELECT * FROM HADMIN WHERE ADMIN_ID = ?", [user.Admin_id], (err,rows) =>{
                done(null, rows[0])
            })
        }
        else if(user.Doctor_id )
        {
            connection.query("SELECT * FROM DOCTOR WHERE DOCTOR_ID = ?", [user.Doctor_id], (err,rows) =>{
                done(null, rows[0])
            })
        }
        else
        {
            done(null, user)
        }
            // connection.connect()
        // console.log(user)
        // connection.query("SELECT * FROM PATIENT WHERE PATIENT_ID = ? ",[user.id], function(err, rows){
            // done(null, user)
        // })
        // connection.end()
    })
 
    // we are using named strategies since we have our custom startegies now one for login and one for signup
    // by default, if there was no name, it would just be called 'local' but now we are using custom names

    passport.use('local-signup-patient', new LocalStrategy({
        usernameField : 'email',     // by default, local strategy uses username and password, we will override with email
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done){
        let user = req.body
        // if(!user.email || !user.password || !user.fname || !user.lname || !user.contact || !user.gender || !user.dateofbirth) {
        //     return done(null, false, req.flash('error', 'Fill all required fields(* means field is required)'))
        // }

		// find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query("SELECT * FROM PATIENT WHERE EMAIL = ?",[user.email], function(err,rows){
			if(err){
                return done(err)
            }
			if(rows.length){
                return done(null, false, req.flash('error', 'That email is already taken.'))
            }else{
                generateUserId()
                .then(function(id){
                    user.Patient_id = id
                    const insertQuery = "INSERT INTO PATIENT(Patient_id, Fname, Mname, Lname, Email, Pass, Contact, Gender, DOB, Blood_group) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                    bcrypt.hash(user.password, saltRounds, function(err, hash){
                        if(err){
                            console.log(err)
                        }
                        const queryArray = [user.Patient_id, user.fname, user.mname, user.lname, user.email, hash, user.contact, user.gender, user.dateofbirth, user.bgroup]
                        connection.query(
                            insertQuery,
                            queryArray,
                            function(err,rows){
                                if(err){
                                    console.log(err)
                                }
                                const reciever = user.email
                                const subject = 'Verify Account'

                                const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY) 
                                const url = `http://localhost:5000/authenticate/verifyaccount/${token}`;
                                const message = `Please click this link to verify your account: <a href="${url}">Verify Account</a>`
                                
                                sendmail(reciever, subject, message)
                                req.flash('info', 'Signed Up successfully! Kindly Verify Email First to login. Do not forget to check spam folders')
                                return done(null, user)
                            }
                        )
                    })
                })
                .catch(err=>console.log(err))	
            }	
        })}
    ))

    passport.use('local-login-patient', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        if(!email || !password) {
            return done(null, false, req.flash('error', 'Fill all required fields(* means field is required)'))
        }

        connection.query("SELECT * FROM PATIENT WHERE EMAIL = ?",[email],function(err,rows){
            // let test = rows[0].DOB.toISOString().split('T')[0]   //working
            if(err){
                return done(err)
            }
            if(!rows.length){
                req.flash('error', 'No user found.')
                return done(null, false)
            }

            bcrypt.compare(password, rows[0].Pass, function(err, result) {
                if(err){
                    console.log(err)
                }
                if(!result){
                    req.flash('error', 'Oops! Wrong password.')
                    return done(null, false)
                }
                else{
                    return done(null, rows[0] )
                }
            });	
        })}
    ))

    passport.use('local-signup-admin', new LocalStrategy({
        usernameField : 'email', // by default, local strategy uses username and password, we will override with email
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        let user = req.body
        if(!user.email || !user.password || !user.fname || !user.lname) {
            return done(null, false, req.flash('error', 'Fill all required fields(* means field is required)'))
        }

		// find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        connection.query("SELECT * FROM HADMIN WHERE EMAIL = ?",[user.email], function(err,rows){
			if(err){
                return done(err)
            }
			if(rows.length){
                req.flash('error', 'That email is already taken.')
                return done(null, false)
            }else{
                generateUserId()
                .then(function(id){
                    user.Admin_id = id 
                    const insertQuery = "INSERT INTO HADMIN(Admin_id, Fname, Mname, Lname, Email, Pass) values (?, ?, ?, ?, ?, ?)"
                    bcrypt.hash(user.password, saltRounds, function(err, hash) {
                        if(err){
                            console.log(err)
                        }
                        connection.query(
                            insertQuery,
                            [user.Admin_id, user.fname, user.mname, user.lname, user.email, hash],
                            function(err,rows){
                                if(err){
                                    console.log(err)
                                }
                                return done(null, user)
                            }
                        )
                    })	
                })
                .catch((err) => console.log(err))
            }	
        })}
    ))

    passport.use('local-login-admin', new LocalStrategy({
        usernameField : 'email', // by default, local strategy uses username and password, we will override with email
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        if(!email || !password)
        {
            return done(null, false, req.flash('error', 'Fill all required fields(* means field is required)'))
        }

        connection.query("SELECT * FROM HADMIN WHERE EMAIL = ?",[email],function(err,rows){
            if(err){
                return done(err)
            }
            if(!rows.length){ 
                req.flash('error', 'No user found.')
                return done(null, false) 
            }

            bcrypt.compare(password, rows[0].Pass, function(err, result) {
                if(err){
                    console.log(err)
                }
                if(!result){
                    req.flash('error', 'Oops! Wrong password.')
                    return done(null, false)
                }else{
                    return done(null, rows[0] )
                }
            });	
        })}
    ))

    passport.use('local-login-doctor', new LocalStrategy({
        usernameField : 'email', // by default, local strategy uses username and password, we will override with email
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        if(!email || !password) {
            return done(null, false, req.flash('error', 'Fill all required fields(* means field is required)'))
        }

        connection.query("SELECT * FROM DOCTOR WHERE EMAIL = ?",[email],function(err,rows){
            if(err){
                return done(err)
            }
            if(!rows.length){ 
                req.flash('error', 'No doctor found.')
                return done(null, false)
            }

            bcrypt.compare(password, rows[0].Pass, function(err, result) {
                if(err){
                    console.log(err)
                }
                if(!result){
                    req.flash('error', 'Oops! Wrong password.')
                    return done(null, false)
                }else{
                    return done(null, rows[0] )
                }
            });	
        })}
    ))
}