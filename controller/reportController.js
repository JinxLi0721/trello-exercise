const axios = require("../config/axios");
const moment = require("moment");

/**
 *
 * @param {
 * updateCard,
 * createCard,
 * createCustomField,
 * createList,
 * createBoard,
 * commentCard,
 * addMemberToCard,
 * addMemberToBoard,
 * addAttachmentToCard,
 * addChecklistToCard,
 * updateCheckItemStateOnCard,
 * updateCustomFieldItem,
 * unconfirmedBoardInvitation,
 * removeMemberFromCard,
 * deleteCard} req
 * @param {*} res
 * @param {*} next
 */

const status = async function (req, res, next) {
    let data = await axios();
    let cards = data.cards;
    let cardsId = [];
    cards.forEach(card => {
        cardsId.push(card.id);
    });
    let newCards = await cards.map(value => ({ ...value, createdDate: getCardsDateById(value.id, data) }));
    let newCardsMapList = await mapListsType(data, newCards);

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

function mapListsType(data, newCards) {
    let allListsName = ["Todo", "In Progress", "Reviewing", "Done", "Classes", "Closed", "General Info", "Templates"];
    let type = ["Info", "Todo", "In_progress", "Done"];
    let listsCategorize = {
        Info: ["General Info", "Templates"],
        Todo: ["Todo"],
        In_progress: ["In Progress", "Reviewing"],
        Done: ["Classes", "Done"]
    };
    let lists = data.lists;
    let newLists = lists.map(function (ele) {
        let category;
        for (listType in listsCategorize) {
            for (i = 0; i < listsCategorize[listType].length; i++) {
                if (ele.name == listsCategorize[listType][i]) {
                    category = listType;
                    break;
                }
            }
        }
        return {
            ...ele,
            type: category
        };
    });

    newCards.forEach(card => {
        for (i = 0; i < newLists.length; i++) {
            if (card.idList == newLists[i].id) {
                card.listType = newLists[i].type;
                card.listName = newLists[i].name;
                console.log(" card.listType:" + card.listType);
                break;
            }
        }
    });
    console.log("mapListsType");
    return newCards;
}

module.exports = {
    status
};
