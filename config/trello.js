require('dotenv').config();

const env = (key, defaultValue) =>
  typeof process.env[key] === 'undefined' ?
  defaultValue : process.env[key];

module.exports = {
  key: env('TRELLO_KEY'),
  token: env('TRELLO_TOKEN'),
  boardId: env('TRELLO_BOARD_ID'),
};
