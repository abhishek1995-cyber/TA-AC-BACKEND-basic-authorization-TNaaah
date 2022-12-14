const user = require('../models/user');
var User =  require('../models/user')

module.exports = {

    loggedInUser: (req,res,next) =>{
        if(req.session && req.session.userId){
            next()
        } else {
            res.redirect('/users/login')
        }
    },

userInfo : (req,res,next)=>{
    var userId = req.session && req.session.userId;
    if(userId){
        User.findById(userId, "firstname email", (err,user)=>{
            if(err) return next(err);
            req.user = user;
            res.locals.user = user;
            next()
        })
    } else {
        req.user = null;
        res.locals.user = null;
        next()
    }
}

}

