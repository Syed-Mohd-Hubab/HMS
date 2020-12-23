const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
    getDoctorDashboard: function(req, res, next){
        return res.render('../views/doctor/dashboard')
    },

    getDoctorProfile: function(req, res, next){
        connection.query("SELECT TIMEIN, TIMEOUT, PRIORITYSTART, PRIORITYEND FROM DOCTORTIME WHERE DOCTOR_ID = ?", [req.session.passport.user.Doctor_id], function(error, rows, fields){
            if(error){
                console.log(error)
            }else{
                return res.render('../views/doctor/profile', { time: rows[0]})
            }  
        })
    },

    putDoctorProfile: function(req, res, next){
        connection.query("UPDATE DOCTOR SET FNAME = ?, MNAME = ?, LNAME = ?, SPECIALIZATION = ?, CONSULTATION_FEE = ? WHERE DOCTOR_ID = ?",
        [req.body.fname, req.body.mname, req.body.lname, req.body.specialization, req.body.fee, req.user.Doctor_id],
        function(error, rows, fields){
            if(error){
                console.log(error)
            } else {
                connection.query("UPDATE DOCTORTIME SET TIMEIN = ?, TIMEOUT = ?, PRIORITYSTART = ?, PRIORITYEND = ? WHERE DOCTOR_ID = ?", 
                [req.body.start, req.body.end, req.body.pstart, req.body.pend, req.user.Doctor_id], 
                function(error, rows, fields){
                    if(error){
                        console.log(error)
                        return res.redirect('profile')
                    }else{
                        req.flash('success', 'Successfully update profile')
                        return res.redirect('/doctor/profile')
                    }
                })
            }
        })
    },

    getEmailChange: function(req, res, next){
        return res.render('../views/doctor/emailchange')
    },

    putEmailChange: function(req, res, next){
        if(req.user.Email!=req.body.email){
            connection.query("SELECT EMAIL FROM DOCTOR WHERE EMAIL = ?",
            [req.body.email],
            function(error, rows, field){
                if(error){
                    console.log(error)
                    return res.redirect('dashboard')
                }else if(rows.length){
                    req.flash('error', 'Email already taken')
                    return res.redirect('dashboard')
                }else{
                    connection.query("UPDATE DOCTOR SET EMAIL = ? WHERE DOCTOR_ID = ?",
                    [req.body.email, req.user.Doctor_id],
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
        return res.render('../views/doctor/passwordchange')
    },

    putPasswordChange: function(req, res, next){
        connection.query("SELECT PASS FROM DOCTOR WHERE DOCTOR_ID = ?",
        [req.user.Doctor_id],
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
                            connection.query("UPDATE DOCTOR SET PASS = ? WHERE DOCTOR_ID = ?",
                            [hash, req.user.Doctor_id],
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