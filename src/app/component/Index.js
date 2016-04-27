// import React, {Component} from 'react';

// export class Index extends Component {
//     render() {
//         return (
//             <div>
//                 {this.props.children}
//             </div>
//         )
//     }
// }


var React = require('react');
var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr; // This is a React Element. 
// For Non ES6... 
var ToastContainer = ReactToastr.ToastContainer; 
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

var IndexActionCreators = require('../actions/IndexActionCreators');
var EventActionCreators = require('../actions/EventActionCreators');
var SessionStore = require('../stores/SessionStore');
var EventStore = require('../stores/EventStore');

var Index = React.createClass({

    componentDidMount: function() {

        setTimeout(function() {
            IndexActionCreators.createUserSession({
                username: '+9779841444444',
                password: 'password',
                rememberme: true,
                deviceSource: 0
            });
        }, 0);  
        EventStore.addChangeListener(this.addAlert);
    },

    addAlert: function() {
        var createdEvent = EventStore.getCreatedEvent();
        var title, subtitle;
        if(createdEvent) {
            if(!createdEvent.eventLocation) {
                subtitle = 'No location';
            }else if(!createdEvent.eventFromTimestamp) {
                subtitle = subtitle.length ? subtitle + ', no time' : 'No time';
            }
            this.refs.container.success(
              subtitle,
              'Event Created succesfully', {
                  timeOut: 3000,
                  extendedTimeOut: 1000
            });
            EventActionCreators.clearCreatedEvent();
        }
    },

    componentWillUnmount: function() {
        EventStore.removeChangeListener(this.addAlert);
    },

    render: function() {
        return (
            <div>
                {this.props.children}
                <ToastContainer ref="container" toastMessageFactory={ToastMessageFactory} className="toast-top-right" />
            </div>
        );
    }

});

module.exports = Index;