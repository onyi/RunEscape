import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';

import MainPage from './main/main_page';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import LobbyIndexContainer from './lobby/lobby_index_container';
import LobbyContainer from './lobby/lobby_container';

import ScoreboardContainer from './scoreboard/scoreboard_container';

// import torch from '../assets/torch/torch-transparent-pixel-art-15-trim.png';
// import fire from '../assets/fire/fire-transparent.png';

const App = () => (
  <div>
    <div className="main-container">
      <div className="left-background">
        {/* <img className="left-torch" src={torch} />
        <img className="left-fire" src={fire} /> */}
      </div>
      <div className="main-content">
        <NavBarContainer />
        <Switch>
          <AuthRoute exact path="/" component={MainPage} />
          <AuthRoute exact path="/login" component={LoginFormContainer} />
          <AuthRoute exact path="/signup" component={SignupFormContainer} />
          <ProtectedRoute exact path="/scoreboard" component={ScoreboardContainer} />
          <ProtectedRoute path="/lobbies/:lobbyId" component={LobbyContainer} />
        </Switch>
        <ProtectedRoute exact path="/" component={LobbyIndexContainer} />
      </div>
      <div className="right-background">
        {/* <img className="right-torch" src={torch} />
        <img className="right-fire" src={fire} /> */}
      </div>
    </div>
  </div>
);

export default App;
