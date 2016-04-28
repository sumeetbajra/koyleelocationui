var React = require('react');
var RouteStore = require('../stores/RouteStore.js');
var MapActionCreators = require('../actions/MapActionCreators');
var DateTimePicker = require('react-bootstrap-datetimepicker');
var moment = require('moment');
var Link = require('react-router').Link;

var EventStore = require('../stores/EventStore');

var Map = require('./Map.react');

var MapControl = React.createClass({

    getInitialState: function() {
        return {
            events: null,
            userId: localStorage.getItem('uuid'),
            fromDate: JSON.parse(localStorage.getItem('payload')) && JSON.parse(localStorage.getItem('payload')).fromDate ? JSON.parse(localStorage.getItem('payload')).fromDate : moment(Date.now()).format('YYYY/MM/DD'),
            toDate: null,
            showAll: true,
            homeLocation: true,
            officeLocation: true,
            users: []
        }
    },

    onChange: function() {
        var events = EventStore.getEvents();
        var users = [];
        for(var userId in events) {
            if(events.hasOwnProperty(userId)) {
                users = users.concat(JSON.parse(userId).userId)
            }
        }
        this.setState({
            events: EventStore.getEvents(),
            users: users
        });
    },

    componentDidMount: function() {
         $.material.checkbox();
         var mapCol = $('#map-col');
         var mapControl = $('#map-control')

        EventStore.addChangeListener(this.onChange);
        
        MapActionCreators.getEvents(JSON.parse(localStorage.getItem('payload')));
        $('#collapse-bar').on('click', this.collapseSideBar);
    },

    collapseSideBar: function() {
        if(mapCol.hasClass('col-sm-9')) {
            mapCol.removeClass('col-sm-9').addClass('col-sm-12');
            mapControl.hide();
            google.maps.event.trigger(window.map, "resize");
        }else{
            mapCol.removeClass('col-sm-12').addClass('col-sm-9');
            mapControl.show();
            google.maps.event.trigger(window.map, "resize");
        }            
    },

    componentWillUnmount: function() {
         EventStore.removeChangeListener(this.onChange);
         $('#collapse-bar').unbind('click', this.collapseSideBar);
    },

    checkboxChangeHandler: function(field, e) {
        this.setState({
            [field]: $(e.target).is(':checked')
        })
    },

    setDate: function(field, date) {
        this.setState({
            [field]: moment(date).format('YYYY/MM/DD'),
        });
    },

    setUserId: function(e) {
        this.setState({
            userId: $(e.target).val()
        })
    },

    _filter: function(e) {

        // var myLatLng = {lat: 28, lng: 84};

        // // Create a map object and specify the DOM element for display.
        // window.map = new google.maps.Map(document.getElementsByClassName('mapBox')[0], {
        //     center: myLatLng,
        //     scrollwheel: true,
        //     zoom: 12
        // });
        // 
        var payload = {
            userId: this.state.userId,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate ? this.state.toDate : this.state.fromDate,
            getAll: this.state.showAll,
            getHome: this.state.homeLocation,
            getOffice: this.state.officeLocation
         }

        localStorage.setItem('uuid', this.state.userId);
        localStorage.setItem('payload', JSON.stringify(payload));
        location.hash = "/";
     },

    render: function() {
        return (
            <div id="container">
                <div id="map-control" className="col-sm-3">
                    <form className="form-horizontal">
                        <fieldset>
                            <div className="form-group">
                                <label htmlFor="inputEmail" className="control-label">User Id</label><br />
                                <input type="text" className="form-control" id="inputEmail" placeholder="" value={this.state.userId} onChange={this.setUserId}/>
                            </div>

                            <div className="form-group">   
                                <label htmlFor="inputEmail" className="control-label">From</label><br />
                                <DateTimePicker mode="date" dateTime={this.state.fromDate} inputFormat= "YYYY/MM/DD" format="YYYY/MM/DD" onChange={this.setDate.bind(this, 'fromDate')}/>
                            </div>  

                            <div className="form-group">   
                                <label htmlFor="inputEmail" className="control-label">To</label><br />
                                <DateTimePicker mode="date" dateTime={moment(Date.now()).format('YYYY/MM/DD')} inputFormat= "YYYY/MM/DD" format="YYYY/MM/DD" defaultText={'Set to date'} onChange={this.setDate.bind(this, 'toDate')}/>
                            </div>  

                            <div className="form-group"> 
                                <div className="checkbox">                           
                                    <label>
                                        <input type="checkbox" checked={this.state.showAll} onChange={this.checkboxChangeHandler.bind(this, 'showAll')}/> Show all
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">       
                                <div className="checkbox">                               
                                    <label>
                                        <input type="checkbox" checked={this.state.homeLocation} onChange={this.checkboxChangeHandler.bind(this, 'homeLocation')}/> Show Home Locations
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">   
                                <div className="checkbox">                                   
                                    <label>
                                        <input type="checkbox" checked={this.state.officeLocation} onChange={this.checkboxChangeHandler.bind(this, 'officeLocation')}/> Show Office Locations
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-success btn-raised" onClick={this._filter}>Filter</button>
                                <Link to={'/createEvent'} className="btn btn-primary btn-raised">New Event</Link>
                            </div>    
                        </fieldset>
                    </form>
                    <span>
                        <h4 style={{marginLeft: '-15px'}}>User list</h4><hr style={{marginLeft: '-15px'}}/> 
                        <UserList data={this.state.events} users={this.state.users}/>
                    </span>
                </div>
                <div className="col-sm-9" style={{padding: 0}} id="map-col">
                    <div id="collapse-bar"><i className="fa fa-align-justify"></i></div>
                    <Map locations={this.state.events} users={this.state.users} userData={this.state.events}/>
                </div>
            </div>
        );
    }

});

var UserList = React.createClass({

    getInitialState: function() {
        return {
            users: [] 
        };
    },

    componentDidMount: function() {
        $.material.checkbox();
    },

    componentWillReceiveProps: function(nextProps) {
        this.props = nextProps
    },

    componentDidUpdate: function(prevProps, prevState) {
        $.material.checkbox();
    },

    selectUser: function() {
        var users = [];
        $('#users-check input:checked').each(function() {
            users.push($(this).data('userid'));
        });
        MapActionCreators.selectUsers(users);
    },

    render: function() {
        var users = [];
        for(var user in this.props.data) {
            if(this.props.data.hasOwnProperty(user)) {
                users.push(
                    <div className="form-group" key={JSON.parse(user).userId}>  
                        <div className="checkbox" id="users-check">                               
                            <label>
                                <input type="checkbox" defaultChecked={this.props.users.indexOf(JSON.parse(user).userId) > -1} onChange={this.selectUser} data-userid={JSON.parse(user).userId}/> {JSON.parse(user).userId}
                            </label>
                        </div>
                        {JSON.parse(user).firstName} {JSON.parse(user).lastName} <br /> {this.props.data[user].length} events
                        <br />Username: {JSON.parse(user).emailPhone}
                    </div>
                );
            }
        }
        return (
            <div>
                {users}
            </div>
        );
    }

});

module.exports = MapControl;