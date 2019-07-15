import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';

import MainPage from './main/main_page';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import LobbyIndexContainer from './lobby/lobby_index_container';
import ScoreboardContainer from './scoreboard/scoreboard_container';

const App = () => (
  <div>
    <NavBarContainer />
    <div class="main-container">
      <Switch>
        <AuthRoute exact path="/" component={MainPage} />
        <AuthRoute exact path="/login" component={LoginFormContainer} />
        <AuthRoute exact path="/signup" component={SignupFormContainer} />
        <AuthRoute exact path="/scoreboard" component={ScoreboardContainer} />
      </Switch>
      <ProtectedRoute exact path="/" component={LobbyIndexContainer} />
    </div>
  </div>
);

export default App;