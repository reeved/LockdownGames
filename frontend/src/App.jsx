import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Toolbar, Button, Grid } from '@material-ui/core';
import Particles from 'react-tsparticles';
import { LobbyContext } from './Context';
import useLobbyState from './Reducers/LobbyReducer';
import WebsiteRoutes from './WebsiteRoutes';
import ParticleConfig from './particles-config';

function App() {
  const { state: lobbyState, dispatch: lobbyDispatch } = useLobbyState();

  const { loginWithPopup, logout, user } = useAuth0();

  const handleUser = () => {
    if (user) {
      logout();
    } else {
      loginWithPopup();
    }
  };

  return (
    <>
      <Particles params={ParticleConfig} />
      <LobbyContext.Provider value={{ state: lobbyState, dispatch: lobbyDispatch }}>
        <div className="App">
          <AppBar position="static">
            <Toolbar>
              <h5>{user && `Hi, ${user['https://lockdown-games.nz/username'] || user.nickname}!`}</h5>
              <Grid item xs />
              {user && (
                <Button className="rounded-circle img-fluid profile-picture mr-4 ">
                  <img src={user.picture} alt="Profile" className="rounded-circle img-fluid profile-picture " />
                </Button>
              )}
              <Button type="button" variant="contained" onClick={() => handleUser()}>
                {user ? 'Log out' : 'Log in \\ Sign up'}
              </Button>
            </Toolbar>
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
