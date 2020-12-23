//load user model and mysql
const mysql = require('mysql2')
const configDB = require('../config/configDB')
const connection = mysql.createConnection(configDB.connection)
//load uuidv4 to generate user ids
const uuid = require('uuid')

module.exports = generateUserId

async function generateUserId(){
    let exist = true
    do{
        let pid = uuid.v4()
        const id = await uuidExistOrNot(pid)
        if(id===pid){
            exist = false
            return id
        }
    }while(exist)
}

function uuidExistOrNot(pid){
    return new Promise((resolve, reject) => {
        const selectPQuery = "SELECT * FROM PATIENT WHERE PATIENT_ID = ?"
        const selectDQuery = "SELECT * FROM DOCTOR WHERE DOCTOR_ID = ?"
        const selectAQuery = "SELECT * FROM HADMIN WHERE ADMIN_ID = ?"

        connection.query(selectPQuery, [pid], (err, prows)=>{
            if(!prows.length){
                connection.query(selectDQuery, [pid], (err, drows)=>{
                    if(!drows.length){
                        connection.query(selectAQuery, [pid], (err, arows)=>{
                            if(!arows.length){
                                resolve(pid)
                            } else {
                                reject(err)
                            }
                        })
                    } else {
                        reject(err)
                    }
                })
            } else  {
                reject(err)
            }
        })
    })
}