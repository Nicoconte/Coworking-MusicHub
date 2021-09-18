const Routes = require('express').Router();

const UserRoutes = require('./user-route');

//Register every route used in the application here
Routes.use(UserRoutes);

module.exports = Routes;
