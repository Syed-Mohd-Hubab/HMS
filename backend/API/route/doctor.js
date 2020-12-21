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
    "select * from appointment where Not_pending=false and department= ?;",
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
        res.render("../views/doctor/prescriptions.ejs", { rows2: rows });
      }
    }
  );
});

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
	connection.query("update appointment set Time_assigned=? where appointment_id = ?", [req.body.start, req.params.id], (err, result) =>{
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

module.exports = router;
