module.exports = {
    ensureAdmin: function(req, res, next){
        if (req.isAuthenticated() && req.session.passport.user.Admin_id) {
            return next()
        } else {
            req.flash('error', 'You must log in as an admin to go there')
            return res.redirect('/error/401')
        }
    },
    ensureDoctor: function(req, res, next){
        if (req.isAuthenticated() && req.session.passport.user.Doctor_id) {
            return next()
        } else {
            req.flash('error', 'You must log in as a doctor to go there')
            return res.redirect('/error/401')
        }
    },
    ensurePatient: function(req, res, next){
        if (req.isAuthenticated() && req.session.passport.user.Patient_id) {
            return next()
        } else {
            req.flash('error', 'You must log in as a patient to go there')
            return res.redirect('/error/401')
        }
    },
    ensureAuth: function(req, res, next){
        if (req.isAuthenticated()) {
            return next()
        } else {
            req.flash('error', 'You must log in to go there')
            return res.redirect('/error/401')
        }
    },
    ensureGuest: function(req, res, next){
        if (!req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error', 'You must first log out to go there')
            return res.redirect('back');
        }
    },
}