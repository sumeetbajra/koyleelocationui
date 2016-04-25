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

var Index = React.createClass({

    render: function() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }

});

module.exports = Index;