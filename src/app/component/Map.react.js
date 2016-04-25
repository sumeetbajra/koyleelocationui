var React = require('react');
var EventRouteStore = require('../stores/EventRouteStore');
var MapActionCreators = require('../actions/MapActionCreators');


var Map = React.createClass({

    getInitialState: function() {
        return {
            routes: [],
            map: null,
            markers: [],
            polyline: [],
            users: this.props.users,
            loading: true
        };
    },

    componentDidMount: function() {
        EventRouteStore.addChangeListener(this.onChange);
         var myLatLng = {lat: 28, lng: 84};
         
        // Create a map object and specify the DOM element for display.
        window.map = new google.maps.Map(document.getElementsByClassName('mapBox')[0], {
            center: myLatLng,
            scrollwheel: true,
            zoom: 12
        });
          
        this.initializeMap(); 
        var that = this;
    },

    initializeMap: function() {
       

        this.setState({
            map: window.map
        })
    },

    componentWillUnmount: function() {
        EventRouteStore.removeChangeListener(this.onChange);
    },

    onChange: function() {
        var routes = EventRouteStore.getRoutes();
        var users = EventRouteStore.getUsers();
        var markers = EventRouteStore.getMarkers();
        var that = this;

        if(this.state.polyline.length) {
            this.state.polyline.filter(function(obj) { 
                if(users.indexOf(Object.keys(obj)[0]) == -1) {
                    obj[Object.keys(obj)[0]].setMap(null);
                }else {
                    obj[Object.keys(obj)[0]].setMap(window.map);
                }
            });  
            this.state.markers.filter(function(obj) {
                if(users.indexOf(obj.userId) == -1) {
                    for (var i = obj.markers.length - 1; i >= 0; i--) {
                        obj.markers[i].setMap(null);
                    }
                }else {
                    for (var i = obj.markers.length - 1; i >= 0; i--) {
                        obj.markers[i].setMap(window.map);
                    }
                }
            }); 
        }else if(!$.isEmptyObject(routes)) {
            for (var user in routes) {
                if (routes.hasOwnProperty(user)) {
                     function hashCode(str) { // java String#hashCode
                        var hash = 0;
                        for (var i = 0; i < str.length; i++) {
                            hash = str.charCodeAt(i) + ((hash << 3) - hash);
                        }
                        return hash;
                    } 
                    function intToRGB(i){
                        var c = (i & 0x00FFFFFF)
                        .toString(16)
                        .toUpperCase();

                        return "00000".substring(0, 6 - c.length) + c;
                    }
                    var color = intToRGB(hashCode(user));
                    var lineSymbol = {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                    };
                    var flightPath = new google.maps.Polyline({
                        path: routes[user],
                        geodesic: true,
                        icons: [{
                            icon: lineSymbol,
                            offset: '0%'
                        }],
                        strokeColor: '#' + color,
                        strokeOpacity: 1.0,
                        strokeWeight: 5
                    });

                    animateCircle(flightPath);

                    // Use the DOM setInterval() function to change the offset of the symbol
                    // at fixed intervals.
                    function animateCircle(line) {
                        var count = 0;
                        window.setInterval(function() {
                            count = (count + 1) % 200;

                            var icons = line.get('icons');
                            icons[0].offset = (count / 2) + '%';
                            line.set('icons', icons);
                        }, 200);
                    }

                    this.setState({
                        polyline: this.state.polyline.concat({
                            [user]: flightPath
                        })
                    });

                    flightPath.setMap(window.map);
                }
            }
            this.setState({
                loading: false
            })
        }
    },

    hashCode: function(str) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 3) - hash);
        }
        return hash;
    }, 

    intToRGB: function(i){
        var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

        return "00000".substring(0, 6 - c.length) + c;
    },

    componentWillReceiveProps: function(nextProps) {
        this.props = nextProps;
        var that = this;
        var flightPlanCoordinates = [];
        var markers = [];
        var routes = [];
        var users = [];
        var uniqueLocations = [];
        this.setState({
            routes: []
        });
         var oms = new OverlappingMarkerSpiderfier(window.map);
        var iw = new google.maps.InfoWindow();
        for (var i = this.state.markers.length - 1; i >= 0; i--) {
            for (var i = this.state.markers[i].markers.length - 1; i >= 0; i--) {
                try {
                    this.state.markers[i].markers[i].setMap(null);
                }catch(e) {

                }
            }
        }
        for (var user in this.props.locations) {

            if (this.props.locations.hasOwnProperty(user)) {

                var locations = this.props.locations[user];
                var userId = JSON.parse(user).userId;
                var that = this;
                var markers = [];
                locations.map((location, key) => {

                    if(location.eventLocation) {

                        var latlng = {lat: location.eventLocation.lat, lng: location.eventLocation.lon};
                        var color = that.intToRGB(that.hashCode(userId));
                        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
                        new google.maps.Size(21, 34),
                        new google.maps.Point(0,0),
                        new google.maps.Point(10, 34));
                        var userName = JSON.parse(user).firstName + ' ' + JSON.parse(user).lastName;
                        var details = '<b>User Id: </b>' + JSON.parse(user).userId + '<br><b>UserName: </b>' + userName + '<br><b>Event Id: </b>' + location.eventId + '<br><b>Event Type: </b>' + location.eventTitle + '<br><b>Event Description: </b>' + location.eventDescription + '<br><b>From Time: </b>' + new Date(location.eventFromTimestamp) + '<br><b>To Time: </b>' + new Date(location.eventToTimestamp) + '<br><b>Location Name: </b>' + location.eventLocation.locationName;
                        var marker = new google.maps.Marker({
                            position: latlng,
                            icon: pinImage,
                            map: window.map,
                            desc: details
                        });
                        markers.push(marker);
                        routes.push({
                            lat: latlng.lat,
                            lng: latlng.lng,
                            userId: userId
                        });

                        // $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng.lat + ',' + latlng.lng + '&sensor=true&key=AIzaSyD_PMngfQdz4aqdxaQN_2QheHNK11eyc08', function(res, err) {
                           
                               
                                oms.addListener('click', function(marker, event) {
                                    iw.setContent(marker.desc);
                                    iw.open(window.map, marker);
                                });
                                oms.addMarker(marker);
                                //that.setInfoWindow(details, marker, window.map);
                            // }
                        // });
                        uniqueLocations = uniqueLocations.concat(location.eventId);
                    }
                });
                (function(m) {
                    var markers = that.state.markers;
                    markers.push({
                        userId: userId,
                        markers: m
                    })
                    that.setState({
                        markers: markers
                    })
                })(markers);
            } 
        } 

        setTimeout(function() {
            MapActionCreators.getRoutes(routes); 
        }, 0);     

        // Try W3C Geolocation (Preferred)
        if(navigator.geolocation) {
            var browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function(position) {
                var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                window.map.setCenter(initialLocation);
            }, function() {
                that.handleNoGeolocation(browserSupportFlag);
            });
        }
    },

    handleNoGeolocation: function(flag) {

    },

    setInfoWindow: function(details, marker, map) {
        var infowindow = new google.maps.InfoWindow({
            content: details
        });

        marker.addListener('mouseover', function() {
            infowindow.open(map, marker);
        });

        // assuming you also want to hide the infowindow when user mouses-out
        marker.addListener('mouseout', function() {
            infowindow.close();
        });

    },

    render: function() {
        return (
            <span>
                <div className="mapBox" style={{height: '100vh'}}>
                </div>
                {this.state.loading && <div id="loading">
                    <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw margin-bottom"></i> Loading
                </div>}
            </span>
        );
    }

});

module.exports = Map;