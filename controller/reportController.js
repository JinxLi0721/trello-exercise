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
    let newCards = cards.map(value => ({ ...value, createdDate: getCardsDateById(value.id, data) }));

    res.json(newCards);
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

module.exports = {
    status
};
