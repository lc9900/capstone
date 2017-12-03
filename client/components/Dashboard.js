import React, {Component} from 'react';
import { connect } from 'react-redux';
import { fetchPlaces, fetchMeetups, fetchUserInfo } from '../store';
import { Redirect } from 'react-router-dom';
import * as _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { loadUser } from "../store";

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
      const { getAllPlaces, getUsersMeetups, loadSessionUser } = this.props;
      getAllPlaces()
      const userId = this.props.user.id
      getUsersMeetups(userId)
      loadSessionUser()

    }

    getAddress(placeId){
      if(this.props.places.length > 0){
        const grepArr = $.grep(this.props.places, function(elem){ return elem.id === placeId})
        if(grepArr[0]) {return grepArr[0]['address']}
        else return ''
      }
    }

    getName(placeId){
      if(this.props.places.length > 0){
        const grepArr = $.grep(this.props.places, function(elem){ return elem.id === placeId})
        if(grepArr[0]) {return grepArr[0]['name']}
        else return ''
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
          	<div className="container-fluid dashboard-container">
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
                        meetupTime = moment(meetup.time).tz('America/New_York').format("YYYY/MM/DD HH:mm-ssZ").split(/-|\+/)[0]
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
                          meetupCategory = "Outgoing"
                          backgroundClass = "outgoing"
                          placeMessage = `-`
                        }
                        else if (meetup.status === "initiated" && !meetup.initiator){
                          meetupCategory = "Incoming"
                          backgroundClass = "incoming"
                          placeMessage = `-`
                        }
                        else {
                          meetupCategory = "Accepted"
                          backgroundClass = "accepted"
                        }
                      }
                    })

          					return (<div className="meetup" key={meetup.id}>
          						<div className="card border-secondary">
					          		
                        <div className={`card-header ${backgroundClass}`}> 
                          <div className="row">
                            <div className="col-6"><h1 className='lead'>{meetupCategory}</h1></div>
                            <div className="col-6"><a href={`confirmation/${meetup.id}`} className="btn btn-dark float-right"><i className='fa fa-drivers-license-o'/></a></div>
                          </div>
                          
                        </div>


                        <div className="card-body">
					          			<h4 className="card-title">Meet with {meetupFriendName}</h4>
                          <p className="card-text"><strong>When:</strong> {
                              meetupTime
                            }</p>
                          <p className="card-text"><strong>Where:</strong> {meetup.placeId ? this.getName(meetup.placeId) : placeMessage}</p>
                          <p className="card-text"><strong>Address:</strong> {meetup.placeId ? this.getAddress(meetup.placeId) : '-'}</p>
                          
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
    },
    loadSessionUser: () => dispatch(loadUser())
  };
};

export default connect(mapState, mapDispatch)(Dashboard);

