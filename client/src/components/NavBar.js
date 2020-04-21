import React from 'react';
import {withRouter, Link} from 'react-router-dom';

function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">
                FishOn
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                {
                    localStorage.getItem("token") ?
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/dashboard" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/catchlist" className="nav-link">Catches </Link>
                        </li>
                    </ul>
                    :
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                    </ul>
                }
                {
                    localStorage.getItem("token") &&
                        <span className="navbar-text">
                            <Link to="/" onClick={() => localStorage.removeItem("token")} className="btn btn-outline-primary">Signout</Link>
                        </span>
                }
            </div>
        </nav>
    );
}

export default withRouter(NavBar);