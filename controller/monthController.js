const axios = require("../config/axios");
const moment = require("moment");
const { calendarFormat } = require("moment");
const { type } = require("express/lib/response");

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




const createCard = async function (req, res, next) {
    let result = await axios();
    let actioins = result.actions;

    res.json(caculation("createCard", actioins));

}

const updateCard = async function (req, res, next) {
    let result = await axios();
    let actioins = result.actions;
    // let count = caculation("updateCard", actioins);

    res.json(caculationById("updateCard", actioins, req.params.id));

}
const updateCardAll = async function (req, res, next) {
    let result = await axios();
    let actioins = result.actions;
    // let count = caculation("updateCard", actioins);

    res.json(caculation("updateCard", actioins));

}
const deleteCard = async function (req, res, next) {
    let result = await axios();
    let actioins = result.actions;

    res.json(caculation("deleteCard", actioins));

}

const date = async function (req, res, next) {
    let actioin = req.params.action;
    let result = await axios();
    let actioins = result.actions;
    let allDate = [];

    for (var i = 0; i < actioins.length; i++) {
        if (actioins[i].type == actioin) {
            month = moment(actioins[i].date);
            allDate.push(month);
        }

    }
    res.json(allDate);

}

const card = async function (req, res, next) {
    let re = req.params.id;
    console.log(re + " " + typeof (re))

    let result = await axios();
    let actioins = result.actions;
    let allData = [];

    for (var action of actioins) {
        // if (card.type == "deleteCard") {
        //     allData.push(card);
        //     console.log(card.id + " " + typeof (card.id))
        // }

        if (action.data.card) {
            if (action.data.card.id == re) allData.push(action);
        }
    }
    // for(index of actioins){
    //       Object.keys(index.data.card).forEach(function(key){
    //     console.log(key)
    // })

    res.json(allData);

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

function caculationById(actioin, dataArr, id) {
    let monthCount = [];
    let updateType = [];
    let count = 0;
    let month, lastMonth;
    let key;

    for (var i = 0; i < dataArr.length; i++) {
        month = moment(dataArr[i].date);
        if (i == 0) {
            lastMonth = month;
        }

        if (dataArr[i].data.card) {
            if (dataArr[i].data.card.id == id) {
                if (dataArr[i].type == actioin) {
                    if (month.isSame(lastMonth, "month")) {
                        count++;
                        updateType.push({ type: dataArr[i].data.old });
                        // console.log(month.format("YYYY-MM") + " " + count)
                        // console.log(dataArr[i].data.old)

                    } else {
                        key = lastMonth.format("YYYY-MM");
                        // console.log(lastMonth.format("YYYY-MM") + " con:" + count)
                        monthCount.push({ YYMM: key, count, old: updateType });
                        count = 1;
                        updateType = [];
                        updateType.push({ type: dataArr[i].data.old });
                        lastMonth = month;
                    }
                }
            }
        }

        if (i == dataArr.length - 1) {
            key = lastMonth.format("YYYY-MM");
            // console.log(lastMonth.format("YYYY-MM") + " con:" + count)
            monthCount.push({ YYMM: key, count, old: updateType });

        }
    }
    return monthCount
}

module.exports = {
    createCard,
    updateCard,
    deleteCard,
    updateCardAll,
    card,
    date
}