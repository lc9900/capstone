import React, {Component} from 'react';
import moment from 'moment';

export default class CalendarButton extends Component{
    constructor(){
        super();
    }
    buildCalendarUrl(){
        let {start, end, title, location, type} = this.props;
        let calendarUrl = "";

        // 2017-12-01T04:00:00.000Z
        // if no end time specified, and that it's an object, then
        // set a end time 1 hour after the start time
        // if(!end && typeof start === 'object') {
        //   end = start;
        //   end.setHours(start.getHours() + 1);
        // }

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
                downloadProps = {};
            if(type === 'google') {
                btnText = 'Google Calendar';
            }
            else {
                btnText = 'Mac or Outlook Calendar';
                downloadProps = {
                  download: 'event.ics'
                };
            }
            return <a {...downloadProps} href={this.buildCalendarUrl()} target='_blank' className='btn btn-success'>{btnText}</a>
    }
}
