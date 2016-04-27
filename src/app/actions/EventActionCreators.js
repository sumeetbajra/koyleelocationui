var KoyleeDispatcher = require('../dispatcher/KoyleeDispatcher.js');
var CommonConstants = require('../constants/CommonConstants.js');
var WebAPIUtils = require('../utils/WebAPIUtils.js');

var ActionTypes = CommonConstants.ActionTypes;

module.exports = {
    createEvent: function(payload) {
        KoyleeDispatcher.handleViewAction({
            type: ActionTypes.CREATE_EVENT_REQUEST,
            payload: payload
        });
        WebAPIUtils.createEvent(payload, this.createEventResponse);
    },

    createEventResponse: function(res, err) {
        KoyleeDispatcher.handleServerAction({
            type: ActionTypes.CREATE_EVENT_RESPONSE,
            res: res,
            err: err
        });
    },

    clearCreatedEvent: function() {
        KoyleeDispatcher.handleViewAction({
            type: ActionTypes.CLEAR_CREATED_EVENT,
        }); 
    }
};