const axios = require("../config/axios");
const moment = require("moment");

const status = async function (req, res, next) {
    let data = await axios();
    let cards = data.cards;
    let cardsId = [];
    cards.forEach(card => {
        cardsId.push(card.id);
    });
    let newCards = await cards.map(value => ({ ...value, createdDate: getCardsDateById(value.id, data) }));
    let newCardsMapList = await mapListsStatus(data, newCards);

    res.json(newCardsMapList);
};

function getCardsDateById(cardId, data) {
    let actions = data.actions;
    let res = "";
    actions.forEach(ele => {
        if (ele.type == "createCard") {
            if (ele.data.card.id == cardId) {
                res = ele.date;
            }
        }
        if (ele.type == "copyCard") {
            if (ele.data.card.id == cardId) {
                res = ele.date;
            }
        }
    });
    return res;
}

function mapListsStatus(data, newCards) {
    let allListsName = ["Todo", "In Progress", "Reviewing", "Done", "Classes", "Closed", "General Info", "Templates"];
    let status = ["Info", "Todo", "In_progress", "Done"];
    let listsCategorize = {
        Info: ["General Info", "Templates"],
        Todo: ["Todo"],
        In_progress: ["In Progress", "Reviewing"],
        Done: ["Classes", "Done"]
    };
    let lists = data.lists;
    let newLists = lists.map(function (ele) {
        let category;
        for (listStatus in listsCategorize) {
            for (i = 0; i < listsCategorize[listStatus].length; i++) {
                if (ele.name == listsCategorize[listStatus][i]) {
                    category = listStatus;
                    break;
                }
            }
        }
        return {
            ...ele,
            status: category
        };
    });

    newCards.forEach(card => {
        for (i = 0; i < newLists.length; i++) {
            if (card.idList == newLists[i].id) {
                card.listStatus = newLists[i].status;
                card.listName = newLists[i].name;
                break;
            }
        }
    });
    return newCards;
}

module.exports = {
    status
};
