import React from 'react';

class Scoreboard extends React.Component {
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    

  }

  handleSubmit(e){
    e.preventDefault();
  } 

  componentDidMount(){
    this.props.getScores();
  }

  render(){

    // console.log(`${JSON.stringify(this.props.scores)}`);
    let scores = this.props.scores ? this.props.scores.map(score => <li><p>{score.value}</p></li>) : ""

    return (
      <div className="scoreboard-container">
        <h1>Scoreboard</h1>
        <ul>
          {scores}
        </ul>
      </div>
    );
  }
}

export default Scoreboard;