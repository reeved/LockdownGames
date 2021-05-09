import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Toolbar, Button, Grid } from '@material-ui/core';
import Particles from 'react-tsparticles';
import { LobbyContext, MongoContext } from './Context';
import useLobbyState from './Reducers/LobbyReducer';
import useMongoState from './Reducers/MongoReducer';
import WebsiteRoutes from './WebsiteRoutes';
import ParticleConfig from './particles-config';
import socket from './Socket';
import GeneralModal from './Components/GeneralModal';
import UserStats from './Components/UserStats';

function App() {
  const { state: lobbyState, dispatch: lobbyDispatch } = useLobbyState();
  const { state: mongoState, dispatch: mongoDispatch } = useMongoState();

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
              <MongoContext.Provider value={{ state: mongoState, dispatch: mongoDispatch }}>
                <GeneralModal buttonText="Stats" buttonEvent={() => socket.emit('get-mongo')} child={<UserStats />} />
              </MongoContext.Provider>
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
