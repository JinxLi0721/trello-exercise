const { trelloAdapter } = require('../adapters/trelloAdapter');

const getAllListsName = async function (req, res, next) {
    let data = await trelloAdapter.getBoard();
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
