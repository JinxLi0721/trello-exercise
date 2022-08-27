const axiosGet = require("../config/axios");

class TrelloAdaptor {
  constructor(boardId) {
    this.boardId = boardId;
  }

  async getBoard() {
    const url = `https://api.trello.com/1/boards/${this.boardId}?key=e4ca0224f7ed7ba9dceac38b122ef10e&token=22dc795b770cc5fe1a66ee042ebd69caec1a8276917963e6ececd5ac20263ccd&fields=all&actions=all&action_fields=all&actions_limit=1000&cards=all&card_fields=all&card_attachments=true&labels=all&lists=all&list_fields=all&members=all&member_fields=all&checklists=all&checklist_fields=all&organization=false`;
    return await axiosGet(url);
  }
}

const BOARD_ID = '609f488638122f7a82bf31b4';

module.exports = {
  trelloAdapter: new TrelloAdaptor(BOARD_ID),
}
