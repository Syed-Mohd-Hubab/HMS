//load user model and mysql
const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)

module.exports = {
    verified: function(req, res, next){
        connection.query('SELECT VERIFIED FROM PATIENT WHERE EMAIL = ?', 
            [req.body.email],
            function(error, rows, fields){
                if(error){
                    console.log(error)
                    req.flash('error', error)
                }else if(!rows.length){
                    req.flash('error', 'User do not exist')
                    return res.redirect('/authenticate/patient/login')
                }else{
                    if(rows[0].VERIFIED){
                        next()
                    }else{
                        req.flash('info', 'Your account needs verification')
                        return res.redirect('/home')
                    }
                }
            })
    },
}