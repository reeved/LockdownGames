import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Particles from 'react-tsparticles';
import { AppBar, Toolbar } from '@material-ui/core';
import { LobbyContext } from './Context';
import useLobbyState from './Reducers/LobbyReducer';
import WebsiteRoutes from './WebsiteRoutes';
import ParticleConfig from './particles-config';

function App() {
  const { state: lobbyState, dispatch: lobbyDispatch } = useLobbyState();

  return (
    <>
      <Particles params={ParticleConfig} />
      <LobbyContext.Provider value={{ state: lobbyState, dispatch: lobbyDispatch }}>
        <div className="App">
          <AppBar position="static">
            <Toolbar />
          </AppBar>
          <header className="App-content">
            <WebsiteRoutes />
          </header>
        </div>
      </LobbyContext.Provider>
    </>
  );
}

export default App;
