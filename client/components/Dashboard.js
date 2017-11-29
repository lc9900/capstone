import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchPlaces, fetchMeetups, fetchUserInfo } from '../store';
import { Redirect } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
// import {daysInMonth} from '../../utils';

class Dashboard extends Component {
    constructor(props){
        super();
        this.state = {

        };
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
    }

    handleChange(event) {
    }
    
    componentDidMount(props){
      const { getAllPlaces, getUsersMeetups } = this.props;
      getAllPlaces()
      const userId = this.props.user.id
      getUsersMeetups(userId)

    }
    
    getAddress(placeId){
      if(this.props.places.lengh > 0){
        const grepArr = $.grep(this.props.places, function(elem){ return elem.id === placeId})
        return grepArr[0]['address']  
      }
    }

    render(){
        //considered using card-group but decided against it as it is a new feature and not responsive

        const {user, place, userMeetup} = this.props;

        if(! user.id) return <Redirect to='/Login' />

        //ideally, i want an array of objects, where each object is a meetup with category, (my name), friend's name, time, status
        //assign to null and render empty div for render on component first mount
        let meetupsArray = user['meetups'] ? user['meetups']: null
        meetupsArray = _.orderBy(meetupsArray, ['time'],['desc'])
        const friendsArray = user['friends'] ? user['friends']: null
        const statusArray = user['status']? user['status']: null
        
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

                    // const userMeetupArray = userMeetup[0]

                    userMeetup.forEach(meetup =>{
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
					      				  <a href={`confirmation/${meetup.id}`} className="btn btn-light">Button</a>
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
  }
}
const mapDispatch = (dispatch) => {
  return {
    getAllPlaces: function(){
      return dispatch(fetchPlaces())
    },
    getUsersMeetups: function(userId){
      return dispatch(fetchMeetups(userId))
    }
  };
};

export default connect(mapState, mapDispatch)(Dashboard);

