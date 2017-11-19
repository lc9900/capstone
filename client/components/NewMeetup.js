import React, {Component} from 'react';
import { connect } from 'react-redux';
import {  } from '../store';
import { Redirect } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
import {daysInMonth} from '../../utils';

class NewMeetup extends Component {
    constructor(){
        super();
        let now = new Date(),
            now_year = now.getFullYear(),
            now_month = now.getMonth() + 1,
            now_date = now.getDate(),
            now_hour = now.getHours();

        this.state = {
          avail_years: [2017, 2018],
          avail_months: _.range(1, 13),
          avail_dates: _.range(1, daysInMonth(now_year, now_month) + 1),
          avail_hours: _.range(24),
          input_year: now_year,
          input_month: now_month,
          input_date: now_date,
          input_hour: now_hour,
          input_friend: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit() {

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

        const {
          now_year, now_month, now_date, now_hour,
          avail_years, avail_months, avail_dates, avail_hours,
          input_year, input_month, input_date, input_hour, input_friend
        } = this.state;

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-md-1">
                    <label>Year</label>
                    <select name='input_year' value={input_year} className="form-control" onChange={this.handleChange}>
                      {
                        avail_years.map(year => <option key={year} value={year}>{year}</option>)
                      }
                    </select>
                  </div>
                  <div className="form-group col-md-1">
                    <label>Month</label>
                    <select name='input_month' value={input_month} className="form-control" onChange={this.handleChange}>
                      {
                        avail_months.map(month => <option key={month} value={month}>{month}</option>)
                      }
                    </select>
                  </div>
                  <div className="form-group col-md-1">
                    <label>Date</label>
                    <select name='input_date' value={input_date} className="form-control" onChange={this.handleChange}>
                      {
                        avail_dates.map(date => <option key={date} value={date}>{date}</option>)
                      }
                    </select>
                  </div>
                  <div className="form-group col-md-1">
                    <label>Hour</label>
                    <select name='input_hour' value={input_hour} className="form-control" onChange={this.handleChange}>
                      {
                        avail_hours.map(hour => <option key={hour} value={hour}>{hour}</option>)
                      }
                    </select>
                  </div>
                  <div className="form-group col-md-8">
                    <label>Friend</label>
                    <select name='input_friend' value={input_friend} className="form-control" onChange={this.handleChange}>
                      {
                        user.friends.map(friend => <option key={friend.id} value={friend.id}>{friend.name}</option>)
                      }
                    </select>
                  </div>
                </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
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
  //   loginUser: function(credential){
  //     return dispatch(verifyUser(credential));
  //   },

  //   logoutUser: function(){
  //     dispatch(logout())
  //       },

  //       getCart : function(id){
  //           return dispatch(fetchCart(id))
  //       }
  };
};

// export default connect(mapState, mapDispatch)(Login);
export default connect(mapState, mapDispatch)(NewMeetup);
