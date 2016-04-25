var KoyleeDispatcher = require('../dispatcher/KoyleeDispatcher');
var CommonConstants = require('../constants/CommonConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var routes = require('../Routes');
var ActionTypes = CommonConstants.ActionTypes;
var CHANGE_EVENT = 'change';
var _joinEventAfterLogin = false;
var _afterLoginEvent = false;

var RouteStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getRouter : function(){
        return routes;
    }
});

RouteStore.dispatchToken = KoyleeDispatcher.register(function(payload) {

    var action = payload.action;

    switch(action.type) {

        default:
    }

    return true;
});

module.exports = RouteStore;