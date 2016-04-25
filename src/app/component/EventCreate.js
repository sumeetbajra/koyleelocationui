import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import DateTimeField from 'react-bootstrap-datetimepicker';
import moment from 'moment';
import { Link } from 'react-router';

import * as EnumConstants from '../constants/EnumConstants';
import { APIEndpoints } from '../constants/CommonConstants';
import EventActionCreators from '../actions/EventActionCreators';

class EventCreate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ownerId: null,
            participants: [],
            loading: false,
            value: '',
            eventParticipants: [],
            isPublic: false,
            checkNextDays: true,
            save: true,
            fromDate: null,
            fromTime: '00:00',
            toDate: null,
            toTime: '00:00'
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.changeTime = this.changeTime.bind(this);
        this.removeParticipant = this.removeParticipant.bind(this);
    }

    componentDidMount() {
        $.material.checkbox();
    }

    handleSubmit(e) {
        e.preventDefault();
        var participants = this.state.eventParticipants.map( (participant) => {
            return participant.userId;
        });
        var payload = {
            desc: document.getElementsByName('eventDescription')[0].value,
            owner: this.state.ownerId,
            participant: participants.join(','),
            eventType: document.getElementsByName('eventType')[0].value.toUpperCase(),
            eventStatus: document.getElementsByName('eventStatus')[0].value.toUpperCase(),
            accommodation: document.getElementsByName('accommodation')[0].value,
            fromDate: this.state.fromDate ? this.state.fromDate + ' ' + this.state.fromTime : null,
            toDate: this.state.toDate ? this.state.toDate + ' ' + this.state.toTime : null,
            isPublic: this.state.isPublic == 'public',
            checkNextDays: this.state.checkNextDays,
            save: this.state.save,
        }
        EventActionCreators.createEvent(payload);
    }

    toggleCheckbox(field, e) {
        this.setState({
            [field]: !this.state[field]
        })
    }

    changeDate(type, date, e) {
        this.setState({
            [type]: moment(parseInt(date)).format('YYYY/MM/DD')
        })
    }

    changeTime(type, date, e) {
        this.setState({
            [type]: moment(parseInt(date)).format('HH:mm')
        })
    }

    removeParticipant(id, e) {
        e.preventDefault();
        this.setState({
            eventParticipants: this.state.eventParticipants.filter((user) => {return user.userId != id})
        });
    }

    render() {
        let styles = {
            item: {
                padding: '2px 6px',
                cursor: 'default'
            },

            highlightedItem: {
                color: 'white',
                background: 'hsl(200, 50%, 50%)',
                padding: '2px 6px',
                cursor: 'default'
            },

            menu: {
                border: 'solid 1px #ccc'
            }
        }
        return (
            <form className="form-horizontal col-sm-8 col-sm-offset-2" id="createEvent" onSubmit={this.handleSubmit} autocomplete="off">
                <div className="form-group">
                    <h4>Create Event</h4><hr/>
                </div>
                <div className="form-group">
                    <label htmlFor="eventDescription">Event Description</label>
                    <input type="text" name="eventDescription" className="input form-control" placeholder="EventDescription"/>
                </div>
                 <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6">
                            <Autocomplete
                                labelText="Owner"
                                inputProps={{name: "ownerId", className: "input form-control", placeholder: "Search user"}}
                                ref="autocomplete"
                                value={this.state.ownerId}
                                items={this.state.participants}
                                getItemValue={(item) => item.firstName + ' ' + item.lastName}
                                onSelect={(value, item) => {
                                    // set the menu to only the selected item
                                    this.setState({ ownerId: item.userId, participants: [ item ] })
                                    // or you could reset it to a default list again
                                    // this.setState({ unitedStates: getStates() })
                                }}
                                onChange={(event, value) => {
                                    this.setState({ value, loading: true });
                                    var that = this;
                                    $.ajax({
                                        url: APIEndpoints.SEARCH_USER,
                                        headers: {
                                            'Authorization': localStorage.getItem('token'),
                                        },
                                        data: {'s': 8, 'q': value},
                                        method: 'GET',
                                        success: function(res){
                                            that.setState({ participants: res.response, loading: false });
                                        }
                                    });
                                }}
                                renderItem={(item, isHighlighted) => (
                                    <div
                                        style={isHighlighted ? styles.highlightedItem : styles.item}
                                        key={item.userId}
                                        id={item.userId}
                                    >{item.firstName} {item.lastName}</div>
                                )}
                            />
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor="eventType">Event Type</label>
                            <select name="eventType" className="form-control">
                                <option value="">--Select event type--</option>
                                {EnumConstants.EventType.map((type, key) => {
                                    return (<option key={key} value={type}>{type}</option>);
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                 <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6">
                            <Autocomplete
                                labelText="Participants"
                                inputProps={{name: "participants", className: "input form-control", placeholder: "Add participants"}}
                                ref="autocomplete"
                                value={this.state.eventParticipants}
                                items={this.state.participants}
                                getItemValue={(item) => item.firstName + ' ' + item.lastName}
                                onSelect={(value, item) => {
                                    // set the menu to only the selected item
                                    this.setState({ eventParticipants: this.state.eventParticipants.concat([item]), participants: [], value: '' });
                                    setTimeout(function() {
                                        $('input[name="participants"]').val('');
                                    });
                                    // or you could reset it to a default list again
                                    // this.setState({ unitedStates: getStates() })
                                }}
                                onChange={(event, value) => {
                                    this.setState({ value, loading: true });
                                    var that = this;
                                    $.ajax({
                                        url: APIEndpoints.SEARCH_USER,
                                        headers: {
                                            'Authorization': localStorage.getItem('token'),
                                        },
                                        data: {'s': 8, 'q': value},
                                        method: 'GET',
                                        success: function(res){
                                            that.setState({ participants: res.response, loading: false });
                                        }
                                    });
                                }}
                                renderItem={(item, isHighlighted) => (
                                    <div
                                        style={isHighlighted ? styles.highlightedItem : styles.item}
                                        key={item.userId}
                                        id={item.userId}
                                    >{item.firstName} {item.lastName}</div>
                                )}
                            />
                            <div style={{margin: '20px 0 10px'}}>
                                {this.state.eventParticipants.map( (participant) => {
                                    return (<span className="selected">{participant.firstName} {participant.lastName} <a href="#" onClick={this.removeParticipant.bind(this, participant.userId)}>X</a></span>);
                                })}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor="eventStatus">Event Status</label>
                            <select name="eventStatus" className="form-control">
                                <option value="">--Select event status--</option>
                                <option value="ok">OK</option>
                                <option value="pending">Pending</option>
                                <option value="done">Done</option>
                                <option value="cancel">Cancel</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-3">
                            <label htmlFor="eventStatus">From Date:</label>
                            <DateTimeField defaultText={'Set from date'} mode={'date'} onChange={this.changeDate.bind(this, 'fromDate')}/>
                        </div>
                         <div className="col-sm-3">
                            <label htmlFor="eventStatus">From Time:</label>
                            <DateTimeField defaultText={'Set from time'} mode={'time'} onChange={this.changeTime.bind(this, 'fromTime')}/>
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="eventStatus">To Date:</label>
                            <DateTimeField defaultText={'Set to date'} mode={'date'} onChange={this.changeDate.bind(this, 'toDate')}/>
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="eventStatus">To Time:</label>
                            <DateTimeField defaultText={'Set to time'} mode={'time'} onChange={this.changeTime.bind(this, 'toTime')}/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6">
                            <label htmlFor="accommodation">Accommodation</label>
                            <select name="accommodation" className="form-control">
                                <option value="">--Accommodation--</option>
                                <option value="1">1</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <label htmlFor="eventDescription">Settings</label> 
                            <div className="row">
                                <div className="checkbox col-sm-4">                                   
                                    <label>
                                        <input type="checkbox" checked={this.state.isPublic} onChange={this.toggleCheckbox.bind(this, 'isPublic')}/> Public
                                    </label>
                                </div>
                                <div className="checkbox col-sm-4">                          
                                    <label>
                                        <input type="checkbox" checked={this.state.checkNextDays} onChange={this.toggleCheckbox.bind(this, 'checkNextDays')}/> CheckNextDays
                                    </label>
                                </div>
                               <div className="checkbox col-sm-4">                                 
                                    <label>
                                        <input type="checkbox" checked={this.state.save} onChange={this.toggleCheckbox.bind(this, 'save')}/> Save
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group">  
                    <button className="btn btn-primary btn-raised" type="submit">Submit</button>&nbsp;
                    <button className="btn btn-danger btn-raised" type="reset">Reset</button>&nbsp;
                    <Link to={'/'} className="btn btn-default btn-raised" type="reset">Back</Link>
                </div>
            </form>
        );
    }

}

module.exports = EventCreate;


// import React, { Component } from 'react';

// export default class EventCreate extends Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         return (
//             <div>hello</div>
//         );
//     }
// }