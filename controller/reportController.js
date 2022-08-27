const moment = require("moment");
const _ = require("lodash");
const { trelloAdapter } = require('../adapters/trelloAdapter');
require("lodash-unwind")({ injected: true });

/**
 *
 * @param {option:
 * labelID:"609f4886d41eeff1faf7ff15",
 * from:"20211026",
 * to:"20220526"} req
 */
const status = async function (req, res, next) {
    let board = await trelloAdapter.getBoard();
    let cards = board.cards;

    //for filter by date, add cards created date in cardsList
    let newCards = await cards.map(card => ({
        ...card,
        createdDate: getCardCreatedDate(card.id, board.actions),
    }));

    // for categorize list status, add listType and listName in cardsList
    let newCardsMapList = await mapListsStatus(board, newCards);
    const statusReport = filter(
        newCardsMapList,
        req.query.labelID,
        req.query.from,
        req.query.to
    );

    res.json(statusReport); // filter by label and date, return count of cards in every list status
};

function getCardCreatedDate(cardId, actions) {
    const card = actions.find(action =>
      (action.type == "createCard" || action.type == "copyCard") &&
      action.data.card.id == cardId
    );

    return card.date;
}

function mapListsStatus(board, newCards) {
    let allListsName = ["Todo", "In Progress", "Reviewing", "Done", "Classes", "Closed", "General Info", "Templates"];
    let status = ["Info", "Todo", "In_progress", "Done"];
    let listsCategorize = {
        Info: ["General Info", "Templates"],
        Todo: ["Todo"],
        In_progress: ["In Progress", "Reviewing"],
        Done: ["Classes", "Done"]
    };
    let lists = board.lists;
    let newLists = lists.map(function (list) {
        let category;
        for (listStatus in listsCategorize) {
            for (i = 0; i < listsCategorize[listStatus].length; i++) {
                if (list.name == listsCategorize[listStatus][i]) {
                    category = listStatus;
                    break;
                }
            }
        }
        return {
            ...list,
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

function filter(cardsList, labelID, sDate, eDate) {
    let filterByLabel = filterCardsByLabel(cardsList, labelID);
    let filterByDate = filterCardsByDate(filterByLabel, sDate, eDate);
    let cardsCount = calculateCardsNumber(filterByDate);

    return cardsCount;
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

function filterCardsByDate(cardsList, sDate, eDate) {
    let cardsFilterByDate;
    if (!sDate && !eDate) {
        return cardsList;
    }

    let sortArr = _.sortBy(cardsList, function (o) {
        return o.createdDate;
    });
    let start = sDate ? moment(sDate) : sortArr[0].createdDate;
    let end = eDate ? moment(eDate) : moment();
    cardsFilterByDate = _.filter(sortArr, function (card) {
        return moment(card.createdDate).isBetween(start, end);
    });
    return cardsFilterByDate;
}

function calculateCardsNumber(cardsList) {
    let groupObj = _.groupBy(cardsList, "listStatus");
    let countObj = {};
    for (key in groupObj) {
        countObj[key] = groupObj[key].length;
    }

    return countObj;
}

module.exports = {
    status
};
