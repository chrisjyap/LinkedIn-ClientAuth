/**
 * Created by adityamangipudi1 on 5/26/15.
 */
var express = require('express');
var config = require('../config.json');
var passport = require('passport');
var session = require('express-session');
var SessionModel = require('../models/SessionModel');
var VCUserModel = require('../models/VCUserModel');
var router = express.Router();
router.use(passport.initialize());
router.use(passport.session());
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var states ={};
var profileG;
var LINKEDIN_KEY =config.api_key;
var LINKEDIN_SECRET = config.secret_key;

function uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

var cookie_secret=uuid();
router.use(session({  secret: cookie_secret,
    name: 'shark-id',
    proxy: true,
    resave: true,
    saveUninitialized: true }));

passport.serializeUser(function(user, done) {
    //console.log('user', user);
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

passport.use(new LinkedInStrategy({
    clientID: LINKEDIN_KEY,
    clientSecret: LINKEDIN_SECRET,
    callbackURL: "http://localhost:3000/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile']
}, function( accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log('Gucci');
    done(null, profile);
}));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Shark City' , key:config.api_key});
});

router.post('/login/:type', function(req, res, next) {
    var uid= uuid();
    console.log('body: ', req.body);
    console.log('params: ',req.params);
    states[req.body.id] = {
        id: uid,
        type: req.params.type
    };

    //req.session.state = req.body.id;
    //console.info('before authenticate', req.headers);
    console.log('before render');
    res.redirect('/auth/home');
    //passport.authenticate('linkedin', { state: '7e12584c423443244ddbb15c847450bba436'})(req, res, next)

});

router.get("/linkedin/callback", function (req, res, next) {
    var reqId = req.session.state;
    //var state = states[reqId];
    console.info('in passport callback before auth: ', reqId, states[reqId]);
    passport.authenticate('linkedin', function(err, user) {
        console.log('user', user);
        var end = function(err) {
            // remove session created during authentication
            req.session.destroy();
            // authentication failed: you should redirect to the proper error page
            if (err) return res.redirect("/");

            // and eventually redirect to success url
            res.redirect("/home");
        };
        if (err) {
            return end(err);
        }

        console.log('in passport callback: ', states[reqId]);
        //insert user into db here
        return end();

    })(req, res, next)

});

router.get('/home', function(req, res){

    console.log('req-user', req.session);
    res.render('index', { title: 'Shark City' , key:config.api_key});
});



module.exports = router;
