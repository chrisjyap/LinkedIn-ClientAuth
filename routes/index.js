/**
 * Created by Chris on 5/31/2015.
 */
var express = require('express');
var config = require('../config.json');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Shark City' , key:config.api_key});
});

module.exports = router;

