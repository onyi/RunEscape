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
    return (
      <div className="scoreboard-container">
        <h1>Scoreboard</h1>
      </div>
    );
  }
}

export default Scoreboard;