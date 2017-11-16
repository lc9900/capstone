import React from "react";
import {NavLink} from 'react-router-dom';

export default function Nav(props) {
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
            <NavLink className="nav-item nav-link" to="/" activeClassName="active">Home</NavLink>
            <NavLink className="nav-item nav-link" to="/newproposal" activeClassName="active">New Rendezvous</NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}
