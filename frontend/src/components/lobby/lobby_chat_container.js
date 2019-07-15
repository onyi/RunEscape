
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchLobbies } from '../../actions/lobby_actions';
import jwt_decode from 'jwt-decode';


import LobbyChat from "./lobby_chat";

const mapStateToProps = state => ({
  lobbies: state.entities.lobbies,
  currentUser: state.session.user,
  errors: state.errors.lobby
});

const mapDispatchToProps = dispatch => ({
  fetchLobbies: () => dispatch(fetchLobbies())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LobbyChat));