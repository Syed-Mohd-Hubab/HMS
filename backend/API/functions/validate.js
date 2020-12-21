const { body } = require('express-validator')

module.exports.validate = function(method){
    switch(method){
        case 'Admin-Signup': {
            return [
                body('fname', 'First name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('mname', 'Middle name can only contain letters and must be 3 characters long. ').optional({checkFalsy:true}).escape().trim().isAlpha(),
                body('lname', 'Last name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('email', 'Must enter valid email. ').exists({checkFalsy:true}).escape().trim().isEmail().normalizeEmail(),
                body('password', 'Password must be 4 characters long. ').exists().isLength({min:4, max:100}),
            ]
        }
        case 'Doctor-Signup': { //not signup actually, registeration of doctor by admin
            const time = new RegExp('^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$')
            return [
                body('fname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('mname', 'Name can only contain letters and must be 3 characters long. ').optional({checkFalsy:true}).escape().trim().isAlpha(),
                body('lname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('email', 'Must enter valid email. ').exists({checkFalsy:true}).escape().trim().isEmail().normalizeEmail(),
                body('password', 'Password must be 4 characters long. ').exists({checkFalsy:true}).isLength({min:4, max:100}),
                body('gender', 'Gender can be "Male","Female" or "Prefer not to say". ').exists({checkFalsy:true}).isIn(['Male','Female','Preder not to say']),
                body('specialization', 'Enter a valid specialization. ').exists({checkFalsy:true}).escape().trim(),
                body('fee', 'Fee must a number. ').optional({checkFalsy:true}).escape().trim().isInt(),
                body('contact', 'Enter a valid phone number. ').exists({checkFalsy:true}).isInt().isLength({min:11, max:15}),
                body('start', 'Enter a valid time. ').exists({checkFalsy:true}).matches(time),
                body('end', 'Enter a valid time. ').exists({checkFalsy:true}).matches(time),
                body('pstart', 'Enter a valid time. ').exists({checkFalsy:true}).matches(time),
                body('pend').exists({checkFalsy:true}).matches(time).custom((value, {req})=> {
                    const start = req.body.start.split(':')
                    const end = req.body.end.split(':')
                    const pstart = req.body.pstart.split(':')
                    const pend = value.split(':')
                    if(start[0] >= end[0]){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else if((pstart[0] <= start[0])){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else if( (pstart[0] < end[0]) || ((pstart[0] === end[0]) && (pstart[1] < end[1])) ){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else if((pstart[0] >= pend[0])){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else{
                        return true;
                    }
                }),
            ]
        }
        case 'Patient-Signup': {
            return [
                body('fname', 'First name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('mname', 'Middle name can only contain letters and must be 3 characters long. ').optional({checkFalsy:true}).escape().trim().isAlpha(),
                body('lname', 'Last name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('email', 'Must enter valid email. ').exists({checkFalsy:true}).escape().trim().isEmail().normalizeEmail(),
                body('password', 'Password must be 4 characters long. ').exists().isLength({min:4, max:100}),
                body('gender', 'Gender can be "Male","Female" or "Prefer not to say". ').exists({checkFalsy:true}).isIn(['Male','Female','Preder not to say']),
                body('dateofbirth', 'Enter a valid date between year 1900 to current year. ').exists({checkFalsy:true}).isBefore(new Date().toISOString().split('T')[0]).isAfter('1900-01-01'),
                body('bgroup', 'Enter a valid blood group. ').optional().isIn(['A+','B+','AB+','O+','A-','B-','AB-','O-']),
                body('contact', 'Enter a valid phone number. ').exists({checkFalsy:true}).isInt().isLength({min:11, max:15}),
            ]
        }
        case 'Admin-Edit': {
            return [
                body('fname', 'First name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('mname', 'Middle name can only contain letters and must be 3 characters long. ').optional({checkFalsy:true}).escape().trim().isAlpha(),
                body('lname', 'Last name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                // body('email', 'Must enter valid email. ').exists({checkFalsy:true}).escape().trim().isEmail().normalizeEmail(),
            ]
        }
        case 'Doctor-Edit': {
            const time = new RegExp('^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$')
            return [
                body('fname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('mname', 'Name can only contain letters and must be 3 characters long. ').optional({checkFalsy:true}).escape().trim().isAlpha(),
                body('lname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                // body('email', 'Must enter valid email. ').exists({checkFalsy:true}).escape().trim().isEmail().normalizeEmail(),
                body('specialization', 'Enter a valid specialization. ').exists({checkFalsy:true}).escape().trim(),
                body('fee', 'Fee must a number. ').optional({checkFalsy:true}).escape().trim().isInt(),
                // body('contact', 'Enter a valid phone number. ').exists({checkFalsy:true}).isInt().isLength({min:11, max:15}),
                body('start', 'Enter a valid time. ').exists({checkFalsy:true}).matches(time),
                body('end', 'Enter a valid time. ').exists({checkFalsy:true}).matches(time),
                body('pstart', 'Enter a valid time. ').exists({checkFalsy:true}).matches(time),
                body('pend').exists({checkFalsy:true}).matches(time).custom((value, {req})=> {
                    const start = req.body.start.split(':')
                    const end = req.body.end.split(':')
                    const pstart = req.body.pstart.split(':')
                    const pend = value.split(':')
                    if(start[0] >= end[0]){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else if((pstart[0] <= start[0])){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else if( (pstart[0] < end[0]) || ((pstart[0] === end[0]) && (pstart[1] < end[1])) ){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else if((pstart[0] >= pend[0])){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else{
                        return true;
                    }
                }),
            ]
        }
        case 'Patient-Edit': {
            return [
                body('fname', 'First name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('mname', 'Middle name can only contain letters and must be 3 characters long. ').optional({checkFalsy:true}).escape().trim().isAlpha(),
                body('lname', 'Last name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                // body('email', 'Must enter valid email. ').exists({checkFalsy:true}).escape().trim().isEmail().normalizeEmail(),
                body('dateofbirth', 'Enter a valid date between year 1900 to current year. ').exists({checkFalsy:true}).isBefore(new Date().toISOString().split('T')[0]).isAfter('1900-01-01'),
                body('bgroup', 'Enter a valid blood group. ').optional().isIn(['A+','B+','AB+','O+','A-','B-','AB-','O-']),
                // body('contact', 'Enter a valid phone number. ').exists({checkFalsy:true}).isInt().isLength({min:11, max:15}),
            ]
        }
        case 'Admin-DoctorEdit': {
            const time = new RegExp('^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$')
            return [
                body('fname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('mname', 'Name can only contain letters and must be 3 characters long. ').optional({checkFalsy:true}).escape().trim().isAlpha(),
                body('lname', 'Name can only contain letters and must be 3 characters long. ').exists({checkFalsy:true}).escape().trim().isAlpha().isLength({min:3}),
                body('specialization', 'Enter a valid specialization. ').exists({checkFalsy:true}).escape().trim(),
                body('fee', 'Fee must a number. ').optional({checkFalsy:true}).escape().trim().isInt(),
                body('start', 'Enter a valid time. ').exists({checkFalsy:true}).matches(time),
                body('end', 'Enter a valid time. ').exists({checkFalsy:true}).matches(time),
                body('pstart', 'Enter a valid time. ').exists({checkFalsy:true}).matches(time),
                body('pend').exists({checkFalsy:true}).matches(time).custom((value, {req})=> {
                    const start = req.body.start.split(':')
                    const end = req.body.end.split(':')
                    const pstart = req.body.pstart.split(':')
                    const pend = value.split(':')
                    if(start[0] >= end[0]){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else if((pstart[0] <= start[0])){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else if( (pstart[0] < end[0]) || ((pstart[0] === end[0]) && (pstart[1] < end[1])) ){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else if((pstart[0] >= pend[0])){
                        throw new Error('Enter a valid time. Note: End time must be after start time. Priority end time must after priority start time. Priority must be after Actual timings.')
                    }else{
                        return true;
                    }
                }),
            ]
        }
        case 'Email': {
            return [
                body('email', 'Must enter valid email. ').exists({checkFalsy:true}).escape().trim().isEmail().normalizeEmail(),
            ]
        }
        case 'Password': {
            return [
                body('newpassword', 'Password must be 4 characters long!').exists().isLength({min:4, max:100}),
            ]
        }
        default:
            throw new Error('Nothing to Validate')
    }
}