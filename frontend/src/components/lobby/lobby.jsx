
import React from 'react';
import LobbyChatContainer from './lobby_chat_container';
import { Route } from "react-router-dom";

class LobbyIndex extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {}
    };
  }

  componentDidMount() {

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
      <div className="lobby" >
        {this.renderErrors()}
        <Route path="/lobbies/:lobbyId" component={LobbyChatContainer} />
      </div>
    );
  }
}

export default LobbyIndex;