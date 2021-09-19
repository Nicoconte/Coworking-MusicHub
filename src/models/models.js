const User = require('./user');
const AuthToken = require('./authtoken');
const Room = require('./room');
const RoomParticipant = require('./room-participant');

const Models = function() {

    /**
     * All the models will initialize here.
     */

    const tableOptions = {
        force: false
    }

    async function init() {
        User.sync(tableOptions);
        AuthToken.sync(tableOptions);
        Room.sync(tableOptions);
        RoomParticipant.sync(tableOptions);
    }

    return {
        "init": init
    }
   
}

module.exports = Models