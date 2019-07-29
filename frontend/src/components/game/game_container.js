
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Game from "./game";

import { fetchLobby } from "../../actions/lobby_actions";
import {
  postScore,
  getScores
} from '../../actions/score_actions';

const mapStateToProps = ( state, ownProps ) => {
  console.log(`lobbyId: ${ownProps.match.params.lobbyId}`);
  return {
    lobbies: state.entities.lobbies,
    currentUser: state.session.user,
    scores: Object.values(state.entities.scores),
    lobbyId: ownProps.match.params.lobbyId
  }

};

const mapDispatchToProps = dispatch => ({
  fetchLobby: (id) => dispatch(fetchLobby(id)),
  postScore: (value) => dispatch(postScore(value)),
  getScores: () => dispatch(getScores())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));