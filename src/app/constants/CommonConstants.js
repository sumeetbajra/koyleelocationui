var keyMirror = require('keymirror');

var APIRoot = "http://10.0.1.4:8080/butterfly";
var iloopAPIRoot = "http://s.np.tektak.com:8585";

module.exports = {

    APIEndpoints: {
        GET_EVENTS: APIRoot + '/events/query',
        GET_ROUTE: iloopAPIRoot + '/traffic/route',
        SEARCH_USER: iloopAPIRoot + '/user/search',
        CREATE_EVENT: APIRoot + '/create',
        LOGIN: iloopAPIRoot + '/login',
    },
    AccessToken: 'NGYwYzFkZDNkMTgyNGY4N2E5MTVhMjIzYzBmNDUzY2YkXyQwMmJlNGQzNGIwODY0NDc0YTljYmVhYzhhMTVjZmFkNiRfJDAkXyQx',

    APIHeaders: {
        DEFAULT: {
            'Content-Type': 'application/json'
        },
        FILE_UPLOAD: {
            'Authorization': localStorage.getItem('token')
        }
    },
    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    }),

    Config: keyMirror({
        AUTHORIZATION_TOKEN : localStorage.getItem('token')
    }),

    ActionTypes: keyMirror({
       GET_EVENTS_REQUEST: null,
       GET_EVENTS_RESPONSE: null,
       GET_ROUTES_RESPONSE: null,
       GET_ROUTES_REQUEST: null,
       SELECT_USERS: null,
       SET_MARKERS: null,
       SET_RESET_FALSE: null,
       CREATE_EVENT_REQUEST: null,
       CREATE_EVENT_RESPONSE: null,
       CREATE_USER_SESSION_REQUEST: null,
       CREATE_USER_SESSION_RESPONSE: null
    })

};