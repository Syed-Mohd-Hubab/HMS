const express = require("express");
const router = express.Router();
const { ensureDoctor } = require("../middleware/checkauth");
const doctor = require("../controllers/doctor");
const { validate } = require("../functions/validate");
const validationResult = require("../controllers/validationResult");

const mysql = require("mysql2");
const configDB = require("../config/configDB");
const connection = mysql.createConnection(configDB.connection);

router.get("/dashboard", ensureDoctor, doctor.getDoctorDashboard);

router.get("/profile", ensureDoctor, doctor.getDoctorProfile);

router.put(
  "/profile",
  ensureDoctor,
  validate("Doctor-Edit"),
  validationResult.doctorEdit,
  doctor.putDoctorProfile
);

router.get("/emailchange", ensureDoctor, doctor.getEmailChange);

router.put(
  "/emailchange",
  ensureDoctor,
  validate("Email"),
  validationResult.emailOrPasswordChange,
  doctor.putEmailChange
);

router.get("/passwordchange", ensureDoctor, doctor.getPasswordChange);

router.put(
  "/passwordchange",
  ensureDoctor,
  validate("Password"),
  validationResult.emailOrPasswordChange,
  doctor.putPasswordChange
);

router.get("/appointments", ensureDoctor, (req, res) => {
  connection.query(
    "select a.*, CONCAT(p.Fname,' ', p.Lname) as Pname from appointment a, patient p where Not_pending=false and department= ? and a.patient_id=p.patient_id ;",
    [req.user.Specialization],
    (err, rows) => {
      if (err) console.log(err);
      else if (rows.length > 0) {
        console.log("HERE: " + req.user.Specialization);
        return res.render("../views/doctor/appointments", {
          appointments: rows,
          id: "",
        });
      } else {
        console.log("no appointments");
        req.flash("alert", "No appointments in list");
        res.render("../views/doctor/appointments", {
          appointments: rows,
          id: "",
        });
        // res.redirect('/doctor/dashboard')
      }
    }
  );
});

router.get("/prescribe/:id", ensureDoctor, (req, res) => {
  connection.query(
    "select department, message, Appointment_id, a.Patient_id, Fname, Lname, Gender, Blood_group from appointment a, patient p where a.patient_id=p.patient_id and a.appointment_id=?;",
    [req.params.id],
    (err, row) => {
      if (err) {
        req.flash("error", "Pescription GET error");
        console.log(err);
        res.redirect("/doctor/appointments");
      } else {
        console.log(
          "Prescribing: " +
            row[0].Fname +
            " " +
            row[0].Lname +
            " for " +
            row[0].department
        );
        res.render("../views/doctor/prescribe", { patient: row });
      }
    }
  );
});

router.put("/prescribe/:id", ensureDoctor, (req, res) => {
  console.log("in PUT: " + req.params.id);
  connection.query(
    "update appointment set Appointment_Time=NOW(), Not_pending=true, Disease=?, Treatment=?, Total_fee=?, Doctor_id=? where Appointment_id=?",
    [
      req.body.Disease,
      req.body.Treatment,
      req.user.Consultation_fee,
      req.user.Doctor_id,
      req.params.id,
    ],
    (err, result) => {
      if (err) {
        req.flash("error", "Couldnt Prescribe");
        console.log(err);
        res.redirect("/doctor/appointments");
      } else {
        req.flash("success", "Prescribed");
        console.log(result);
        res.redirect("/doctor/appointments");
      }
    }
  );
});

router.get("/prescriptions", ensureDoctor, (req, res) => {
  connection.query(
    "select a.*, CONCAT(p.Fname,' ', p.Lname) as Pname from appointment a, patient p where a.Patient_id=p.patient_id and Not_pending=true and a.doctor_id=? ;",
    [req.user.Doctor_id],
    (err, rows) => {
      if (err) {
        req.flash("error", "Unable to fetch prescriptions");
        console.log(err);
        res.redirect("/doctor/dashboard");
      } else {
        console.log("Showing prescriptions:"+rows)
        res.render("../views/doctor/prescriptions.ejs", { rows2: rows})
      }
    })
})

router.get("/prescription/:id", ensureDoctor, (req, res) =>{
  connection.query("select *, CONCAT(p.Fname,' ', p.Lname) as Pname from appointment a, patient p where a.appointment_id=? and a.patient_id=p.patient_id;", [req.params.id], (err, row) =>{
    if(err){
      console.log("Err in details id: "+err)
      res.redirect("/doctor/dashboard")
    } else {
      connection.query("select * from inpatient where appointment_id=?", [req.params.id], (err2, row2) => {
        if(err2){
          console.log("err in presc id 2: "+err2)
          res.redirect("/doctor/dashboard")
        }
        else{
          console.log("Showing all details: "+row +","+ row2)
          res.render("../views/doctor/details", {row:row, row2:row2})
        }
      })
    }
  })
})

