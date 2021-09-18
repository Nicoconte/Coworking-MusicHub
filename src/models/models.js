const User = require('./user');
const AuthToken = require('./authtoken');

const Models = function() {

    /**
     * All the models will initialize here.
     */
    async function init() {
        User.sync();
        AuthToken.sync();
    }

    return {
        "init": init
    }
   
}

module.exports = Models