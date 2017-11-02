import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {fetchProducts} from '../store.js'
import {BrowserRouter, Route, NavLink, withRouter} from 'react-router-dom'

import Login from './Login';
import Analytic from './Analytic';
import { } from '../reducers';

class Main extends Component {
	constructor(){
		super();
	}

	componentDidMount() {
	}

	render(){
		return (
			<div className='container'>
				<h1> Main</h1>
			</div>
		)
	}
}

// export default Main  // This is only commented out to set default user


// The following container is needed only to set default user
/* -----------------    CONTAINER     ------------------ */

const mapState = (state) => {
  return {
  }
}
const mapDispatch = (dispatch) => {
  return {
  };
};

export default withRouter(connect(mapState, mapDispatch)(Main));
