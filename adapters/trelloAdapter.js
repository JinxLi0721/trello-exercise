const axios = require("../config/axios");

class TrelloAdaptor {
  async getBoard() {
    return await axios();
  }
}

module.exports = {
  trelloAdapter: new TrelloAdaptor(),
}
