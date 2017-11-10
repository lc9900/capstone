import React from "react";

export default function Nav(props) {
  return (
    <div>
      <header className="masthead clearfix">
        <div className="inner">
          <nav className="nav nav-pills justify-content-end">
            <a className="nav-link active" href="#">
              Home
            </a>
            <a className="nav-link" href="#">
              Account
            </a>
            <a className="nav-link" href="#">
              Log Out
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
}
