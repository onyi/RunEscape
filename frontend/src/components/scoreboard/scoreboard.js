import React from 'react';

import {withRouter} from 'react-router-dom';

class Scoreboard extends React.Component {
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      show: false,
      errors: {}
    }
    this.hideScoreboard = this.hideScoreboard.bind(this);
  };

  handleSubmit(e){
    e.preventDefault();
  }

  componentDidMount(){
    this.props.getScores();
  }

  showScoreboard(e){
    e.stopPropagation();
    this.setState({
      show: true
    })
  }

  hideScoreboard(e){
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      show: false
    })
    this.props.history.goBack();
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

  render(){
    let show = this.state.show ? 'block' : 'hidden';
    // console.log(`${JSON.stringify(this.props.scores)}`);
    let scores = 
      this.props.scores.length > 0 || this.props.scores !== undefined ? 
        this.props.scores.map(
          score => 
            <li key={score._id}>
              <p>{score.owner.username}:    {score.value}</p>
            </li>) 
      : "";

    return (
      <div id="scoreboard-overlay" style={{ display: `${show || "none"}` } } onClick={this.hideScoreboard}>
        {this.renderErrors()}
        <div className="scoreboard-container">
          <h1>Scoreboard</h1>
          <ul className="scoreboard-list">
            {scores}
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Scoreboard);