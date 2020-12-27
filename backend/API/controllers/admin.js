const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)
const bcrypt = require('bcrypt')
const saltRounds = 10
const generateUserId = require('../functions/generateUserId') 

module.exports = {
    getAdminDashboard: function(req, res, next){
        return res.render('../views/admin/dashboard')
    },

    getAdminProfile: function(req, res, next){
        return res.render('../views/admin/profile')
    },

    putAdminProfile: function(req, res, next){
        connection.query("UPDATE HADMIN SET FNAME = ?, MNAME = ?, LNAME = ? WHERE ADMIN_ID = ?",
        [req.body.fname, req.body.mname, req.body.lname, req.user.Admin_id],
        function(error, rows, fields){
            if(error){
                console.log(error)
            }else{
                req.flash('success', 'Successfully update profile')
                return res.redirect('/admin/profile')
            }
        })
    },

    getEmailChange: function(req, res, next){
        return res.render('../views/admin/emailchange')
    },

    putEmailChange: function(req, res, next){
        if(req.user.Email!=req.body.email){
            connection.query("SELECT EMAIL FROM HADMIN WHERE EMAIL = ?",
            [req.body.email],
            function(error, rows, field){
                if(error){
                    console.log(error)
                    return res.redirect('dashboard')
                }else if(rows.length){
                    req.flash('error', 'Email already taken')
                    return res.redirect('dashboard')
                }else{
                    connection.query("UPDATE HADMIN SET EMAIL = ? WHERE ADMIN_ID = ?",
                    [req.body.email, req.user.Admin_id],
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
        return res.render('../views/admin/passwordchange')
    },

    putPasswordChange: function(req, res, next){
        connection.query("SELECT PASS FROM HADMIN WHERE ADMIN_ID = ?",
        [req.user.Admin_id],
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

    getAddNewDoctor: function(req, res, next){
        return res.render('../views/admin/addnewdoctor')
    },

    postAddNewDoctor: function(req, res, next){
        const data = req.body
        data.start += ':00'
        data.end += ':00' 
        data.pstart += ':00' 
        data.pend += ':00'
    
        connection.query("SELECT * FROM DOCTOR WHERE EMAIL = ?",[data.email], function(error, rows, fields){
            if(error){
                req.flash('error', error)
                return res.redirect('dashboard')
            }
            if(rows.length){
                req.flash('error', 'That email is already taken.')
                return res.redirect('dashboard')
            }else{
                generateUserId()
                .then(function(id){
                    data.Doctor_id = id
                    const insertDrQuery = "INSERT INTO DOCTOR(DOCTOR_ID, FNAME, MNAME, LNAME, EMAIL, PASS, CONTACT, GENDER, SPECIALIZATION, CONSULTATION_FEE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                    bcrypt.hash(data.password, saltRounds, function(err, hash) {
                        connection.query(
                            insertDrQuery,
                            [data.Doctor_id, data.fname, data.mname, data.lname, data.email, hash, data.contact, data.gender, data.specialization, data.fee],
                            function(Drerr, Drrows){
                                if(Drerr){
                                    console.log(Drerr)
                                }else{
                                    const insertDrTQuery = "INSERT INTO DOCTORTIME(DOCTOR_ID, TIMEIN, TIMEOUT, PRIORITYSTART, PRIORITYEND) VALUES(?, ?, ?, ?, ?)"
                                    connection.query(
                                        insertDrTQuery,
                                        [data.Doctor_id, data.start, data.end, data.pstart, data.pend],
                                        function(DrTerr, DrTrows){
                                            if(DrTerr){
                                                console.log(DrTerr)
                                            }else{
                                                req.flash('success', 'Successfully add a new doctor')
                                                return res.redirect('showalldoctors')
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    })	
                })
                .catch((err) => console.log(err))
            }	
        })
    },

    getShowAllDoctors: function(req, res, next){
        connection.query("SELECT DOCTOR_ID, FNAME, LNAME, EMAIL, SPECIALIZATION FROM DOCTOR", [], function(error, rows, fields){
            if(error){
                console.log(error)
            }else{
                return res.render('../views/admin/listofdoctors', { doctors: rows})
            }
        })
    },

    getEditDoctor: function(req, res, next){
        connection.query('SELECT DOCTOR.DOCTOR_ID, DOCTOR.FNAME, DOCTOR.MNAME, DOCTOR.LNAME, DOCTOR.SPECIALIZATION, DOCTOR.CONSULTATION_FEE, DOCTORTIME.TIMEIN, DOCTORTIME.TIMEOUT, DOCTORTIME.PRIORITYSTART, DOCTORTIME.PRIORITYEND FROM DOCTOR JOIN DOCTORTIME ON DOCTOR.DOCTOR_ID=DOCTORTIME.DOCTOR_ID WHERE DOCTOR.DOCTOR_ID= ?',
        [req.params.id], 
        function(error, rows, fields){
            if(error){
                console.log(error)
            }
            if(!rows.length){
                req.flash('error', 'No doctor exist')
                console.log("im here in get or mujhe doctor ni mila")
                return res.redirect('/admin/dashboard')
            }else{
                return res.render('../views/admin/editdoctor', { doctor: rows[0] })
            }
        })
    },

    putEditDoctor: function(req, res, next){
        connection.query('UPDATE DOCTOR SET FNAME = ?, MNAME = ?, LNAME = ?, SPECIALIZATION = ?, CONSULTATION_FEE = ? WHERE DOCTOR_ID = ?',
        [req.body.fname, req.body.mname, req.body.lname, req.body.specialization, req.body.fee, req.params.id],
        function(error, rows, fields){
            if(error){
                console.log(error)
                return res.redirect('/admin/dashboard')
            }else{
                connection.query('UPDATE DOCTORTIME SET TIMEIN = ?, TIMEOUT = ?, PRIORITYSTART = ?, PRIORITYEND = ? WHERE DOCTOR_ID = ?', 
                [req.body.start, req.body.end, req.body.pstart, req.body.pend, req.params.id], 
                function(error, rows, fields){
                    if(error){
                        console.log(error)
                        return res.redirect('/admin/dashboard')
                    }else{
                        req.flash('success', 'Successfully update profile')
                        return res.redirect('/admin/showalldoctors')
                    }
                })
            }
        })
    },

    getDeleteDoctor: function(req, res, next){
        connection.query("SELECT * FROM DOCTOR WHERE DOCTOR_ID = ?", [req.params.id], (err,rows) => {
            if(err){
                console.log(err)
            }else if(!rows.length){
                req.flash('error', 'No doctor exist')
                return res.redirect('/admin/showalldoctors')
            }else{
                connection.query("DELETE FROM DOCTOR WHERE DOCTOR_ID = ?", [req.params.id], (delerr, delrows) => {
                    if(delerr){
                        console.log(delerr)
                    }else{
                        req.flash('success', 'Doctor deleted')
                        return res.redirect('/admin/showalldoctors')
                    }
                })
            }
        })
    },

    getAddRoom: function(req, res, next){
        connection.query("SELECT ROOM_ID, ROOM_AVAILABLE FROM ROOM", function(error, rows, fields){
            return res.render('../views/admin/addroom', { TOTALROOMS: rows.length, rooms: rows })
        })
    },

    postAddRoom: function(req, res, next){
        connection.query("INSERT INTO ROOM VALUES(?,?,?,?)",
            [req.body.roomno, true, null, null],
            function(error, rows, fields){
                if(error){
                    req.flash('error', 'Some error occurred')
                    return res.redirect('/admin/addroom')
                }else{
                    req.flash('info', 'Added new room with Room Number ' + req.body.roomno)
                    return res.redirect('/admin/addroom')
                }
            })
    },

    getDeleteRoom: function(req, res, next){
        connection.query('DELETE FROM ROOM WHERE ROOM_ID = ?', 
        [req.params.id], 
        function(error, rows, fields){
            if(error){
                req.flash('error', 'Some error occurred')
                return res.redirect('/admin/addroom')
            }else{
                req.flash('info', 'Deleted room with Room Number ' + req.params.id)
                return res.redirect('/admin/addroom')
            }
        })
    },
}