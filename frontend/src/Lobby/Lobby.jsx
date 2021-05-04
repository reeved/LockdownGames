/* eslint-disable react/no-array-index-key */
import { React, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Button, makeStyles } from '@material-ui/core';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './Lobby.module.css';
import socket from '../Socket';
import { LobbyContext } from '../Context';
import Chatbox from '../Common/Chatbox';
import AboutLobby from './AboutLobby';

const Lobby = ({ loggedIn }) => {
  const { state: lobbyState } = useContext(LobbyContext);

  const games = ['codenames', 'poker', 'lastcard'];

  const { players, isHost, chosenGame, gameStarted } = lobbyState;

  const canStart = players.length > 1 && isHost;

  const useStyles = makeStyles({
    startButton: {
      width: '50%',
      marginTop: '3em',
      fontSize: 'calc(5px + 1vmin)',
      color: 'white',
      backgroundColor: '#F72585',
      '&:hover': {
        backgroundColor: '#f966a8',
      },
      flexGrow: '1',
    },
    game: {
      height: '4em',
      fontSize: '1.2em',
    },
    activeGame: {
      backgroundColor: '#4cc9f0',
      '&:hover': {
        backgroundColor: '#70d4f3',
      },
    },
  });

  const classes = useStyles();

  const handleStartGameButton = () => {
    socket.emit('selected-game', true, chosenGame);
    socket.emit(`${chosenGame}-new-game`);
  };

  if (gameStarted) {
    return <Redirect to={`/${chosenGame}`} />;
  }

  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <Container fluid className={styles.container}>
      <h1>LOBBY</h1>
      <Row className={styles.gamesRow}>
        <Col xs={12}>
          <h2 className={styles.subheader}>{isHost ? 'Choose a Game' : 'Host is Choosing a Game'}</h2>
        </Col>
        {games.map((game, index) => (
          <Col key={index} xs={3} className={styles.game}>
            <Button
              variant="contained"
              className={`${classes.game}  ${chosenGame === game && classes.activeGame} ${!isHost && 'disabled'}`}
              role="button"
              tabIndex={0}
              onKeyDown={() => socket.emit('selected-game', false, game)}
              onClick={() => socket.emit('selected-game', false, game)}
            >
              {game === 'lastcard' ? 'Last Card' : game}
            </Button>
          </Col>
        ))}
      </Row>
      <Row className={styles.moreInfo}>
        <Col className="flexCol">
          <h2 className={styles.subheader}>About Lobby</h2>
          <AboutLobby />
          <Link to={`/${chosenGame}`} className={!canStart ? 'disabled' : ''} style={{ textDecoration: 'none' }}>
            <Button className={classes.startButton} size="large" disabled={!canStart} variant="contained" onClick={() => handleStartGameButton()}>
              {isHost ? 'Start Game' : 'Waiting for Host'}
            </Button>
          </Link>
        </Col>
        <Col className="flexCol">
          <h2 className={styles.subheader}>Players in Lobby ({players.length})</h2>
          <div className={styles.listContainer}>
            {players.map((player, index) => (
              <p className={styles.playerList} key={index}>
                {player}
              </p>
            ))}
          </div>
        </Col>
        <Col className="flexCol">
          <h2 className={styles.subheader}>Chat</h2>
          <Chatbox />
        </Col>
      </Row>
    </Container>
  );
};

export default Lobby;
