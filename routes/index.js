/**
 * Routes
 * @module routes/routes
 */
'use strict';

/** Add all routes to the express app */
module.exports = function addRoutes (app) {
    app.get('/', (req, res, next) => {
        res.json({
            msg: "Welcome!"
        });
        next();
    });
    app.use('/pages', require('./pages'));
    app.use('/admin', require('./admin'));
};
