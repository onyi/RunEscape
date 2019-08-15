
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
    this.handleSingleplayer = this.handleSingleplayer.bind(this);
  }

  handleSingleplayer(e) {
    e.preventDefault();

    this.props.createLobby({
      name: Date.now().toString(),
      hostPlayerId: this.state.hostPlayerId,
      gameMode: 1
    })
      .then(payload => {
        this.props.history.push(`lobbies/${payload.lobby._id}`
        )})
  }

  componentDidMount() {
    this.props.fetchLobbies()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errors: nextProps.errors })
  }
  
  handleSubmit(e) {
    e.preventDefault();

    this.props.createLobby(this.state)
      .then(payload => {
        this.props.history.push(`lobbies/${payload.lobby._id}`
      )})
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
      <div className="lobby-list-container lobby-index">
        <form onSubmit={this.handleSingleplayer}>
          <input type="submit" value="SinglePlayer" />
        </form>

        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Lobby Name" onChange={this.update('name')} value={this.state.name} />
          <input type="submit" value="Create Lobby" />
          {this.renderErrors()}
        </form>

        <ul className="lobby-list">
          {this.props.lobbies.map(lobby => {
              if ( lobby.gameMode === 0){
                return (
                  <li key={`lobby-${lobby._id}`} className="lobby-index-item">
                    <Link to={`lobbies/${lobby._id}`}>
                      {lobby.name}
                    </Link>
                  </li>
                )
              }
            }
          )}
        </ul>
      </div>
    );
  }
}

export default LobbyIndex;