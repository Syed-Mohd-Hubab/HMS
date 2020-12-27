const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
    getPatientDashboard: function(req, res, next){
        return res.render('../views/patient/dashboard')
    },

    getPatientProfile: function(req, res, next){
        return res.render('../views/patient/profile')
    },

    putPatientProfile: function(req, res, next){
        connection.query("UPDATE PATIENT SET Fname = ?, Mname = ?, Lname = ?, DOB=?, Blood_group = ? WHERE PATIENT_ID = ?",
        [req.body.fname, req.body.mname, req.body.lname, req.body.dateofbirth, req.body.bgroup, req.user.Patient_id],
        function(error, rows, fields){
            if(error){
                console.log(error)   
            }else{
                req.flash('success', 'Successfully update profile')
                return res.redirect('/patient/profile')
            }
        })
    },

    getEmailChange: function(req, res, next){
        return res.render('../views/patient/emailchange')
    },

    putEmailChange: function(req, res, next){
        if(req.user.Email!=req.body.email){
            connection.query("SELECT EMAIL FROM PATIENT WHERE EMAIL = ?",
            [req.body.email],
            function(error, rows, field){
                if(error){
                    console.log(error)
                    return res.redirect('dashboard')
                }else if(rows.length){
                    req.flash('error', 'Email already taken')
                    return res.redirect('dashboard')
                }else{
                    connection.query("UPDATE PATIENT SET EMAIL = ? WHERE PATIENT_ID = ?",
                    [req.body.email, req.user.Patient_id],
                    function(error, rows, fields){
                        if(error){
                            console.log(error)
                            return res.redirect('dashboard')
                        }else if(rows.length){
                            req.flash('error', 'Email already taken')
                            return res.redirect('dashboard')
                        }else{
                            req.flash('success', 'Successfully update email')
                            return res.redirect('dashboard')
                        }
                    })
                }
            })
        }else{
            req.flash('info', 'Same email as old one!')
            return res.redirect('dashboard')
        }
    },

    getPasswordChange: function(req, res, next){
        return res.render('../views/patient/passwordchange')
    },

    putPasswordChange: function(req, res, next){
        connection.query("SELECT PASS FROM PATIENT WHERE PATIENT_ID = ?",
        [req.user.Patient_id],
        function(error, rows, fields){
            if(error){
                console.log(error)
                return res.redirect('dashboard')
            }else{
                bcrypt.compare(req.body.oldpassword, rows[0].PASS, function(err, result) {
                    if(err){
                        console.log(err)
                    }
                    if(!result){
                        req.flash('error', 'Wrong Old Password!')
                        return res.redirect('dashboard')
                    }else{
                        bcrypt.hash(req.body.newpassword, saltRounds, function(err, hash) {
                            connection.query("UPDATE PATIENT SET PASS = ? WHERE PATIENT_ID = ?",
                            [hash, req.user.Patient_id],
                            function(error, rows, fields){
                                if(error){
                                    console.log(error)
                                    return res.redirect('dashboard')
                                }else{
                                    req.flash('success', 'Password Changed!')
                                    return res.redirect('dashboard')
                                }
                            })
                        })
                    }
                })
            }
        })
    },
    
}