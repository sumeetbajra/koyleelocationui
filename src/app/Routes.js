var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var Map = require('./component/Map.react');
var Index = require('./component/Index');
var MapControl = require('./component/MapControl');
var EventCreate = require('./component/EventCreate');

module.exports = (
    <Route path="/" component={Index}>
        <IndexRoute component={MapControl}/>
        <Route path="/plot" component={MapControl}/>
        <Route path="/createEvent" component={EventCreate}/>
    </Route>
);