'use strict';

var http = require('http');

var SERVER_ROOT = "a2c15d4d.ngrok.io";
var PATH_ROOT = "/api/v1"

let alexaId = "amzn1.ask.account.AEV4NLDBR4AIEB55QJYBOCSNX3QRE533OHT72UK4OAX5GBJTEORIRMG3MFLF2PNQ4KXNA3OTLK6GOLE2G6D3XWUXDJQ3XNCKGL5MIYMXOTVVN5LOVVIRMFGMPZIOAXPBEZX2IYGL4DWGTGA5E3DWRNVBFGTIKUM5OR3H3ZGXBOD6K3TGQI7WNP3VPLE3OPTEZ5RSFUHN6IK7YJA"
let queryItem = "bedsheets"

makeGetRequest(SERVER_ROOT, itemsPath(alexaId, queryItem), function(body) {
  console.log(body)
  // TODO: Error handling! Need to check status code
  var response = JSON.parse(body)
  // Take first item for now
  var firstItem = response.data[0]

  let itemFullName = (firstItem.modifier + " " + firstItem.type).trim();
  console.log(itemFullName)
  console.log(firstItem.expiration_date)
  // var cardTitle = "Butler queried: " + itemFullName;
  // var cardOutput = "Butler queried item: " + itemFullName;
  // var speechText = "Your " + itemFullName + " will expire on: " + firstItem.expiration_date;
  // var speechOutput = {
  //     speech: "<speak>" + speechText + "</speak>",
  //     type: AlexaSkill.speechOutputType.SSML
  // };
  // response.tellWithCard(speechOutput, cardTitle, cardOutput);
})

function makePostRequest(url, path, callback) {
  makeRequest(url, path, "POST", callback);
}

function makeGetRequest(url, path, callback) {
  makeRequest(url, path, "GET", callback);
}

function makeRequest(url, path, method, callback) {
  // Remove spaces from path
  var sanitizedPath = path.replace(/\s+/g, '');
  var options = {
      hostname: url,
      method: method,
      path: sanitizedPath
  };
  var req = http.request(options, (res) => {
    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      callback(body);
    });
  })
  req.end()
}

// Path Helpers
function usersPostPath(alexaId) {
  return `${PATH_ROOT}/users?alexa_id=${alexaId}`;
}

function itemsPath(alexaId, item) {
  return `${PATH_ROOT}/items?alexa_id=${alexaId}&item=${item}`;
}
