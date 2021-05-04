/* eslint-disable react/jsx-no-duplicate-props */
import { React, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Grid, TextField, Button, makeStyles } from '@material-ui/core';
import styles from './HomePage.module.css';
import socket from '../Socket';
import { LobbyContext } from '../Context';

const useStyles = makeStyles({
  textField: {
    width: '80%',
  },
  input: {
    fontSize: 'calc(10px + 1.4vmin)',
    backgroundColor: `hsl(34, 57%, 70%)`,
  },
  button: {
    width: '100%',
    padding: '1em 0 1em 0',
    fontSize: 'calc(10px + 1vmin)',
    marginTop: '2em',
    backgroundColor: ({ lobbyCode }) => (lobbyCode ? 'Teal' : 'Coral'),
    '&:hover': {
      backgroundColor: ({ lobbyCode }) => (lobbyCode ? 'CadetBlue' : 'DarkSalmon'),
    },
  },
});

const HomePage = () => {
  const { state: lobbyState } = useContext(LobbyContext);
  const [nickname, setNickname] = useState('');
  const [lobbyCode, setCode] = useState('');
  const [nicknameError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(' ');

  const notValid = lobbyState.lobbyID.length !== 6 && lobbyState.lobbyID !== false;

  let errorMsgText;

  const classes = useStyles({ lobbyCode });

  const userHasInput = nickname || lobbyCode;

  const handleBtnClick = () => {
    if (lobbyCode) {
      socket.emit('join-lobby', nickname, lobbyCode);
    } else {
      socket.emit('create-lobby', nickname);
    }
  };

  const validateNickname = (text) => {
    if (/\s/.test(text)) {
      setError(true);
      setErrorMsg('Nicknames cannot have spaces.');
    } else {
      setError(false);
      setErrorMsg(' ');
      setNickname(text);
    }
  };

  if (lobbyState.lobbyID === 1) {
    errorMsgText = 'This lobby does not exist. Try another code, or create a Lobby.';
  } else if (lobbyState.lobbyID === 2) {
    errorMsgText = 'This lobby is full.';
  } else if (lobbyState.lobbyID === 3) {
    errorMsgText = 'This lobby is currently in game.';
  } else if (lobbyState.lobbyID === 4) {
    errorMsgText = 'There is already a player with that nickname in the lobby.';
  }

  if (lobbyState.lobbyID.length === 6) {
    return <Redirect to="/lobby" />;
  }
  return (
    <div className={styles.container}>
      <h1>LOCKDOWN GAMES</h1>
      <Grid container spacing={3} justify="center">
        <Grid container item xs={12} md={4} lg={4} justify="flex-end" alignItems="center" style={{ marginBottom: '1.25rem' }}>
          <p>Nickname</p>
        </Grid>
        <Grid container item xs={12} md={8} lg={8} justify="flex-start">
          <TextField
            error={nicknameError}
            helperText={errorMsg}
            className={classes.textField}
            InputProps={{
              className: `${classes.input}`,
            }}
            inputProps={{ maxLength: 10 }}
            variant="outlined"
            onChange={(e) => validateNickname(e.target.value)}
          />
        </Grid>
        <Grid container item xs={12} md={4} lg={4} justify="flex-end" alignItems="center">
          <p>Lobby Code</p>
        </Grid>
        <Grid container item xs={12} md={8} lg={8} justify="flex-start">
          <TextField
            error={notValid}
            helperText={errorMsgText}
            className={classes.textField}
            InputProps={{
              className: classes.input,
            }}
            inputProps={{ maxLength: 6 }}
            variant="outlined"
            value={lobbyCode}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          {userHasInput && (
            <Button type="button" className={`${classes.button}`} variant="contained" disabled={nicknameError || !nickname} onClick={handleBtnClick}>
              {lobbyCode ? `Join Lobby` : `Create Lobby`}
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
