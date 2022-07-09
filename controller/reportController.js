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
    let result = await axios();
    let cards = result.cards;
    let actions = result.actions;

    res.json(actions[0]);

}


function caculation(actioin, data) {
    let monthCount = [];
    let count = 0;
    let month, lastMonth;
    let key;

    for (var i = 0; i < data.length; i++) {
        month = moment(data[i].date);
        if (i == 0) {
            lastMonth = month;
        }
        if (data[i].type == actioin) {
            if (month.isSame(lastMonth, "month")) {
                count++;
                // console.log(month.format("YYYY-MM") + " " + count)

            } else {
                key = lastMonth.format("YYYY-MM");
                // console.log(lastMonth.format("YYYY-MM") + " con:" + count)
                monthCount.push({ YYMM: key, count });
                count = 1;
                lastMonth = month;
            }
        }
        if (i == data.length - 1) {
            key = lastMonth.format("YYYY-MM");
            // console.log(lastMonth.format("YYYY-MM") + " con:" + count)
            monthCount.push({ YYMM: key, count });
        }
    }
    return monthCount
}


module.exports = {
   status
}