import React from 'react';
import { Link } from 'react-router-dom';
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
        <div class="logout">
          <button onClick={this.logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div class="auth-wrapper">
          <Link to={'/signup'}>Signup</Link>
          <Link to={'/login'}>Login</Link>
        </div>
      );
    }
  }

  render() {
    return (
      <div class="navbar">
        <span class="logo">RunEscape</span>
        { this.getLinks() }
      </div>
    );
  }
}

export default NavBar;