
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Lobby from "./lobby_index";

const mapStateToProps = state => ({
  lobbies: Object.values(state.entities.lobbies),
  errors: state.errors.lobby
});

const mapDispatchToProps = dispatch => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Lobby));