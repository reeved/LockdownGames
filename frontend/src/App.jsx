import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { LobbyContext } from './Context';
import useLobbyState from './Reducers/LobbyReducer';
import WebsiteRoutes from './WebsiteRoutes';

function App() {
  const { state: lobbyState, dispatch: lobbyDispatch } = useLobbyState();

  return (
    <LobbyContext.Provider value={{ state: lobbyState, dispatch: lobbyDispatch }}>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            {/* <Link to="/" style={{ textDecoration: 'none' }}>
              <Button>Home</Button>
            </Link>
            <Link to="/lobby" style={{ textDecoration: 'none' }}>
              <Button>Lobby</Button>
            </Link>
            <Link to="/codenames" style={{ textDecoration: 'none' }}>
              <Button>Codenames</Button>
            </Link> */}
          </Toolbar>
        </AppBar>
        <header className="App-header">
          <WebsiteRoutes />
        </header>
      </div>
    </LobbyContext.Provider>
  );
}

export default App;
