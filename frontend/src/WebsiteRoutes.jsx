import { React, useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { LobbyContext, CodenamesContext, PokerContext } from './Context';
import useCodenamesState from './Reducers/CodeNamesReducer';
import usePokerState from './Reducers/PokerReducer';

import HomePage from './HomePage/HomePage';
import Lobby from './Lobby/Lobby';
import CodeNames from './CodeNames/CodeNames';
import Poker from './Poker/Poker';

const WebsiteRoutes = () => {
  const { state: stateCodenames, dispatch: codenamesDispatch } = useCodenamesState();

  const { state: lobbyState } = useContext(LobbyContext);

  const { state: pokerState, dispatch: pokerDispatch } = usePokerState();

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
          <CodeNames loggedIn={loggedIn} />
        </CodenamesContext.Provider>
      </Route>
      <Route path="/poker">
        <PokerContext.Provider value={{ state: pokerState, dispatch: pokerDispatch }}>
          <Poker loggedIn={loggedIn} />
        </PokerContext.Provider>
      </Route>
      <Route>
        <HomePage />
      </Route>
    </Switch>
  );
};

export default WebsiteRoutes;
