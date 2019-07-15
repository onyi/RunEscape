
import React from 'react';
import { Link } from "react-router-dom";

class LobbyIndex extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      text: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
  }

  componentDidMount() {
  }

  handleSubmit(e) {
    e.preventDefault();

  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
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
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Lobby Name" onChange={this.update('name')} value={this.state.name} />
          <input type="submit" value="Create Lobby" />
          {this.renderErrors()}
        </form>
        <ul>
          {this.props.lobbies.map(lobby => (
            <Link to={`lobbies/${lobby.id}`}>
              <li key={`lobby-${lobby.id}`}>
                {lobby.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    );
  }
}

export default LobbyIndex;