import React, {Component} from 'react';
import { connect } from 'react-redux';
// import {  } from '../store';
// import { Redirect } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
import {daysInMonth} from '../../utils';
import CalendarButton from './CalendarButton';

class Test extends Component {
    constructor(){
        super();
    }

    render() {
        return (
            <div><CalendarButton start={'12/12/2017 18:00'} end={'12/12/2017 19:00'} title={'Rendezvous'} location={'New York'}/></div>

        )
    }
}


// The following container is needed only to set default user
/* -----------------    CONTAINER     ------------------ */

const mapState = () => {
  return {
  };
};

const mapDispatch = dispatch => {
  return {
  };
};

export default connect(mapState, mapDispatch)(Test);
