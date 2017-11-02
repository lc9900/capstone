import React from 'react';
import { connect } from 'react-redux';
import { verifyUser, logout, fetchCart, clearCart } from '../store';
import { Redirect } from 'react-router-dom';

/* -----------------    COMPONENT     ------------------ */

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: ''
    };
    this.onLoginSubmit = this.onLoginSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onLoginSubmit(event) {
    const { message, loginUser } = this.props;
    const { email, password } = this.state;
    event.preventDefault();
    loginUser({ email, password})
      .then(() => {
				this.setState({
          email: '',
          password: ''
        });

				this.props.getCart(this.props.user.id);
      })
      .catch(err => {
        this.setState({error: err.response.data});
      });

  }

  render() {
    const { message, user, logoutUser } = this.props;
    const { error } = this.state;
    // If the user is already logged in, then redirect to home page
    if(user.id) {
      console.log("The logged in user is ", user);
      return (
              <div>
                <h2>Welcome back {user.name}</h2>
                <button onClick={logoutUser} className='btn btn-primary'>Logout</button>
              </div>
      );
    }

    return (
      <div>
        <div>
          <form onSubmit={this.onLoginSubmit}>

            <div className="form-group">
              <label>Email</label>
              {
                error.length > 0 ? <div className="form-group alert alert-danger">{error}</div> : <span></span>
              }
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

            <button type="submit" className="btn btn-block btn-primary">{message}</button>
          </form>
        </div>

        <hr/>

        <div>
          <p>
            <a
              href="/api/auth/google"
              className="btn btn-danger">
              <i className="fa fa-google" />
              <span>{message} with Google</span>
            </a>
          </p>
        </div>
      </div>
    );
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapState = (state) => {
  return {
    message: "Log in",
    user: state.user
  }
}
const mapDispatch = (dispatch) => {
  return {
    loginUser: function(credential){
      return dispatch(verifyUser(credential));
    },

    logoutUser: function(){
      dispatch(logout())
        .then(() => {
          dispatch(clearCart());
        });
		},

		getCart : function(id){
			return dispatch(fetchCart(id))
		}
  };
};

export default connect(mapState, mapDispatch)(Login);
