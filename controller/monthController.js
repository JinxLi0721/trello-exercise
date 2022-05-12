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
    let actioins = result.data.actions;
    if (req.query.start && req.query.end) {
        let response = calculateBetweenTime("createCard", actioins, req.query.start, req.query.end);

        res.json({ statusCode: result.statusCode, data: response });
    } else {
        let response = calculation("createCard", actioins);

        res.json({ statusCode: result.statusCode, data: response });
    }

}

const updateCard = async function (req, res, next) {
    let result = await axios();
    let actioins = result.data.actions;
    // let count = caculation("updateCard", actioins);
    let response = calculationById("updateCard", actioins, req.params.id)

    res.json({ statusCode: result.statusCode, data: response });

}
const updateCardAll = async function (req, res, next) {
    let result = await axios();
    let actioins = result.data.actions;
    if (req.query.start && req.query.end) {
        let response = calculateBetweenTime("updateCard", actioins, req.query.start, req.query.end);

        res.json({ statusCode: result.statusCode, data: response });
    } else {
        let response = calculation("updateCard", actioins);

        res.json({ statusCode: result.statusCode, data: response });
    }
}
const deleteCard = async function (req, res, next) {
    let result = await axios();
    let actioins = result.data.actions;
    let response = calculation("deleteCard", actioins);
    res.json({ statusCode: result.statusCode, data: response });

}

const date = async function (req, res, next) {
    let actioin = req.params.action;
    let result = await axios();
    let actioins = result.data.actions;
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
    let actioins = result.data.actions;
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

function calculation(actioin, data) {
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

function calculationById(actioin, dataArr, id) {
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

function calculateBetweenTime(actioin, data, start, end) {
    let monthCountHaveCards = [];
    let monthCount = [];
    let startMon = moment(start);
    let interval = moment(end).diff(moment(start), "month");

    for (m = 0; m < interval + 1; m++) {
        var key = startMon.format("YYYY-MM");
        monthCountHaveCards.push({ YYMM: key, cards: [], count: 0 });
        monthCount.push({ YYMM: key, count: 0 });
        startMon = startMon.add(1, "M");
    }

    for (let card of data) {
        if (moment(card.date).isBefore(moment(start), "month")) break;
        // if (moment(card.date).isAfter(moment(end)), "month") {
        //     console.log("conttinue")
        //     continue;

        // }
        if (card.type == actioin) {
            for (let rc of monthCountHaveCards) {
                if (rc.YYMM == moment(card.date).format("YYYY-MM")) {
                    rc.cards.push(card);
                }
            }

        }

    }
    for (let rc of monthCountHaveCards) {
        rc.count = rc.cards.length;
    }
    for (i = 0; i < monthCountHaveCards.length; i++) {
        monthCountHaveCards[i].count = monthCountHaveCards[i].cards.length;
        monthCount[i].count = monthCountHaveCards[i].count;
    }

    return monthCount;

}

module.exports = {
    createCard,
    updateCard,
    deleteCard,
    updateCardAll,
    card,
    date
}