const User = require('./user');

const Models = function() {

    /**
     * All the models will initialize here.
     */
    async function init() {
        User.sync();
    }

    return {
        "init": init
    }
   
}

module.exports = Models