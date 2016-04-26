var KoyleeDispatcher = require('../dispatcher/KoyleeDispatcher.js');
var CommonConstants = require('../constants/CommonConstants.js');
var WebAPIUtils = require('../utils/WebAPIUtils.js');

var ActionTypes = CommonConstants.ActionTypes;

module.exports = {
    createUserSession: function(payload) {
        KoyleeDispatcher.handleViewAction({
            type: ActionTypes.CREATE_USER_SESSION_REQUEST,
            payload: payload
        });
        WebAPIUtils.createUserSession(payload, this.createUserSessionResponse);
    },

    createUserSessionResponse: function(res, err) {
        KoyleeDispatcher.handleServerAction({
            type: ActionTypes.CREATE_USER_SESSION_RESPONSE,
            res: res,
            err: err
        });
    }
};