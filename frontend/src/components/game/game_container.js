
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Game from "./game";

const mapStateToProps = ( state, ownProps ) => ({
  lobbies: state.entities.lobbies,
  currentUser: state.session.user
});

const mapDispatchToProps = dispatch => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));