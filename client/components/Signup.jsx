import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addUser } from '../store';
import { Redirect } from 'react-router-dom';

class Signup extends Component {

    constructor(){
        super();
        this.state = {
            userName: '',
            email: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.onLoginSubmit = this.onLoginSubmit.bind(this);
    }

    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onLoginSubmit(event){
        const { signup, user } = this.props;
        const { userName, email, password } = this.state;
        event.preventDefault();
        signup({
            name: userName,
            email, password
        })
            .then(() =>{
                this.setState({
                    userName: '',
                    email: '',
                    password: ''
                });
            })
    }

    render(){
        const { message, user } = this.props;
        console.log("sign up rendered")
        console.log("user in signup is: ", user)

        if (user.id) {
            // console.log("Got to redirect in signup")
            // return <Redirect to='/' />
            return (
                <div className='alert alert-success'>Sign up successful</div>
            )
        }

        return (
          <div className="signin-container">
            <div className="buffer local">
              <form onSubmit={this.onLoginSubmit}>

                <div className="form-group">
                  <label>Name</label>
                  <input
                    name="userName"
                    type="name"
                    className="form-control"
                    value={this.state.userName}
                    onChange={this.handleChange}
                    required
                  />

                </div>

                 <div className="form-group">
                  <label>Email</label>

                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                  />

                </div>

                 <div className="form-group">
                  <label>Password</label>

                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                  />

                </div>
                <button type="submit" className="btn btn-block btn-success">{message}</button>
              </form>
            </div>
          </div>
        );
    }
}



/* -----------------    CONTAINER     ------------------ */

const mapState = (state) => {
    return {
        user: state.user,
        message: 'Sign up'
    }
}

const mapDispatch = (dispatch) => {
    return {
        signup: function(userInfo){
            return dispatch(addUser(userInfo));
        }
    }
}

export default connect(mapState, mapDispatch)(Signup)
