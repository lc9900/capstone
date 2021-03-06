import React, {Component} from 'react';
import { connect } from 'react-redux';
// import {  } from '../store';
import { Redirect } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
import {daysInMonth} from '../../utils';
import { loadUser } from "../store";
import DayPicker from 'react-day-picker';

class NewMeetup extends Component {
    constructor(props){
        super();
        const { user } = props;
        let now = new Date(),
            now_year = now.getFullYear(),
            now_month = now.getMonth() + 1;

        this.state = {
          // avail_years: [2017, 2018],
          // avail_months: _.range(1, 13),
          // avail_dates: _.range(1, daysInMonth(now_year, now_month) + 1),
          avail_hours: _.range(24),
          input_year:  -1,
          input_month: -1,
          input_date: -1,
          input_hour: -1,
          input_friend: -1,
          input_origin: -1,
          input_err: '',
          input_success: '',
          selectedDay: undefined
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
    }

    handleDayClick(day) {
      // console.log(day.getDate()) // Sat Dec 16 2017 12:00:00 GMT-0500 (EST)
      const year = day.getFullYear(),
            month = day.getMonth() + 1,
            date = day.getDate();
      // console.log('Year, Month, Date: ', year, month, date);
      this.setState({
        selectedDay: day ,
        input_year: year,
        input_month: month,
        input_date: date
      });
    }

    handleSubmit(event) {
      event.preventDefault();
      const {input_year, input_month, input_date, input_hour, input_friend, input_origin} = this.state;
      const {user, loadSessionUser} = this.props;
      // console.log(this.state);
      if(input_year === -1 ||
         input_month === -1 ||
         input_date === -1 ||
         input_hour === -1 ||
         input_date === -1 ||
         input_friend === -1 ||
         input_origin === -1
         ) { this.setState({input_err: "Please select from ALL selections"}); }
      else {
        axios.post(`/api/meetup/add/${user.id}`, {
          year: input_year,
          month: input_month,
          date: input_date,
          hour: input_hour,
          friendId: input_friend,
          originId: input_origin
        })
        .then(() => {
          // setTimeout(() => this.setState({input_success: ''}), 2000);
          this.setState({
            input_year: -1,
            input_month: -1,
            input_date: -1,
            input_hour: -1,
            input_friend: -1,
            input_origin: -1,
            input_err: '',
            input_success: 'Meetup Added!'
          })
        })
        .then(() => loadSessionUser())
        .catch(err => {
          console.log("error: ", err);
          if(err.response) this.setState({input_err: err.response.data, input_success:''});
          else this.setState({input_err: 'Request Failed!', input_success: ''});
        })
      }
    }

    handleChange(event) {
      const {input_year, input_month} = this.state,
          value = event.target.value,
          name = event.target.name;

      if(name === 'input_year') {
        this.setState({
          [name]: value,
          avail_dates: _.range(1, daysInMonth(value, input_month) + 1),
        });
      }
      else if(name === 'input_month') {
        this.setState({
          [name]: value,
          avail_dates: _.range(1, daysInMonth(input_year, value) + 1),
        });
      }
      else {
        this.setState({ [name]: value });
      }
    }

    render(){
        const {user} = this.props;
        if(! user.id) return <Redirect to='/Login' />
        user.places = _.orderBy(user.places, ['name'], ['asc']);
        user.friends = _.orderBy(user.friends, ['name'], ['asc']);

        const {
          now_year, now_month, now_date, now_hour,
          avail_years, avail_months, avail_dates, avail_hours,
          input_year, input_month, input_date, input_hour, input_friend, input_err, input_success, input_origin
        } = this.state;

        return (
          <div className="card calendar-card">
            {
                input_err && (<div className="alert alert-danger" role="alert">
                                {input_err}
                              </div>)
            }
            {
                input_success && (<div className="alert alert-success" role="alert">
                                {input_success}
                              </div>)
            }
            <br />
            
            
              <div className='row'>
                
                <div className='col-lg-4 calendar'>
                  <DayPicker
                    onDayClick={this.handleDayClick}
                    selectedDays={this.state.selectedDay}
                  />
                </div>

                <div className='col-lg-2'></div>

                <div className='col-lg-5'>
                  <form id='meetupForm' onSubmit={this.handleSubmit}>
                      <div className="form-row">
                        <div className="form-group col-md-11">
                          <label>Hour</label>
                          <select name='input_hour' value={input_hour} className="form-control" onChange={this.handleChange}>
                            <option value='-1'>Choose</option>
                            {
                              avail_hours.map(hour => <option key={hour} value={hour}>{hour}</option>)
                            }
                          </select>
                        </div>
                      </div>


                      <div className="form-row">
                        <div className="form-group col-md-11">
                          <label>Friend</label>
                          <select name='input_friend' value={input_friend} className="form-control" onChange={this.handleChange}>
                            <option value='-1'>Choose a friend</option>
                            {
                              user.friends.map(friend => <option key={friend.id} value={friend.id}>{friend.name}</option>)
                            }
                          </select>
                        </div>
                      </div>


                      <div className="form-row">
                        <div className="form-group col-md-11">
                          <label>Origin</label>
                          <select name='input_origin' value={input_origin} className="form-control" onChange={this.handleChange}>
                            <option value='-1'>Choose origin</option>
                            {
                              user.places.map(place => <option key={place.id} value={place.id}>{place.name}</option>)
                            }
                          </select>
                        </div>
                      </div>
                      <div className="form-group col-md-11">
                        <button type="submit" className="btn btn-primary float-right">Submit</button>
                      </div>
                  </form>
                </div>
                
              </div>
         
          </div>
        )
    }
}






//////////////////////////////////////////////////////

const mapState = (state) => {
  return {
    user: state.user
  }
}
const mapDispatch = (dispatch) => {
  return {
    loadSessionUser: () => dispatch(loadUser())
  };
};

// export default connect(mapState, mapDispatch)(Login);
export default connect(mapState, mapDispatch)(NewMeetup);
