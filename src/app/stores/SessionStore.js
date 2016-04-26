var KoyleeDispatcher = require('../dispatcher/KoyleeDispatcher');
var CommonConstants = require('../constants/CommonConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var routes = require('../Routes');
var ActionTypes = CommonConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var SessionStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

SessionStore.dispatchToken = KoyleeDispatcher.register(function(payload) {

    var action = payload.action;

    switch(action.type) {

        case ActionTypes.CREATE_USER_SESSION_RESPONSE:
            if(!action.res.error) {
                localStorage.setItem('token', action.res.response.session.token);
            }
            break;

        default:
    }

    return true;
});

module.exports = SessionStore;