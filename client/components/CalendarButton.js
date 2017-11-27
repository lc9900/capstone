import React, {Component} from 'react';
import moment from 'moment';

export default class CalendarButton extends Component{
    constructor(){
        super();
    }
    buildCalendarUrl(){
        const {start, end, title, location, type} = this.props;
        let calendarUrl = "";

        switch (type) {
          case "google":
            calendarUrl = "https://calendar.google.com/calendar/render";
            calendarUrl += "?action=TEMPLATE";
            calendarUrl += "&dates=" + this.formatTime(start);
            calendarUrl += "/" + this.formatTime(end);
            calendarUrl += "&location=" + encodeURIComponent(location);
            calendarUrl += "&text=" + encodeURIComponent(title);
            break;

          default:
            calendarUrl = [
              "BEGIN:VCALENDAR",
              "VERSION:2.0",
              "BEGIN:VEVENT",
              "URL:" + document.URL,
              "DTSTART:" + this.formatTime(start),
              "DTEND:" + this.formatTime(end),
              "SUMMARY:" + title,
              "LOCATION:" + location,
              "END:VEVENT",
              "END:VCALENDAR"
            ].join("\n");
            calendarUrl = encodeURI(
                "data:text/calendar;charset=utf8," + calendarUrl
            );
        }

        return calendarUrl;
    }

    formatTime(time) {
        if (typeof time === 'object'){
            return moment(time).format("YYYYMMDDTHHmmssZ").split(/-|\+/)[0];
        }
        return time;
    }

    render(){
            const {start, end, title, location, type} = this.props;
            let btnText = '',
                download = '';
            if(type === 'google') {
                btnText = 'Google Calendar';
                return <a href={this.buildCalendarUrl()} target='_blank' className='btn btn-success'>{btnText}</a>
            }
            else {
                btnText = 'Mac or Outlook Calendar';
                download = 'event.ics';
                return <a download={download} href={this.buildCalendarUrl()} target='_blank' className='btn btn-primary'>{btnText}</a>
            }
    }
}
