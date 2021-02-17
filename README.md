# Hospital Management System using M.E.N. stack
A web application built using **NodeJS, ExpressJS &amp; MySQL** for Patients and Doctors.<br>
A _Patient_ can request for appointments for various department, check upcoming appointments, cancel them and check his prescription history.<br>
A _Doctor_ can assign a time to the requested appointment(s) of patient(s), assign rooms to inpatient in case of necessity, cancel appointments and outpatient current inpatients.<br>
An _Admin_ can add/remove/view the rooms as well as the doctors in the hospital.<br>
### Technologies used:
[logo]: https://simpleicons.org/icons/mysql.svg
### Features:
- Package managing using _**NPM**_
- Email verification using _**Nodemailer**_
- User authentication using _**PassportJS**_
- User ID generated using _**UUID**_
- Implemented Middleware to verify user while redirecting
- CRUD operations using _**Express Router**_
- Used _**EJS**_ templates for rendering, communication between backend &amp; frontend
- Stored user login seesions using _**Express-Session**_
- Encrypted user passwords into database using _**bcrypt**_
### Configuration:
Please configure your database connection in backend/API/config/configDB.js 
