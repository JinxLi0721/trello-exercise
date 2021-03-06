const axios = require("axios");
const url = 'https://api.trello.com/1/boards/609f488638122f7a82bf31b4?key=e4ca0224f7ed7ba9dceac38b122ef10e&token=22dc795b770cc5fe1a66ee042ebd69caec1a8276917963e6ececd5ac20263ccd&fields=all&actions=all&action_fields=all&actions_limit=1000&cards=all&card_fields=all&card_attachments=true&labels=all&lists=all&list_fields=all&members=all&member_fields=all&checklists=all&checklist_fields=all&organization=false';

let axiosGet = async () => {
  let response = await axios.get(url)
    .then(res => {
      console.log(`statusCode: ${res.status}`)
      return { statusCode: res.status, data: res.data };
    })
    .catch(error => {
      return { statusCode: res.status, data: error };
    })
  return response;
};

module.exports = axiosGet;