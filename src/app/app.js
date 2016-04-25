var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var router = require('./Routes');
var browserHistory = require('react-router').browserHistory;
window.React = React;
ReactDOM.render((<Router history={browserHistory}>{router}</Router>), document.getElementById('iloop'));
