'use strict';

var http = require('http');

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.ask.skill.3409ffbf-3745-452a-be2e-e292db495362"; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var SERVER_ROOT = "cd54197d.ngrok.io";

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
    handleOnLaunchResponse(response);
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

    // "GetNextEventIntent": function (intent, session, response) {
    //     handleNextEventRequest(intent, session, response);
    // },

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

function handleOnLaunchResponse(response) {
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
}


/**
 * Intent Handlers
 */

function handleRegisterCleaningRequest(intent, session, response) {
  // TODO: sanitize item for other words
  // Send user ID and cleaned item to custom api endpoint
  var userId = session.user.userId
  makePostRequest(SERVER_ROOT, usersPostPath(userId), function(body) {
    var cleanedItem = intent.slots.CleanedItem
    var cardTitle = "Register Cleaning Item";
    var cardOutput = "Butler registered cleaning item: " + cleanedItem.value;
    var speechText = "<p>Affirmative.</p> <p>Will notify you when " + cleanedItem.value + " needs to be cleaned.</p>";
    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    response.tellWithCard(speechOutput, cardTitle, cardOutput);
  })
}

function makePostRequest(url, path, callback) {
    var options = {
        hostname: url,
        method: 'POST',
        path: path
    };
    var req = http.request(options, (response) => {
        callback(response);
    })
    req.end()
}

function usersPostPath(userId) {
  return `/api/v1/users?alexa_id=${userId}`;
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Butler Skill.
    var skill = new ButlerSkill();
    skill.execute(event, context);
};
