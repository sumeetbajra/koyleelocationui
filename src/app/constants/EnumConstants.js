var keyMirror = require('keymirror');

module.exports = {

    EventType: [
        'General', 'Reminder', 'Meeting', 'Conference', 'Dinner', 'Movie', 'Tour', 'Wedding', 'Task', 'Sales', 'Game',
        'Sport', 'Party', 'Shopping', 'Breakfast', 'Lunch'
    ],
    
    Gender: {
        0: 'Male',
        1: 'Female',
        2: 'Other',
        3: 'NA'
    },

    HomeLocationType: {
    	0: 'Permanent',
    	1: 'Current'
    },

    JobType: {
        0: 'Full Time',
        1: 'Part Time',
        2: 'Contract'
    },

    DaysOfWeek: {
     	0: 'Sun',
     	1: 'Mon',
     	2: 'Tue',
     	3: 'Wed',
     	4: 'Thu',
     	5: 'Fri',
     	6: 'Sat'
    },

    Months: {
        0: 'Jan',
        1: 'Feb',
        2: 'Mar',
        3: 'Apr',
        4: 'May',
        5: 'Jun',
        6: 'July',
        7: 'Aug',
        8: 'Sep',
        9: 'Oct',
        10: 'Nov',
        11: 'Dec'
    },

    MeetingAcceptSettings: {
        0: 'Auto accept', 
        1: 'Auto accept for new', 
        2: 'Auto accept for old',
        3: 'Auto accept from list'
    },

    ParticipantModifier: {
        1: 'and',
        2: 'or', 
        3: 'then'
    },

    EventUserStatus: {
        0: 'PENDING',
        1: 'IS_COMING',
        2: 'NOT_COMING',
        3: 'WILL_BE_LATE', 
        4: 'UNAVAILABLE'
    },

    EventStatus: {
        0: 'NO_ACTION', 
        1: 'AUTO_ACCEPT', 
        2: 'AUTO_REJECT', 
        3: 'FOR_NOW_ACCEPT', 
        4: 'FOR_NOW_REJECT'
    },

    EventRepeat: {
        0: 'Yearly', 
        1: 'Monthly', 
        2: 'Weekly', 
        3: 'Daily', 
        4: 'Hourly', 
        5: 'Seasons', 
        6: 'Shifts', 
        7: 'Never'
    },

    Transportation: {
        0: 'Public Transportation',
        1: 'Car',
        2: 'Walk',
        3: 'Bicycle'
    },

    NotificationApplyType: [
        {enum: 'ADD_EVENT', text: ' created an event with you '}, 
        {enum: 'REMOVE_EVENT', text: ''}, 
        {enum:'UPDATE_EVENT', text: ''},
        {enum:'ADD_AGENDA', text: ''}, 
        {enum: 'UPDATE_AGENDA', text: ''}, 
        {enum: 'REMOVE_AGENDA', text: ''},
        {enum: 'ADD_EVENT_PARTICIPANT', text: ' invited you to join an event '}, 
        {enum: 'UPDATE_EVENT_PARTICIPANT', text: ''}, 
        {enum: 'REMOVE_EVENT_PARTICIPANT', text: ''},
        {enum: 'BUNDLE_REQUEST', text: ' sent you bundle request'}, 
        {enum: 'BUNDLE_REQUEST_REJECT', text: ' rejected your bundle request'}, 
        {enum: 'BUNDLE_REQUEST_ACCEPT', text: ' accepted your bundle request'}
    ],

    ConferenceSource: ['Skype', 'Hangout', 'Viber', 'Yahoo', 'Whatsapp', 'Phone', 'Other']
}
