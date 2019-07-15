
import { connect } from 'react-redux';

import Lobby from "./lobby";

const mapStateToProps = state => ({
  lobbies: Object.values(state.entities.lobbies),
  errors: state.errors.lobby
});

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);