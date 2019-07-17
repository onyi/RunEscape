
import React from 'react';
import { Link } from "react-router-dom";

class LobbyIndex extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: "",
      hostPlayerId: this.props.currentUser.id,
      errors: {}
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
  }

  componentDidMount() {
    this.props.fetchLobbies();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errors: nextProps.errors })
  }
  
  handleSubmit(e) {
    e.preventDefault();

    this.props.createLobby(this.state);
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
      <div className="lobby-list-container">
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Lobby Name" onChange={this.update('name')} value={this.state.name} />
          <input type="submit" value="Create Lobby" />
          {this.renderErrors()}
        </form>
        <h3>Lobby List</h3>
        <ul className="lobby-list">
          {this.props.lobbies.map(lobby => (
            <li key={`lobby-${lobby._id}`}>
              <Link to={`lobbies/${lobby._id}`}>
                {lobby.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default LobbyIndex;