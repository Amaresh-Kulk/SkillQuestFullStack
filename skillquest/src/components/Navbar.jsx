import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import MiniLogo from './SkillQuest.png';

export default class Navbar extends PureComponent {
  render() {
    // Check if the user is logged in by checking for a token in localStorage
    const isLoggedIn = localStorage.getItem('token');

    return (
      <div className="navbar">
        <div className="left-nav">
          <Link to="/">
            {/* <img src={MiniLogo} alt="SkillQuest Logo" /> */} SKILLQUEST
          </Link>
        </div>

        <div className="right-nav">
          <div className="home-icon">
            <Link to="/" aria-label="Home">
              <i className="fas fa-house-chimney"></i>
            </Link>
            <div className="tooltip">Home</div>
          </div>
          <div className="aptitude-icon">
            <Link to="/dashboard/aptitude" aria-label="Aptitude">
              <i className="fas fa-pen-to-square"></i>
            </Link>
            <div className="tooltip">Aptitude</div>
          </div>
          <div className="coding-icon">
            <Link to="/dashboard/coding" aria-label="Coding">
              <i className="fas fa-laptop-code"></i>
            </Link>
            <div className="tooltip">Coding</div>
          </div>

          {/* Conditionally render Profile or Sign In based on login state */}
          <div className="profile-icon">
            {isLoggedIn ? (
              <Link to="/dashboard/profile" aria-label="Profile">
                <i className="fas fa-user-circle"></i>
              </Link>
            ) : (
              <Link to="/login" className="no-underline-signin">
                Sign In
              </Link>
            )}
            <div className="tooltip">{isLoggedIn ? 'Profile' : 'Sign In'}</div>
          </div>
        </div>
      </div>
    );
  }
}
