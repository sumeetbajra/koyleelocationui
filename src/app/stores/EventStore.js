var KoyleeDispatcher = require('../dispatcher/KoyleeDispatcher');
var CommonConstants = require('../constants/CommonConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var routes = require('../Routes');
var ActionTypes = CommonConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _events = [];
var _routes = [];

var EventStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getEvents: function() {
        return _events;
    }
});

EventStore.dispatchToken = KoyleeDispatcher.register(function(payload) {

    var action = payload.action;

    switch(action.type) {

        case ActionTypes.GET_EVENTS_RESPONSE:
            if(!action.res.error) {
                _events = action.res;
            }
            EventStore.emitChange();
            break;

        case ActionTypes.CREATE_EVENT_RESPONSE:
            if(!action.res.error) {
                _events = action.res;
                location.hash = '/';
            }
            EventStore.emitChange();
            break;

        default:
    }

    return true;
});

module.exports = EventStore;