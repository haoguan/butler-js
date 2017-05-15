'use strict';

var http = require('http');

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.3409ffbf-3745-452a-be2e-e292db495362"; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var SERVER_ROOT = "7a56cbbf.ngrok.io";
var PATH_ROOT = "/api/v1"

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');


/**
 * ButlerSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var ButlerSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

/**
 * INITIALIZERS
 */

ButlerSkill.prototype = Object.create(AlexaSkill.prototype);
ButlerSkill.prototype.constructor = ButlerSkill;

/**
 * EVENT HANDLERS
 */

ButlerSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("ButlerSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

ButlerSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("ButlerSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleOnLaunchResponse(session, response);
};

ButlerSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

/**
 * INTENT HANDLERS
 */


ButlerSkill.prototype.intentHandlers = {

    "RegisterCleaningIntent": function (intent, session, response) {
        handleRegisterCleaningRequest(intent, session, response);
    },

    "RegisterReplaceIntent": function (intent, session, response) {
        handleRegisterReplaceRequest(intent, session, response);
    },

    "RegisterPerishableIntent": function (intent, session, response) {
        handleRegisterPerishableRequest(intent, session, response);
    },

    "QueryItemIntent": function (intent, session, response) {
        handleQueryItemRequest(intent, session, response);
    },

    "StatusUpdateIntent": function (intent, session, response) {
        handleStatusUpdateRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "<s>Butler sir, is your human reminder system.</s>" +
            "<s>For example, ask me to log an item by saying, I just replaced my toothbrush.</s>" +
            "<s>Or, get a status check by saying, how's my toothbrush?</s>";
        var repromptText = "What is your command sire?";

        var speechOutput = {
            speech: "<speak>" + speechText + "</speak>",
            type: AlexaSkill.speechOutputType.SSML
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "As you wish, sire.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    // Great for cancelling something that got added.
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "As you wish, sire.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }
};

/**
 * EVENT HANDLERS
 */

/**
 * Function to handle the onLaunch skill behavior
 */

function handleOnLaunchResponse(session, response) {
  var alexaId = session.user.userId
  makePostRequest(SERVER_ROOT, usersPostPath(alexaId), function(body) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var cardTitle = "Butler Requested";
    var cardOutput = "Butler, at your service";

    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "<p>Anything you would like me to hear the status of?</p> <p>Or perhaps something new to keep track of?</p>";
    var speechText = "<p>Butler.</p> <p>At your service</p>";
    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
  })
}


/**
 * Intent Handlers
 */

function handleRegisterCleaningRequest(intent, session, response) {
  // TODO: sanitize item for other words (e.g. pronouns, articles, etc)
  var alexaId = session.user.userId
  var cleanedItem = intent.slots.CleanedItem

  makePostRequest(SERVER_ROOT, itemsPath(alexaId, cleanedItem.value), function(body) {
    var cardTitle = "Butler registered: " + cleanedItem.value;
    var cardOutput = "Butler registered cleanable item: " + cleanedItem.value;
    var speechText = "<p>Okay.</p> Registered " + cleanedItem.value;
    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, cardTitle, cardOutput);
  })
}

function handleRegisterReplaceRequest(intent, session, response) {
  // TODO: sanitize item for other words (e.g. pronouns, articles, etc)
  var alexaId = session.user.userId
  var replacedItem = intent.slots.ReplacedItem

  makePostRequest(SERVER_ROOT, itemsPath(alexaId, replacedItem.value), function(body) {
    var cardTitle = "Butler registered: " + replacedItem.value;
    var cardOutput = "Butler registered replaceable item: " + replacedItem.value;
    var speechText = "<p>Okay.</p> Registered " + replacedItem.value;
    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, cardTitle, cardOutput);
  })
}

function handleRegisterPerishableRequest(intent, session, response) {
  // TODO: sanitize item for other words (e.g. pronouns, articles, etc)
  var alexaId = session.user.userId
  var perishableItem = intent.slots.PerishableItem

  makePostRequest(SERVER_ROOT, itemsPath(alexaId, perishableItem.value), function(body) {
    var cardTitle = "Butler registered: " + perishableItem.value;
    var cardOutput = "Butler registered perishable item: " + perishableItem.value;
    var speechText = "<p>Okay.</p> Registered " + perishableItem.value;
    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, cardTitle, cardOutput);
  })
}

function handleQueryItemRequest(intent, session, response) {
  // TODO: sanitize item for other words (e.g. pronouns, articles, etc)
  var alexaId = session.user.userId
  var queryItem = intent.slots.QueryItem

  makeGetRequest(SERVER_ROOT, itemsPath(alexaId, queryItem.value), function(body) {
    // TODO: Error handling! Need to check status code
    var bodyObj = JSON.parse(body)
    // Take first item for now
    var firstItem = bodyObj.data[0]

    let itemFullName = (firstItem.modifier + " " + firstItem.type).trim();
    var cardTitle = "Butler queried: " + itemFullName;
    var cardOutput = "Butler queried item: " + itemFullName;
    var speechText = "Your " + itemFullName + " will expire " + firstItem.expiration_string;
    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, cardTitle, cardOutput);
  })
}

function handleStatusUpdateRequest(intent, session, response) {
    // TODO: sanitize item for other words (e.g. pronouns, articles, etc)
    var alexaId = session.user.userId

    makeGetRequest(SERVER_ROOT, statusPath(alexaId), function(body) {
      var bodyObj = JSON.parse(body)
      var speechText = "Here are your action items: "
      for (let item of bodyObj.data) {
        let itemFullName = `${item.modifier} ${item.type}`.trim();
        speechText = `${speechText} ${itemFullName} will expire ${item.expiration_string}.`
      }

      var cardTitle = "Butler status update";
      var cardOutput = "Butler status update: " + speechText;

      var speechOutput = {
          speech: "<speak>" + speechText + "</speak>",
          type: AlexaSkill.speechOutputType.SSML
      };

      response.tellWithCard(speechOutput, cardTitle, cardOutput);
    })
}

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
      method: method,
      path: sanitizedPath
  };
  var req = http.request(options, (response) => {
    var body = '';
    // Concat data in chunks and callback only when complete!
    response.on('data', function(chunk) {
      body += chunk;
    });
    response.on('end', function() {
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

function statusPath(alexaId) {
  return `${PATH_ROOT}/items?alexa_id=${alexaId}&status=1`;
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Butler Skill.
    var skill = new ButlerSkill();
    skill.execute(event, context);
};
