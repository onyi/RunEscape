
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLobbies, joinLobby } from '../../actions/lobby_actions';

import LobbyChat from "./lobby_chat";

const mapStateToProps = state => ({
  lobbies: state.entities.lobbies,
  currentUser: state.session.user,
  errors: state.errors.lobby
});

const mapDispatchToProps = dispatch => ({
  fetchLobbies: () => dispatch(fetchLobbies()),
  joinLobby: (lobbyId, currentUserId) => dispatch(joinLobby(lobbyId, currentUserId))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LobbyChat));