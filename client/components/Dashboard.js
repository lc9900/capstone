import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchMeetups } from '../store';
import { Redirect } from 'react-router-dom';
// import * as _ from 'lodash';
import axios from 'axios';
// import {daysInMonth} from '../../utils';

class Dashboard extends Component {
    constructor(props){
        super();
        this.state = {
        	userApi: {},
        	//put all of this user's meetups in the local state
        	meetupIdArray: [],
          meetupIncludeUserArray: []

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

      //not using anymore. delete at end of view.
      // const meetupsThunk = fetchMeetups(userId)
      // store.dispatch(meetupsThunk)
    	
      //given user id, give me a list of meetup ids and a list of meetups that include users in that meetup
    	const meetupIdArray=[]
      const meetupIncludeUserArray=[]
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
        return meetupIdArray.forEach(meetupId => {
          axios.get(`/api/meetup/${meetupId}/includeUser`)
          .then(res => meetupIncludeUserArray.push(res.data[0]))
          .then(result => this.setState({meetupIncludeUserArray}))
        })
    	})

    }
    

    render(){
        //considered using card-group but decided against it as it is a new feature and not responsive

        const {user} = this.props;
        const {userApi, meetupIdArray, meetupIncludeUserArray} = this.state;
        if(! user.id) return <Redirect to='/Login' />

        console.log('read whole object here', userApi)
        console.log('read whole object here', meetupIncludeUserArray)
        
        //ideally, i want an array of objects, where each object is a meetup with category, (my name), friend's name, time, status
        //assign to null and render empty div for render on component first mount
        const meetupsArray = userApi['meetups'] ? userApi['meetups']: null
        const friendsArray = userApi['friends'] ? userApi['friends']: null
        const statusArray = userApi['status']? userApi['status']: null
        
        // "new incoming requests" - status: initiated, initiator: false
        // "Pending Outgoing Requests" - status: initiated, initiator: true
        // "accepted rendezvous" - 'received', 'pending', 'accepted', 
        // can make fourth catogory - 'canceled'
        // only show in "history" - 'rejected', 

        return (
          <div>
          	<div className="container-fluid">
          		<div className="row">
          			
          			<div className="col-12">
          				{ meetupsArray ? meetupsArray.map(meetup=>{
          					
                    const thisMeetupId = meetup.id
                    const userId = this.props.user.id
                    
                    let meetupFriendId
                    let meetupTime

                    meetupIncludeUserArray.forEach(meetup =>{
                      if(meetup.id === thisMeetupId){
                        meetupTime = meetup.time
                        meetup['users'].forEach(participant => {
                          if (participant.id !== userId ) {
                            return meetupFriendId = participant.id
                          }
                        })
                      }
                    })
                    
          					let meetupFriendName
          					
                    friendsArray.map(friend=>{
          						if(friend.id === meetupFriendId){
          							return meetupFriendName = friend.name
          						}
          					})

                    let meetupStatus
                    let meetupCategory
                    let backgroundClass
                    let placeMessage

                    statusArray.map(meetup => {
                      if (meetup.meetupId === thisMeetupId){
                        meetupStatus = meetup.status
                        if (meetup.status === "initiated" && meetup.initiator){
                          meetupCategory = "Pending Outgoing"
                          backgroundClass = "outgoing"
                          placeMessage = `we need ${meetupFriendName} to enter a starting address to give you a recommendation!`
                        }
                        else if (meetup.status === "initiated" && !meetup.initiator){
                          meetupCategory = "New Incoming"
                          backgroundClass = "incoming"
                          placeMessage = `we need you to enter a starting address to give you a recommendation!`
                        }
                        else {
                          meetupCategory = "Accepted"
                          backgroundClass = "accepted"
                        }
                      }
                    })

          					return (<div className="meetup" key={meetup.id}>
          						<div className="card border-secondary">
					          		<div className={`card-header ${backgroundClass}`}> {meetupCategory}</div>
                        <div className="card-body">
					          			<h4 className="card-title">Meetup with {meetupFriendName}</h4>
					          			<p className="card-text">time: {meetupTime}</p>
					          			<p className="card-text">status: {meetupStatus}</p>
                          <p className="card-text">place: {meetup.placeId ? meetup.placeId : placeMessage}</p>
					      				  <a href="#" class="btn btn-light">Button</a>
                          <p className="card-text"><small className="text-muted">meetup id: {meetup.id} </small></p>
					          		</div>
					          	</div>
          						

          						</div>)
          				}): <div></div>}

          			</div>
          			
          		</div>
          	</div>
        </div>
        )
    }
}

//////////////////////////////////////////////////////

const mapState = (state) => {
  return {
    user: state.user,
    // userMeetup: state.userMeetup
  }
}
const mapDispatch = (dispatch) => {
  return {
  };
};

export default connect(mapState, mapDispatch)(Dashboard);

