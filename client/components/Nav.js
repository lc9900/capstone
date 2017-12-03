import React from "react";
import {NavLink} from 'react-router-dom';

export default function Nav(props) {
  console.log("nav user: ", props.user)
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#">
          Rendezvous
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-item nav-link" to="/login" activeClassName="active">Home</NavLink>
            <NavLink className="nav-item nav-link" to="/meetup" activeClassName="active">Meetup</NavLink>
            <NavLink className="nav-item nav-link" to="/profile" activeClassName="active">Profile</NavLink>
            <NavLink className="nav-item nav-link" to="/dashboard" activeClassName="active">Dashboard</NavLink>

          </div>
          <div className='navbar-nav ml-auto'>
            {props.user.id && <button className='btn btn-danger ml-auto' onClick={props.logout}><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</button>}
          </div>
        </div>
      </nav>
    </div>
  );
}
