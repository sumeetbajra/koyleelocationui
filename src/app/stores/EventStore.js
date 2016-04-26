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
            if(!action.res) {
                console.log('Invalid request.');
            }
            if(!action.res.error) {
                _events = action.res;
            }
            EventStore.emitChange();
            break;

        case ActionTypes.CREATE_EVENT_RESPONSE:
            if(!action.res.error) {
                _events = action.res;
                if(_events.eventFromTimestamp) {
                    localStorage.setItem('payload', {
                        userId:_events.ownerId,
                        fromDate: moment(_events.eventFromTimestamp).format('YYYY/MM/DD'),
                        toDate: moment(_events.eventToTimestamp).format('YYYY/MM/DD'),
                        getAll:true,
                        getHome:true,
                        getOffice:true
                    })
                }
                console.log(_events);
                //location.hash = '/';
            }
            EventStore.emitChange();
            break;


        default:
    }

    return true;
});

module.exports = EventStore;