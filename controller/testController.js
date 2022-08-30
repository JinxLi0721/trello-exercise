const { trelloAdapter } = require('../adapters/trelloAdapter');

const getAllListsName = async function (req, res, next) {
    let board = await trelloAdapter.getBoard();
    let lists = board.lists;
    let name = [];
    lists.forEach(element => {
        name.push(element.name);
    });

    res.json(name);
};

module.exports = {
    getAllListsName
};
