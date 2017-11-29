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

    componentDidMount() {

    }

    render() {
        return (
            <div>


              <CalendarButton type="google" start={'20171212T140000'} end={'20171212T150000'} title={'Rendezvous'} location={'New York'}/>
              <CalendarButton type="mac" start={'20171212T140000'} end={'20171212T150000'} title={'Rendezvous'} location={'New York'}/>
              </div>

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
