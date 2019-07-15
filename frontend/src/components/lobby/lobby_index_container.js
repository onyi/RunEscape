
import { connect } from 'react-redux';
import { fetchLobbies, createLobby } from '../../actions/lobby_actions';

import LobbyIndex from "./lobby_index";

const mapStateToProps = state => ({
  lobbies: Object.values(state.entities.lobbies),
  errors: state.errors.lobby
});

const mapDispatchToProps = dispatch => ({
  fetchLobbies: () => dispatch(fetchLobbies()),
  createLobby: (lobby) => dispatch(createLobby(lobby))
})

export default connect(mapStateToProps, mapDispatchToProps)(LobbyIndex);