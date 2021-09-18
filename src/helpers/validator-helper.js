const ValidatorHelper = function() {

    function hasFields(object, fields) {
        return Object.keys(object).toString() === fields.toString()
    }

    return {
        "hasFields": hasFields
    }

}

module.exports = ValidatorHelper