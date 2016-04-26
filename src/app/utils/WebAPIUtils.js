var CommonConstants = require('../constants/CommonConstants');
var APIEndpoints = CommonConstants.APIEndpoints;
var APIHeaders = CommonConstants.APIHeaders;

var request = function(reqParam) {
    if(!$) {
        var $ = require('jquery');
    }

    return $.ajax({
        headers: reqParam.headers,
        url: reqParam.url,
        data: reqParam.data,
        method: reqParam.method,
        contentType: reqParam.contentType,
        processData: reqParam.processData
    }).done(reqParam.success).fail(reqParam.failure);
};

var headers = function(headerParam) {
    return {
        'Content-Type': headerParam.contentType,
        'Authorization': headerParam.authorization
    }
};


module.exports = {
    //get events
    getEvents: function(payload, responseCallback) {
        request({
            url: APIEndpoints.GET_EVENTS,
            data: payload,
            method: 'GET',
            success: function(res){
                console.log(res);
                responseCallback(res, null);
            },
            failure: function(jqXHR, textStatus) {
                responseCallback(null, textStatus);
            }
        });
    },

    getRoutes: function(payload, responseCallback, counter, points) {
        var that = this;
        // console.log(payload);
        if(payload.length) {
            if(!points[payload[counter].userId]) {
                points[payload[counter].userId] = [];
            }
            var data = {
                src: payload[counter].lat + ',' + payload[counter].lng,
                dst: payload[counter + 1].lat + ',' + payload[counter + 1].lng
            }
            // console.log('getting for ', data);
            request({
                url: APIEndpoints.GET_ROUTE,
                headers: headers({
                    'authorization': localStorage.getItem('token')
                }),
                data: data,
                method: 'GET',
                success: function(res){
                    for (var i = 0; i < res.response.viaPoints.length - 1; i++) {
                        points[payload[counter].userId] = points[payload[counter].userId].concat({
                            lat: res.response.viaPoints[i].lat,
                            lng: res.response.viaPoints[i].lon
                        });
                    }
                    counter++; 
                    if(counter < payload.length - 1) {
                        that.getRoutes(payload, responseCallback, counter, points);
                    }else {    
                        responseCallback(points, null);
                    }
                },
                failure: function(jqXHR, textStatus) {
                    responseCallback(null, textStatus);
                }
            });
        }else{
            responseCallback([], null);
        }
    },

    createEvent: function(payload, responseCallback) {
        request({
            url: APIEndpoints.CREATE_EVENT,
            data: payload,
            method: 'GET',
            success: function(res){
                responseCallback(res, null);
            },
            failure: function(jqXHR, textStatus) {
                responseCallback(null, textStatus);
            }
        });
    },

    createUserSession: function(payload, responseCallback) {
        request({
            url: APIEndpoints.LOGIN,
            headers: headers({
                'contentType': 'application/json'
            }),
            data: JSON.stringify(payload),
            method: 'POST',
            success: function(res){
                responseCallback(res, null);
            },
            failure: function(jqXHR, textStatus) {
                responseCallback(null, textStatus);
            }
        });
    }
    
};