const Routes = require('express').Router();

const UserRoutes = require('./user-route');
const RoomRoutes = require('./room-routes');

//Register every route used in the application here
Routes.use(UserRoutes);
Routes.use(RoomRoutes)

module.exports = Routes;
