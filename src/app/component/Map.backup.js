var React = require('react');

var MapActionCreators = require('../actions/MapActionCreators');


var Map = React.createClass({

    getInitialState: function() {
        return {
            activeColor: '#4CAF50'
        };
    },

    componentWillReceiveProps: function(nextProps) {

        this.props = nextProps;
        var that = this;
        var flightPlanCoordinates = [];

        var myLatLng = {lat: 28, lng: 84};

        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementsByClassName('mapBox')[0], {
            center: myLatLng,
            scrollwheel: true,
            zoom: 12
        });
        var users = [];
        for (var user in this.props.locations) {

            if (this.props.locations.hasOwnProperty(user) && this.props.users.indexOf(user) > -1) {

                var locations = this.props.locations[user];
                var userId = user;
                var that = this;

                locations.map((location, key) => {

                    if(location.eventLocation) {

                        var latlng = {lat: location.eventLocation.lat, lng: location.eventLocation.lon};
                        var marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                        });

                        $.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng.lat + ',' + latlng.lng + '&sensor=true', function(res, err) {
                            if(res.results[0]){
                                if(users[userId]) {
                                    var userName = users[userId].firstName + ' ' + users[userId].lastName;
                                    var details = '<b>User Id: </b>' + userId + '<br><b>UserName: </b>' + userName + '<br><b>Event Id: </b>' + location.eventId + '<br><b>Event Type: </b>' + location.eventTitle + '<br><b>Event Description: </b>' + location.eventDescription + '<br><b>From Time: </b>' + new Date(location.eventFromTimestamp) + '<br><b>To Time: </b>' + new Date(location.eventToTimestamp) + '<br><b>Location Name: </b>' + res.results[0].formatted_address;
                                    that.setInfoWindow(details, marker, map);
                                }else {
                                    $.get('http://10.0.1.4:8080/butterfly/user/q?userId=' + userId, function(user, err) {
                                        users[user.userId] = user;
                                        var details = '<b>User Id: </b>' + userId + '<br><b>UserName: </b>' + user.firstName + ' ' + user.lastName + '<br><b>Event Id: </b>' + location.eventId + '<br><b>Event Type: </b>' + location.eventTitle + '<br><b>Event Description: </b>' + location.eventDescription + '<br><b>From Time: </b>' + new Date(location.eventFromTimestamp) + '<br><b>To Time: </b>' + new Date(location.eventToTimestamp) + '<br><b>Location Name: </b>' + res.results[0].formatted_address;
                                        that.setInfoWindow(details, marker, map);
                                    });
                                }
                            }
                        });

                        //flightPlanCoordinates.push({lat:locations[key].eventLocation.lat, lng: locations[key].eventLocation.lon});

                        if(locations[key - 1] && locations[key-1].eventLocation) {
                            var start = new google.maps.LatLng(locations[key - 1].eventLocation.lat, locations[key - 1].eventLocation.lon);
                            var end = new google.maps.LatLng(location.eventLocation.lat, location.eventLocation.lon);
                            //'#'+Math.floor(Math.random()*16777215).toString(16)
                            //                            
                            var request = {
                                origin : start,
                                destination : end,
                                travelMode : google.maps.TravelMode.DRIVING
                            };

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

                            (function(uid, req) {

                                var directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: '#' + intToRGB(hashCode(uid)) } });// also, constructor can get "DirectionsRendererOptions" object
                                directionsDisplay.setOptions( { suppressMarkers: true } );
                                directionsDisplay.setMap(map); // map should be already initialized.
                                var directionsService = new google.maps.DirectionsService(); 
                                    directionsService.route(req, function(response, status) {

                                        if (status == google.maps.DirectionsStatus.OK) {
                                            
                                                directionsDisplay.setDirections(response);
                                        }else{
                                            // console.log(status);
                                            // console.log(req);
                                        }
                                    });                                  

                                })(userId, request);    
                            }  
                        }           
                    });
                }
            }          



        // var flightPath = new google.maps.Polyline({
        //     path: flightPlanCoordinates,
        //     geodesic: true,
        //     strokeColor: '#FF0000',
        //     strokeOpacity: 1.0,
        //     strokeWeight: 2
        // });

        // flightPath.setMap(map);

        // Try W3C Geolocation (Preferred)
        if(navigator.geolocation) {
            var browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function(position) {
                var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                map.setCenter(initialLocation);
            }, function() {
                handleNoGeolocation(browserSupportFlag);
            });
        }
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
            <div className="mapBox" style={{height: '100vh'}}>
            </div>
        );
    }

});

module.exports = Map;