const express = require('express');

const Application = function() {

    const PORT = 3000;
    const app = express();

    function start() {
        app.listen(PORT, () => {
            console.log(`Server is listening at http://localhost:${PORT}`)
        })
    }


    return {
        "start": start
    }

}


module.exports = Application;