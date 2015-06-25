var express = require('express');
var router = express.Router();
var auth = require('basic-auth');
var config = require('../util/settings_handler').getConfig();


router.all('*', function(req, res, next) {
    if (config.use_authentication || config.use_api_key) {
        var credentials = auth(req);
        var key = req.query.api_key;
        //TODO: reroute to login
        if (!credentials && !key) {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="example"');
            res.end('Access denied');
        } else {
            if (credentials) {
                for (var i = 0; i < config.users.length; i++) {
                    if (credentials.name == config.users[i].username && credentials.pass == config.users[i].password) {
                        next();
                        return;
                    }
                    res.statusCode = 400;
                    res.setHeader('WWW-Authenticate', 'Basic realm="example"');
                    res.end("Wrong credentials");
                    return;
                }
            } else {
                for (var i = 0; i < config.api_keys.length; i++) {
                    if (key === config.api_keys[i]) {
                        next()
                        return;
                    }
                }
                res.statusCode = 400;
                res.setHeader('WWW-Authenticate', 'Basic realm="example"');
                res.end("Wrong credentials");
                return;
            }
        }
    } else {
        next();
    }
});






module.exports = router;