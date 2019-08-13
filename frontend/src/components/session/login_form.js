import React from 'react';
import { withRouter } from 'react-router-dom';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errors: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
    this.demoLogin = this.demoLogin.bind(this);
  }

  async demoLogin(e) {
    e.preventDefault();

    document.getElementById('signin').setAttribute("disabled", "");
    document.getElementById('demo').setAttribute("disabled", "");

    const demoUser = {
      username: 'demouser',
      password: 'demouser'
    };

    const sleep = ms => new Promise(res => setTimeout(res, ms));

    document.getElementById('username').focus();
    for (let i = 1; i <= demoUser.username.length; i++) {
      this.setState({ username: demoUser.username.substr(0, i) });
      await sleep(50);
    }

    await sleep(250);

    document.getElementById('password').focus();
    for (let i = 1; i <= demoUser.password.length; i++) {
      this.setState({ password: demoUser.password.substr(0, i) });
      await sleep(50);
    }

    await sleep(250);

    document.getElementById('signin').removeAttribute("disabled");
    document.getElementById('demo').removeAttribute("disabled");

    document.getElementById('signin').click();

    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errors: nextProps.errors })
  }


  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    let user = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.login(user);
  }

  renderErrors() {
    return (
      <ul>
        {Object.keys(this.state.errors).map((error, i) => (
          <li key={`error-${i}`}>
            {this.state.errors[error]}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div className="login-form-container">
        <form onSubmit={this.handleSubmit}>
          <h3>Login</h3>
          <div>
            <input type="text"
              value={this.state.username}
              onChange={this.update('username')}
              placeholder="Username"
              id="username"
            />
            <br />
            <input type="password"
              value={this.state.password}
              onChange={this.update('password')}
              placeholder="Password"
              id="password"
            />
            <br />
            <div className="login-form-buttons">
              <input type="submit" value="Submit" id="signin" />
              <button onClick={this.demoLogin} id="demo">Demo</button>
            </div>
            {this.renderErrors()}
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(LoginForm);