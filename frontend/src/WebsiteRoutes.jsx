import { React, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LobbyContext, CodenamesContext, PokerContext, LastCardContext } from './Context';
import useCodenamesState from './Reducers/CodeNamesReducer';
import usePokerState from './Reducers/PokerReducer';
import uselastCardState from './Reducers/lastCardReducer';

import HomePage from './HomePage/HomePage';
import Lobby from './Lobby/Lobby';
import GameEnvironment from './GameEnvironment/GameEnvironment';

const WebsiteRoutes = () => {
  const { state: stateCodenames, dispatch: codenamesDispatch } = useCodenamesState();

  const { state: lobbyState } = useContext(LobbyContext);

  const { state: pokerState, dispatch: pokerDispatch } = usePokerState();

  const { state: LastCardState, dispatch: LastCardDispatch } = uselastCardState();

  const loggedIn = lobbyState.lobbyID;

  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/lobby">
        <Lobby loggedIn={loggedIn} />
      </Route>
      <Route path="/codenames">
        <CodenamesContext.Provider value={{ state: stateCodenames, dispatch: codenamesDispatch }}>
          <GameEnvironment loggedIn={loggedIn} component="Codenames" />
        </CodenamesContext.Provider>
      </Route>
      <Route path="/poker">
        <PokerContext.Provider value={{ state: pokerState, dispatch: pokerDispatch }}>
          <GameEnvironment loggedIn={loggedIn} component="Poker" />
        </PokerContext.Provider>
      </Route>
      <Route path="/lastcard">
        <LastCardContext.Provider value={{ state: LastCardState, dispatch: LastCardDispatch }}>
          <GameEnvironment loggedIn={loggedIn} component="Last Card" />
        </LastCardContext.Provider>
      </Route>
      <Route>
        <HomePage />
      </Route>
    </Switch>
  );
};

export default WebsiteRoutes;
