
import React from 'react';
import openSocket from 'socket.io-client';

class LobbyChat extends React.Component {
  constructor(props) {
    super(props)
    
    this.socket = openSocket(window.location.origin);

    this.state = {
      msg: ""
    }
    this.lobbyId = this.props.match.params.lobbyId;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
  }

  subscribeToChat(lobbyId) {
    console.log(`Subscribed to: 'chat message on ${lobbyId}'`)
    this.socket.on(`chat message to ${lobbyId}` , function (msg) {
      let element = document.getElementById("messages");
      element.insertAdjacentHTML('beforeend', `<div>${msg}</div>`)
      element.scrollTop = element.scrollHeight;
    });
  }

  componentDidMount() {
    this.subscribeToChat(this.lobbyId);
    this.socket.emit("chat message",
      {
        lobbyId: this.lobbyId,
        msg: `${this.props.currentUser.username} joined lobby`
      });

    Promise.resolve()
      .then(() => {
        this.props.joinLobby(this.lobbyId, this.props.currentUser.id)
      })
      .then(() => {
        this.socket.emit("relay action", {
          lobbyId: this.lobbyId,
          playerId: this.props.currentUser.id,
          playerAction: "joinLobby"
        });
      })
  }

  componentWillUnmount() {
    this.socket.off(`chat message to ${this.lobbyId}`);
  }

  handleSubmit(e) {
    e.preventDefault();

    if(this.state.msg !== "") {
      this.setState({ msg: "" });
      this.socket.emit("chat message", 
        { 
          lobbyId: this.lobbyId, 
          msg: `${this.props.currentUser.username}: ${this.state.msg}` 
        })
    } 
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
        <div className="lobby-chat">
          <ul id="messages"></ul>
          <form onSubmit={this.handleSubmit}>
            <input 
              type="text" 
              placeholder="Chat here" 
              autoComplete="off" 
              value={this.state.msg}
              onChange={this.update('msg')}
            />
            {/* <button>Send</button> */}
          </form>
        </div>
      </div>
    );
  }
}

export default LobbyChat;