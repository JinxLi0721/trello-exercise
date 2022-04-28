const axios = require("../config/axios");

const createCard = async function(req, res, next) {

    let result = await axios();
    // console.log(result)
    res.json(result);
 
}




module.exports = {
    createCard
}