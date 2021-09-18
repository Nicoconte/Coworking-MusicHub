
const AuthToken = require('../models/authtoken');

const uuid = require('uuid');

const AuthTokenService = function() {

    async function assignTokenToAsync(user) {
        let token = await AuthToken.create({
            key: uuid.v4().toString(),
            userId: user.id
        })

        return token ? token : null;
    }

    async function findTokenByUserIdAsync(userId) {
        let token = await AuthToken.findOne({
            where: {
                userId: userId
            }
        });

        return token ? token : null;
    }

    return {
        "assignTokenToAsync": assignTokenToAsync,
        "findTokenByUserIdAsync": findTokenByUserIdAsync
    }

}

module.exports = AuthTokenService