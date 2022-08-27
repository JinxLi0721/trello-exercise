const axios = require("axios");

/**
 * Objective: make this file as a simple axios client
 */

let axiosGet = async (url) => {
  let response =  await axios.get(url)
    .then(res => {
      console.log(`statusCode: ${res.status}`)
      return res.data;
    })
    .catch(error => {
      console.error('Request error', error);
      throw error;
    });

  return response;
};

module.exports = axiosGet;