router.get("/appointments/assigntime/:id", ensureDoctor, (req, res) => {
  connection.query(
    "select a.*, CONCAT(p.Fname, ' ', p.Lname) as Pname from appointment a, patient p where a.Patient_id=p.Patient_id and a.appointment_id=?;",
    [req.params.id],
    (err, row1) => {
      if (err) {
        console.log(err);
        res.redirect("/doctor/dashboard");
      } else {
        connection.query(
          "select * from doctortime where doctor_id=?",
          [req.user.Doctor_id],
          (err, row2) => {
            if (err) {
              console.log(err);
              res.redirect("/doctor/dashboard");
            } else {
              console.log("Assigning time to: " + row1[0].Pname);
              res.render("../views/doctor/assigntime.ejs", {
                row1: row1,
                row2: row2,
              });
            }
          }
        );
      }
    }
  );
});

router.put("/appointments/assigntime/:id", ensureDoctor, (req, res) => {
  var d = new Date(req.body.date);
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  var n = weekday[d.getDay()];

	connection.query("update appointment set Time_assigned=?, Time_Assigned_day = ?, Time_Assigned_date=?, Doctor_id=? where appointment_id = ?", [req.body.start, n, req.body.date, req.user.Doctor_id, req.params.id], (err, result) =>{
		if(err){
			console.log(err)
			res.redirect("/doctor/dashboard")
		}else{
			console.log("Assigned time: "+result)
			req.flash("success", "Appointment Time Assigned to Patient")
			res.redirect("/doctor/appointments")
		}
	})
});

router.get("/inpatient/:id", ensureDoctor, (req, res) =>{ 
  connection.query("select a.*, CONCAT(p.Fname, ' ', p.Lname) as Pname from appointment a, patient p where a.Patient_id=p.Patient_id and a.appointment_id=?;", [req.params.id], (err, row) =>{
    if(err){
      console.log("Err in get inpatient id: "+err)
      res.redirect("/doctor/dashboard")
    }
    else{
      connection.query("select * from room where room_available=true;", (err, rows) =>{
        if(err){
          console.log(err)
        }else{
          console.log("Assigning room to inpatient: "+row)
          res.render("../views/doctor/inpatient", {row:row, rows:rows})
        }
      })
    }
  })
})

router.post("/inpatient/:id", ensureDoctor, (req, res) =>{
  connection.query("insert into inpatient set Appointment_id=?, Patient_id=?, Doctor_id=?, Room_id=?, Department=?, Descript=?, TimeIn=NOW();",
  [req.params.id, req.body.Patient_id, req.user.Doctor_id, req.body.Room, req.user.Specialization, req.body.Desc],
  (err, result) =>{
    if(err){
      console.log("Err in posting inpatient: "+err)
      res.redirect("/doctor/dashboard")
    } else {
      console.log("post inpatient table: "+result)
      connection.query("update room set Room_available=false, Appointment_id=? where room_id=?;", [req.params.id, req.body.Room], (err2, result2)=>{
        if(err){
          console.log("Err in post inpatient room: "+err2)
          res.redirect("/doctor/dashboard")
        } else {
          console.log("Assigned patient: "+result2)
          req.flash("success", "Room assigned to patient")
          res.redirect("/doctor/dashboard")
        }
      })
    }
  })
})

router.get("/inpatientslist", ensureDoctor, (req, res) =>{
  connection.query("select i.*, CONCAT(p.Fname,' ',p.Lname) as Pname from inpatient i, patient p where i.patient_id=p.patient_id and i.doctor_id=? and i.TimeOut is null", [req.user.Doctor_id], (err, rows) =>{
    if(err)
      console.log(err)
    else{
      console.log("showing all inpatients: "+rows)
      res.render("../views/doctor/inpatientslist", {rows:rows})
    }
  })
}) 

router.get("/outpatient/:id", ensureDoctor, (req, res) =>{
  connection.query("select i.*, CONCAT(p.Fname, ' ', p.Lname) as Pname, d.Consultation_fee as Fee from inpatient i, patient p, doctor d where i.appointment_id=? and i.doctor_id=d.doctor_id and i.patient_id=p.patient_id", [req.params.id], (err, row) =>{
    if(err){
      console.log("Err in get outpatient: "+err)
      res.redirect("/doctor/dashboard")
    } else {
      console.log("outpatienting: "+row[0].Pname)
      res.render("../views/doctor/outpatient", {row:row})
    }
  })
})

router.put("/outpatient/:id", ensureDoctor, (req, res) => {
  var tot_fee=parseFloat(req.body.fees)+parseFloat(req.user.Consultation_fee);
  connection.query("update inpatient set TimeOut=NOW(), Fee=? where appointment_id=?;", [tot_fee, req.params.id], (err, result) => {
    if(err){
      console.log("Err in put outpatient: "+err)
    } else {
      connection.query("update appointment set Total_fee=? where appointment_id=?", [tot_fee, req.params.id], (err2, res) => {
        if(err){
          console.log("err is appointment update: "+err2)
        }
        else{
          connection.query("update room set room_available=true, appointment_id=NULL where appointment_id=?",[req.params.id], (err3, res3) =>{
            if(err3){
              console.log("HEREEEEEEEE:"+err3)
            } else {
              console.log("Outpatiented: "+res3)
              req.flash("success", "Patient released !")
            }
          })
        }
      })
    }
  })
  res.redirect("/doctor/dashboard") 
})

module.exports = router;
