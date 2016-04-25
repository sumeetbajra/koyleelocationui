var KoyleeDispatcher = require('../dispatcher/KoyleeDispatcher.js');
var CommonConstants = require('../constants/CommonConstants.js');
var WebAPIUtils = require('../utils/WebAPIUtils.js');

var ActionTypes = CommonConstants.ActionTypes;

module.exports = {
    getEvents: function(payload) {
        KoyleeDispatcher.handleViewAction({
            type: ActionTypes.GET_EVENTS_REQUEST,
            payload: payload
        });
        WebAPIUtils.getEvents(payload, this.getEventsResponse);
    },

    getEventsResponse: function(res, err) {
        KoyleeDispatcher.handleServerAction({
            type: ActionTypes.GET_EVENTS_RESPONSE,
            res: res,
            err: err
        });
    },

    getRoutes: function(payload) {
        KoyleeDispatcher.handleViewAction({
            type: ActionTypes.GET_ROUTES_REQUEST,
            payload: payload
        });
        WebAPIUtils.getRoutes(payload, this.getRoutesResponse, 0, []);
    },

    getRoutesResponse: function(res, err) {
        KoyleeDispatcher.handleServerAction({
            type: ActionTypes.GET_ROUTES_RESPONSE,
            res: res,
            err: err
        });
    },

    selectUsers: function(users) {
        KoyleeDispatcher.handleViewAction({
            type: ActionTypes.SELECT_USERS,
            users: users
        });
    },

    setMarkers: function(markers) {
        KoyleeDispatcher.handleViewAction({
            type: ActionTypes.SET_MARKERS,
            markers: markers
        });
    },

    setResetFalse: function() {
        KoyleeDispatcher.handleViewAction({
            type: ActionTypes.SET_RESET_FALSE
        });
    },

};