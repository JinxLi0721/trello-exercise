const axios = require("axios");
const debug = require('debug');
const debugLog = debug('trello:axios');
const errorLog = debug('trello:axios:error');

/**
 * Objective: make this file as a simple axios client
 */

const axiosGet = async (url) => {
  try {
    const response =  await axios.get(url);
    debugLog(`statusCode: ${response.status}`);

    return response.data;
  } catch (error) {
    errorLog('Request error', error);

    throw error;
  }
};

module.exports = axiosGet;
