
import React from 'react';
import openSocket from 'socket.io-client';
import Game from '../game/game';

class LobbyChat extends React.Component {
  constructor(props) {
    super(props)
    
    this.socket = openSocket('http://localhost:3000');

    this.state = {
      lobby: {},
      msg: ""
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
  }

  subscribeToChat(lobbyId) {
    console.log(`Subscribed to: 'chat message on ${lobbyId}'`)
    this.socket.on(`chat message to ${lobbyId}` , function (msg) {
      document.getElementById('messages').insertAdjacentHTML('beforeend', `<div>${msg}</div>`)
    });
  }

  componentDidMount() {
    this.props.fetchLobbies()
      .then(payload => {
        this.setState({ lobby: this.props.lobbies[this.props.match.params.lobbyId] })})
      .then(() => this.subscribeToChat(this.state.lobby._id))
      .then(() => this.props.joinLobby(this.state.lobby._id, this.props.currentUser.id))
  }

  componentWillUnmount() {
    this.socket.off(`chat message to ${this.state.lobby._id}`);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ msg: "" });
    this.socket.emit("chat message", { lobbyId: this.state.lobby._id, msg: `${this.props.currentUser.username}: ${this.state.msg}` })
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
        <Game />
        <div className="lobby-chat">
          <ul id="messages"></ul>
          <form onSubmit={this.handleSubmit}>
            <input 
              type="text" 
              placeholder="Message" 
              autoComplete="off" 
              value={this.state.msg}
              onChange={this.update('msg')}
            />
            <button>Send</button>
          </form>
        </div>
      </div>
    );
  }
}

export default LobbyChat;