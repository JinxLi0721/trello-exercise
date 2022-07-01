const axios = require("../config/axios");
const moment = require("moment");
const _ = require("lodash");
require("lodash-unwind")({ injected: true });

/**
 *
 * @param {option:
 * labelID:"609f4886d41eeff1faf7ff15",
 * from:"20211026",
 * to:"20220526"} req
 */
const status = async function (req, res, next) {
    let data = await axios();
    let cards = data.cards;
    let cardsId = [];
    cards.forEach(card => {
        cardsId.push(card.id);
    });
    //for filter by date, add cards created date in cardsList
    let newCards = await cards.map(value => ({ ...value, createdDate: getCardsDateById(value.id, data) }));

    // for categorize list status, add listType and listName in cardsList
    let newCardsMapList = await mapListsType(data, newCards);

    res.json(filter(newCardsMapList, req.query.labelID)); // filter by label, return cardsList
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
                break;
            }
        }
    });
    return newCards;
}

function filter(cardsList, labelID) {
    let filterByLabel = filterCardsByLabel(cardsList, labelID);

    return filterByLabel;
}

function filterCardsByLabel(cardsList, labelID) {
    let cardsUnwindByLabel;
    let cardsFilterByLabel;
    if (labelID) {
        cardsUnwindByLabel = _.unwind(cardsList, "idLabels");
        cardsFilterByLabel = _.filter(cardsUnwindByLabel, { idLabels: labelID });
    } else {
        cardsFilterByLabel = cardsList;
        // cardsUnwindByLabel = _.unwind(cardsList, "idLabels", { ignoreNonArray: false });
        // let groupCardsByLabel = _.groupBy(cardsUnwindByLabel, "idLabels");
    }

    return cardsFilterByLabel;
}

module.exports = {
    status
};
