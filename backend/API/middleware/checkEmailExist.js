//load user model and mysql
const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)

module.exports = {
    checkEmailExist: async function(req, res, next){
        let promise = new Promise((resolve, reject) => {
            const selectPQuery = "SELECT EMAIL FROM PATIENT WHERE EMAIL = ?"
            const selectDQuery = "SELECT EMAIL FROM DOCTOR WHERE EMAIL = ?"
            const selectAQuery = "SELECT EMAIL FROM HADMIN WHERE EMAIL = ?"
    
            connection.query(selectPQuery, [req.body.email], (err, prows)=>{
                if(err){
                    reject(err)
                }else if(!prows.length){
                    connection.query(selectDQuery, [req.body.email], (err, drows)=>{
                        if(err){
                            reject(err)
                        }else if(!drows.length){
                            connection.query(selectAQuery, [req.body.email], (err, arows)=>{
                                if(err){
                                    reject(err)
                                }else if(!arows.length){
                                    req.flash('error', 'No user exist')
                                    resolve(res.redirect('/home'))
                                } else {
                                    resolve(next())
                                }
                            })
                        } else {
                            resolve(next())
                        }
                    })
                } else  {
                    resolve(next())
                }
            })
        })
        let result = await promise
        return result
    },
}