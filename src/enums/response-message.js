const RESPONSE_MESSAGE = {
    "UNEXPECTED_ERROR": "An unexpected error ocurred during the process",
    "INCOMPLETE_BODY": "Invalid fields.",
    "ALREADY_EXISTS": "The user already exists with that username. Try another one.",
    "USER_DOES_NOT_EXIST": "User does not exist. Create one",
    "UNAUTHORIZED": "Unauthorized user",
    "INVALID_TOKEN": "Invalid token",
    "PROPERTY_REQUIRE": (prop) => `Property .${prop} was required`,
    "CANNOT_CREATE": (object) => `Cannot create the object ${object}`,
    "INVALID_BODY": "Body cannot be null"
}

module.exports = RESPONSE_MESSAGE;

