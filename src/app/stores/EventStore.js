var KoyleeDispatcher = require('../dispatcher/KoyleeDispatcher');
var CommonConstants = require('../constants/CommonConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var routes = require('../Routes');
var moment = require('moment');
var ActionTypes = CommonConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _events = [];
var _createdEvent = null;
var _routes = [];
var _creating = true;

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
    },

    getCreating: function() {
        return _creating;
    },

    getCreatedEvent: function() {
        return _createdEvent;
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
                _createdEvent = action.res;
                if(_createdEvent.eventFromTimestamp) {
                    localStorage.setItem('payload', JSON.stringify({
                        eventId: _createdEvent.eventId,
                        userId: _createdEvent.ownerId,
                        fromDate: moment(_createdEvent.eventFromTimestamp).format('YYYY/MM/DD'),
                        toDate: moment(_createdEvent.eventToTimestamp).format('YYYY/MM/DD'),
                        getAll:true,
                        getHome:true,
                        getOffice:true
                    }));
                    localStorage.setItem('uuid', _createdEvent.ownerId);
                }
                _creating = false;
                console.log(_createdEvent);
                location.hash = '/';
                setTimeout(function() {
                    window.location.href = '/';
                }, 3000);
            }
            EventStore.emitChange();
            break;

        case ActionTypes.CLEAR_CREATED_EVENT:
            _createdEvent = null;
            EventStore.emitChange();
            break;


        default:
    }

    return true;
});

module.exports = EventStore;