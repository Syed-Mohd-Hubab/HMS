create database HMS;
use HMS;
CREATE TABLE HAdmin
  (
    Admin_id				VARCHAR(37) PRIMARY KEY,
    Fname					VARCHAR(50) NOT NULL,
    Mname					VARCHAR(50),
    Lname					VARCHAR(50) NOT NULL,
    Email					VARCHAR(40) UNIQUE NOT NULL,
    Pass					VARCHAR(100) NOT NULL
  );

CREATE TABLE Doctor
  (
    Doctor_id				VARCHAR(37) PRIMARY KEY,
    Fname					VARCHAR(50) NOT NULL,
    Mname					VARCHAR(50),
    Lname					VARCHAR(50) NOT NULL,
    Email					VARCHAR(40) UNIQUE NOT NULL,
    Pass					VARCHAR(100) NOT NULL,
    Contact					VARCHAR(16) UNIQUE NOT NULL,
    Gender					VARCHAR(20) NOT NULL,
    Specialization			VARCHAR(40) NOT NULL,
    Consultation_fee		INTEGER NOT NULL
  );
  
CREATE TABLE Patient
  (
    Patient_id				VARCHAR(37) PRIMARY KEY,
    Fname					VARCHAR(50) NOT NULL,
    Mname					VARCHAR(50),
    Lname					VARCHAR(50) NOT NULL,
    Email					VARCHAR(40) UNIQUE NOT NULL,
    Pass					VARCHAR(100) NOT NULL,
    Contact					VARCHAR(16) UNIQUE NOT NULL,
    Gender					VARCHAR(20) NOT NULL,
    DOB						DATE NOT NULL,
    Blood_group				VARCHAR(4),
    Verified				BOOLEAN DEFAULT FALSE
  );
  
CREATE TABLE Appointment
  (
    Appointment_id			VARCHAR(37) PRIMARY KEY NOT NULL,
    Appointment_Time		DATETIME DEFAULT NULL,
    Message					VARCHAR(300),
    Time_assigned			TIME,
    Time_assigned_day		VARCHAR(25) DEFAULT NULL,
    Time_assigned_date		VARCHAR(40) DEFAULT NULL,
    Not_pending				BOOL DEFAULT FALSE,
    Disease					VARCHAR(20),
    department				VARCHAR(50) DEFAULT NULL,
    Treatment				VARCHAR(30),
    Total_fee				INTEGER,
    Doctor_id				VARCHAR(100),
    Patient_id				VARCHAR(37) NOT NULL,
    FOREIGN KEY(Doctor_id) 	REFERENCES Doctor(Doctor_id) ON DELETE SET NULL,
    FOREIGN KEY(Patient_ID) REFERENCES Patient(Patient_ID)
  );
  
CREATE TABLE Doctortime
  (
    Doctor_ID				VARCHAR(37) NOT NULL,
    TimeIn					TIME,
    TimeOut					TIME,
    PriorityStart			TIME,
    PriorityEnd				TIME,
    FOREIGN KEY(Doctor_ID)	REFERENCES Doctor(Doctor_ID) ON DELETE CASCADE
  );
  
CREATE TABLE Room
  (
    Room_id					INTEGER AUTO_INCREMENT PRIMARY KEY,
    Room_available			BOOL DEFAULT TRUE,
    Appointment_id			VARCHAR(37),
    Foreign key(appointment_id) references appointment(appointment_id)
  );

CREATE TABLE InPatient
  (
    Appointment_id			VARCHAR(37) NOT NULL,
    Department				VARCHAR(40) NOT NULL,
    Descript				VARCHAR(4096),
    TimeIn					DATETIME NOT NULL,
    TimeOut					DATETIME,
    Fee						INTEGER,
    FOREIGN KEY(Appointment_id)	REFERENCES Appointment(Appointment_id)
   );
