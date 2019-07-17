
import React from 'react';
import LobbyChatContainer from './lobby_chat_container';
import { Route } from "react-router-dom";
import GameContainer from '../game/game_container';


class LobbyIndex extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lobby: undefined,
      errors: {}
    };
  }

  componentDidMount() {
    this.props.fetchLobby(this.props.match.params.lobbyId)
      .then(() => {
        this.setState({
        lobby: this.props.lobbies[this.props.match.params.lobbyId]}
      )});
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
    if (this.state.lobby === undefined) return null;
  
    return (
      <div className="lobby" >
        {this.renderErrors()}
        <Route path="/lobbies/:lobbyId" component={GameContainer} />
        <Route path="/lobbies/:lobbyId" component={LobbyChatContainer} />
      </div>
    );
  }
}

export default LobbyIndex;