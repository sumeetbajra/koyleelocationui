var Dispatcher = require('flux').Dispatcher;
var CommonConstants = require('../constants/CommonConstants.js');
var PayloadSources = CommonConstants.PayloadSources;
var assign = require('object-assign');

var KoyleeDispatcher = assign(new Dispatcher(), {

    handleServerAction: function(action) {
        var payload = {
            source: PayloadSources.SERVER_ACTION,
            action: action
        };
        this.dispatch(payload);
    },

    handleViewAction: function(action) {
        var payload = {
            source: PayloadSources.VIEW_ACTION,
            action: action
        };
        this.dispatch(payload);
    }
});


module.exports = KoyleeDispatcher;