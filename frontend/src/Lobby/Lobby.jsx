/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
import { React, useState, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Grid, TextField, Button, makeStyles } from '@material-ui/core';
import styles from './Lobby.module.css';
import socket from '../Socket';
import { LobbyContext } from '../Context';

const useStyles = makeStyles({
  textField: {
    width: '80%',
  },
  input: {
    fontSize: 'calc(10px + 1vmin)',
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    fontSize: 'calc(10px + 1vmin)',
    backgroundColor: 'tan',
    '&:hover': {
      backgroundColor: 'navajowhite',
    },
  },
});

const Lobby = ({ loggedIn }) => {
  const { state: lobbyState } = useContext(LobbyContext);
  const classes = useStyles();
  const [chosenGame, setGame] = useState('codenames');
  const [msg, setMsg] = useState('');

  const games = ['codenames', 'poker', 'tahi', 'scum'];

  const playerNickname = lobbyState.nickname;
  const players = lobbyState.players;
  const lobbyID = lobbyState.lobbyID;

  const sendChatMessage = () => {
    // eslint-disable-next-line no-unused-expressions
    msg && socket.emit('chat-message', { msg, playerNickname });
    setMsg('');
  };

  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className={styles.container}>
      <h1>LOBBY</h1>
      <div className={styles.gameContainer}>
        <h2 className={styles.subheader}>Select Game</h2>
        <div className={styles.gamesList}>
          {games.map((game, index) => (
            <div
              key={index}
              className={`${styles.game} ${chosenGame === game && styles.activeGame}`}
              role="button"
              tabIndex={0}
              onKeyDown={() => setGame(game)}
              onClick={() => setGame(game)}
            >
              {game}
            </div>
          ))}
        </div>
      </div>
      <Grid container spacing={5}>
        <Grid container item lg={4} alignItems="stretch">
          <div className={`${styles.moreInfo} ${styles.aboutGame}`}>
            <h2 className={styles.subheader}>About Game</h2>
            <h3>{`Your Name: ${playerNickname}`}</h3>
            <h3>{`Lobby ID: ${lobbyID}`}</h3>
            <Link to={`/${chosenGame}`} style={{ textDecoration: 'none' }}>
              <Button size="large" variant="contained" onClick={() => socket.emit(`${chosenGame}-new-game`)}>
                Start Game
              </Button>
            </Link>
          </div>
        </Grid>
        <Grid container item lg={4} alignItems="stretch">
          <div className={`${styles.moreInfo} ${styles.lobbyPlayers}`}>
            <h2 className={styles.subheader}>Players in Lobby</h2>
            {players.map((player, index) => (
              <p className={styles.playerList} key={index}>
                {player}
              </p>
            ))}
          </div>
        </Grid>
        <Grid container item lg={4} alignItems="stretch">
          <div className={`${styles.moreInfo} ${styles.chat}`}>
            <h2 className={styles.subheader}>Chat</h2>
            <div className={styles.chatBox}>
              {lobbyState.chatMessages.map((el, index) => (
                <p className={styles.chatMessages} key={index}>
                  {el}
                </p>
              ))}
            </div>
            <div className={styles.chatInputs}>
              <TextField
                variant="outlined"
                style={{ width: '70%' }}
                className={classes.textField}
                InputProps={{
                  className: `${classes.input}`,
                }}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <Button variant="contained" style={{ width: '25%' }} className={classes.button} onClick={() => sendChatMessage()}>
                Submit
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Lobby;
