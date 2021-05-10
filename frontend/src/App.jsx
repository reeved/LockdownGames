import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppBar, Toolbar, Button, Grid, makeStyles } from '@material-ui/core';
import Particles from 'react-tsparticles';
import { LobbyContext, MongoContext } from './Context';
import useLobbyState from './Reducers/LobbyReducer';
import useMongoState from './Reducers/MongoReducer';
import WebsiteRoutes from './WebsiteRoutes';
import ParticleConfig from './particles-config';
import socket from './Socket';
import GeneralModal from './Components/GeneralModal';
import UserStats from './Components/UserStats';

const useStyles = makeStyles({
  loginButton: {
    color: ({ user }) => (user ? '#000' : '#fff'),
    backgroundColor: ({ user }) => (user ? '#d3d3d3' : '#F72585'),
    '&:hover': {
      backgroundColor: ({ user }) => (user ? '#ffffff' : '#F966A8'),
    },
  },
  toolbar: {
    background: '#303030',
  },
});

function App() {
  const { state: lobbyState, dispatch: lobbyDispatch } = useLobbyState();
  const { state: mongoState, dispatch: mongoDispatch } = useMongoState();

  const { loginWithPopup, logout, user } = useAuth0();

  const classes = useStyles({ user });

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
            <Toolbar className={`${classes.toolbar}`}>
              <h5 style={{ marginRight: '1em' }}>{user && `Hi, ${user['https://lockdown-games.nz/username'] || user.nickname}!`}</h5>
              {user && (
                <MongoContext.Provider value={{ state: mongoState, dispatch: mongoDispatch }}>
                  <GeneralModal buttonText="Stats" buttonEvent={() => socket.emit('get-mongo')} child={<UserStats />} />
                </MongoContext.Provider>
              )}
              <Grid item xs />
              {user && <img src={user.picture} alt="Profile" className="rounded-circle img-fluid profile-picture mr-4" />}
              <Button className={`${classes.loginButton}`} type="button" variant="contained" onClick={() => handleUser()}>
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
