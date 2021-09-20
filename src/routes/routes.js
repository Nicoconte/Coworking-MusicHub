const Routes = require('express').Router();

const UserRoutes = require('./user-route');
const RoomRoutes = require('./room-routes');
const SongQueueRoutes = require('./songQueue-route');

//Register every route used in the application here
Routes.use(UserRoutes);
Routes.use(RoomRoutes);
Routes.use(SongQueueRoutes);

module.exports = Routes;
