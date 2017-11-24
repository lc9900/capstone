import React, {Component} from 'react';
import { connect } from 'react-redux';
import {  } from '../store';
import { Redirect } from 'react-router-dom';
// import * as _ from 'lodash';
import axios from 'axios';
// import {daysInMonth} from '../../utils';

class Dashboard extends Component {
    constructor(props){
        super();
        this.state = {
        	userApi: {},
        	//so, what if i put all of this user's meetups in the local state as well?
        	meetupIdArray: []

        };
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
    }

    handleChange(event) {
    }
    
    componentDidMount(props){
    	const userId = this.props.user.id
    	//bad to do this directly in here instead of putting on store?
    	axios.get(`/api/users/${userId}`)
    	.then(res => {
    		return res.data})
    	.then(result => {
    		this.setState({userApi: result})
    	})

    	console.log('if this works i guess i have some thunks to do', this.props)

    	//given user id, give me a list of meetup ids (use to get friend in meetup)
    	const meetupIdArray=[]
    	axios.get(`/api/users/${userId}/meetups`)
    	.then(res => {
    		return res.data
    	})
    	.then(meetupObjArray => {
    		meetupObjArray.forEach(i => {
    			return meetupIdArray.push(i['id'])
    		})
    	})
    	.then(result => {
    		this.setState({meetupIdArray})
    	})

    }
    render(){
        //considered using card-group but decided against it as it is a new feature and not responsive

        const {user} = this.props;
        const {userApi, meetupIdArray} = this.state;
        if(! user.id) return <Redirect to='/Login' />

        console.log('read whole object here', userApi)
        
        //ideally, i want an array of objects, where each object is a meetup with category, (my name), friend's name, time, status
        //assign to null and render empty div for render on component first mount
        const meetupsArray = userApi['meetups'] ? userApi['meetups']: null
        const friendsArray = userApi['friends'] ? userApi['friends']: null
        
        return (
          <div>
          	<div className="container-fluid">
          		<div className="row">
          			<div className="col-3"></div>
          			<div className="col-6">
          				{ meetupsArray ? meetupsArray.map(meetup=>{
          					const meetupFriendId = meetup['user_meetup_map']['userId']
          					// console.log('2?', meetupFriendId)
          					let meetupFriendName
          					friendsArray.map(friend=>{
          						console.log(friend.id)
          						if(friend.id == meetupFriendId){
          							console.log(friend.id)
          							meetupFriendName = friend.name
          						}
          					})
          					console.log(meetupFriendName)
          					return (<div key={meetup.id}>
          						<div className="card">
					          		<div className="card-body">
					          			<h4 className="card-title">{meetup.id} :category</h4>
					          			
					          			<p className="card-text">time</p>
					          			<p className="card-text">status</p>
					      				<p className="card-text"><small className="text-muted">seems unnecessary</small></p>
					          		</div>
					          	</div>
          						

          						</div>)
          				}): <div></div>}

          			</div>
          			<div className="col-3"></div>
          		</div>
          	</div>
          	<div className="card">
          		<div className="card-body">
          			<h4 className="card-title">category</h4>
          			<p className="card-text">friend name</p>
          			<p className="card-text">time</p>
          			<p className="card-text">status</p>
      				<p className="card-text"><small className="text-muted">seems unnecessary</small></p>
          		</div>
          	</div>
        </div>
        )
    }
}

// <p className="card-text">friend name:{userApi['friends'][meetupFriendId]}</p>
//////////////////////////////////////////////////////

const mapState = (state) => {
  return {
    user: state.user
  }
}
const mapDispatch = (dispatch) => {
  return {
  };
};

export default connect(mapState, mapDispatch)(Dashboard);

