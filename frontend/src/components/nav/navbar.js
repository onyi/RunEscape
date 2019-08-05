import React from 'react';
import { Link } from 'react-router-dom';
import fire from '../../assets/fire/fire-transparent.png';

// import './navbar.css'

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.getLinks = this.getLinks.bind(this);
  }

  logoutUser(e) {
    e.preventDefault();
    this.props.logout();
  }

  getLinks() {
    if (this.props.loggedIn) {
      return (
        <div className="logout">
          <button onClick={this.logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div className="auth-wrapper">
          <Link to={'/signup'}>Signup</Link>
          <Link to={'/login'}>Login</Link>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="navbar">
        <div>
          <img className="fire-animation" src={fire} alt="fire" />
          <Link to={'/'} >
            <span className="logo">RunEscape</span>
          </Link>
        </div>
        
        { this.getLinks() }
      </div>
    );
  }
}

export default NavBar;