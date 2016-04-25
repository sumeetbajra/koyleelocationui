var KoyleeDispatcher = require('../dispatcher/KoyleeDispatcher');
var CommonConstants = require('../constants/CommonConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var routes = require('../Routes');
var ActionTypes = CommonConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _routes = [];
var _users = [];
var _markers = [];
var _reset = false;

var EventRouteStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getRoutes: function() {
        return _routes;
    },

    getUsers: function() {
        return _users;
    }, 

    getMarkers: function() {
        return _markers;
    },

    getResetStatus: function() {
        return _reset;
    },
});

EventRouteStore.dispatchToken = KoyleeDispatcher.register(function(payload) {

    var action = payload.action;

    switch(action.type) {

         case ActionTypes.GET_ROUTES_REQUEST:
           _reset = true;
            EventRouteStore.emitChange();
            break;

        case ActionTypes.GET_ROUTES_RESPONSE:
            _routes = action.res;
            EventRouteStore.emitChange();
            break;

        case ActionTypes.SELECT_USERS: 
            _users = action.users;
            EventRouteStore.emitChange();
            break;

        case ActionTypes.SET_MARKERS: 
            _markers = action.markers;
            EventRouteStore.emitChange();
            break;

        case ActionTypes.SET_RESET_FALSE:
            localStorage.setItem('reset', true);
            break;

        default:
    }

    return true;
});

module.exports = EventRouteStore;