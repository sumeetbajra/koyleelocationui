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
var IndexActionCreators = require('../actions/IndexActionCreators');
var SessionStore = require('../stores/SessionStore');

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
    },

    render: function() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }

});

module.exports = Index;