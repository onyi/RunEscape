
import { connect } from 'react-redux';
import { fetchLobby } from '../../actions/lobby_actions';
import { withRouter } from "react-router-dom";

import Lobby from "./lobby";

const mapStateToProps = state => ({
  lobbies: state.entities.lobbies,
  errors: state.errors.lobby
});

const mapDispatchToProps = dispatch => ({
  fetchLobby: id => dispatch(fetchLobby(id))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobby));