'use strict';

var http = require('http');

var SERVER_ROOT = "limitless-wave-31173.herokuapp.com";
var PATH_ROOT = "/api/v1"

let alexaId = "amzn1.ask.account.AEV4NLDBR4AIEB55QJYBOCSNX3QRE533OHT72UK4OAX5GBJTEORIRMG3MFLF2PNQ4KXNA3OTLK6GOLE2G6D3XWUXDJQ3XNCKGL5MIYMXOTVVN5LOVVIRMFGMPZIOAXPBEZX2IYGL4DWGTGA5E3DWRNVBFGTIKUM5OR3H3ZGXBOD6K3TGQI7WNP3VPLE3OPTEZ5RSFUHN6IK7YJA"
let postItem = "bottled ketchup"

// makePostRequest(SERVER_ROOT, usersPostPath(alexaId), function(body) {
//   // console.log(itemFullName)
// });

// makePostRequest(SERVER_ROOT, itemsPath(alexaId, postItem), function(body) {
// })

makeGetRequest(SERVER_ROOT, statusPath(alexaId), function(statusCode, body) {
  console.log(statusCode)
  console.log(statusCode == 200)
  if (statusCode == 200 || statusCode == 201) {
    console.log("WORKS")
  } else {
    console.log("FAILS")
  }
  // TODO: Error handling! Need to check status code
  var response = JSON.parse(body)
  // Take first item for now
  var firstItem = response.data[0]

  let itemFullName = (firstItem.modifier + " " + firstItem.type).trim();
  console.log(itemFullName)
  console.log(firstItem.expiration_string)
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
  // Replace spaces from path with +
  var sanitizedPath = path.replace(/\s+/g, '+');
  var options = {
      hostname: url,
      port: 80,
      method: method,
      path: sanitizedPath
  };
  console.log(options)
  var req = http.request(options, (response) => {
    var body = '';
    // Concat data in chunks and callback only when complete!
    response.on('data', function(chunk) {
      body += chunk;
    });
    response.on('end', function() {
      callback(response.statusCode, body);
    });
  })
  req.end()
}

// Path Helpers
function usersPostPath(alexaId) {
  return `${PATH_ROOT}/users?alexa_id=${alexaId}`;
}

function itemsCreatePath(alexaId, item, expiration) {
  return `${PATH_ROOT}/items?alexa_id=${alexaId}&item=${item}&expiration=${expiration}`;
}

function itemsGetPath(alexaId, item) {
  return `${PATH_ROOT}/items?alexa_id=${alexaId}&item=${item}`;
}

function statusPath(alexaId) {
  return `${PATH_ROOT}/status?alexa_id=${alexaId}`;
}

function handleAPIError(response) {
  var speechText = "Something unexpected happened. Please try again.";
  var speechOutput = {
      speech: "<speak>" + speechText + "</speak>",
      type: AlexaSkill.speechOutputType.SSML
  };
  response.tell(speechOutput);
}
