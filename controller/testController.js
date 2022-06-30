const axios = require("../config/axios");

const getAllListsName = async function (req, res, next) {
    let data = await axios();
    let lists = data.lists;
    let name = [];
    lists.forEach(element => {
        name.push(element.name);
    });

    res.json(name);
};

module.exports = {
    getAllListsName
};
