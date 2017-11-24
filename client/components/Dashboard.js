import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchPlaces, fetchMeetups, fetchUserInfo } from '../store';
import { Redirect } from 'react-router-dom';
// import * as _ from 'lodash';
import axios from 'axios';
// import {daysInMonth} from '../../utils';

class Dashboard extends Component {
    constructor(props){
        super();
        this.state = {
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
      
      //putting all places in database into store for now. 
      //can try to look through only places related to user later 
      //but it involves looking at both user's places and user's meetup's places
      const placesThunk = fetchPlaces()
      store.dispatch(placesThunk)

    	//getting all information about user with include: [{all:true}]
      const userId = this.props.user.id
      const userInfoThunk = fetchUserInfo(userId)
      store.dispatch(userInfoThunk)
    	
      //this is not working
      const userMeetupThunk = fetchMeetups(userId)
      store.dispatch(userMeetupThunk)


      
      //given user id, give me a list of meetup ids and a list of meetups that include users in that meetup
    	const meetupIdArray=[]
      const meetupIncludeUserArray=[]
    	axios.get(`/api/user/${userId}/meetups`)
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
    
    getAddress(placeId){
      const grepArr = $.grep(this.props.places, function(elem){ console.log(elem, placeId);return elem.id === placeId})
      return grepArr[0]['address']
    }

    render(){
        //considered using card-group but decided against it as it is a new feature and not responsive

        const {user, places, userInfo, userMeetup} = this.props;
        const {meetupIdArray, meetupIncludeUserArray} = this.state;
        if(! user.id) return <Redirect to='/Login' />

        console.log('read whole object here', userInfo)
        console.log('read whole object here', meetupIncludeUserArray)
        console.log(userMeetup)
        
        //ideally, i want an array of objects, where each object is a meetup with category, (my name), friend's name, time, status
        //assign to null and render empty div for render on component first mount
        const meetupsArray = userInfo['meetups'] ? userInfo['meetups']: null
        const friendsArray = userInfo['friends'] ? userInfo['friends']: null
        const statusArray = userInfo['status']? userInfo['status']: null
        
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
                          <p className="card-text">place: {meetup.placeId ? this.getAddress(meetup.placeId) : placeMessage}</p>
					      				  <a href="#" className="btn btn-light">Button</a>
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
    places: state.place,
    userMeetup: state.userMeetup,
    userInfo: state.userDashboard
  }
}
const mapDispatch = (dispatch) => {
  return {
  };
};

export default connect(mapState, mapDispatch)(Dashboard);

