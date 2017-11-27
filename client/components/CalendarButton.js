import React, {Component} from 'react';
// import { connect } from 'react-redux';
// import {  } from '../store';
// import { Redirect } from 'react-router-dom';
import * as _ from 'lodash';
// import axios from 'axios';
import {daysInMonth} from '../../utils';

// export default function CalendarButton(props) {
//     const {start, end, title, location} = props;
//     setTimeout(function(){addeventatc.refresh();}, 200);
//     return (
//         <div title="Add to Calendar" className="addeventatc">
//             Add to Calendar
//             <span className="start">{start}</span>
//             <span className="end">{end}</span>
//             <span className="title">{title}</span>
//             <span className="location">{location}</span>
//         </div>
//     )
// }

export default class CalendarButton extends Component{
    constructor(){
        super();
    }

    componentDidMount(){
        addeventatc.refresh();
    }

    render(){
            const {start, end, title, location} = this.props;
            setTimeout(function(){addeventatc.refresh();}, 200);
            return (
                <div title="Add to Calendar" className="addeventatc">
                    Add to Calendar
                    <span className="start">{start}</span>
                    <span className="end">{end}</span>
                    <span className="title">{title}</span>
                    <span className="location">{location}</span>
                </div>
            )
    }
}

// <div title="Add to Calendar" class="addeventatc">
//     Add to Calendar
//     <span class="start">12/11/2017 08:00 AM</span>
//     <span class="end">12/11/2017 10:00 AM</span>
//     <span class="timezone">America/Los_Angeles</span>
//     <span class="title">Summary of the event</span>
//     <span class="description">Description of the event</span>
//     <span class="location">Location of the event</span>
// </div>
