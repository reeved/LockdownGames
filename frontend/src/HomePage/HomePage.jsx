/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-duplicate-props */
import { React, useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { TextField, Button, makeStyles, FormHelperText } from '@material-ui/core';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './HomePage.module.css';
import socket from '../Socket';
import { LobbyContext } from '../Context';
import { ReactComponent as Illustration1 } from '../home1.svg';
import { ReactComponent as Illustration2 } from '../home2.svg';

const useStyles = makeStyles({
  textField: {
    display: 'flex',
    marginBottom: '1em',
  },
  input: {
    fontSize: 'calc(14px + 2vmin)',
    backgroundColor: `#6d6d6d`,
  },
  helperText: {
    fontSize: '1em',
  },
  button: {
    width: '100%',
    padding: '1em 0 1em 0',
    fontSize: 'calc(10px + 1vmin)',
    transition: 'all 1s cubic-bezier(0.25, 0.8, 0.25, 1)',
    marginTop: '2.5em',
    color: 'white',
    backgroundColor: ({ lobbyCode }) => (lobbyCode ? '#F72585' : '#5390d9'),
    '&:hover': {
      backgroundColor: ({ lobbyCode }) => (lobbyCode ? '#F966A8' : '#75a6e1'),
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

  let errorMsgText = ' ';

  const classes = useStyles({ lobbyCode });

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
    <Container fluid className={styles.container}>
      <Row className={styles.row}>
        <Col xs={3} className={`flexCol ${styles.leftCol}`}>
          <Illustration1 />
        </Col>
        <Col className={`flexCol ${styles.midCol}`}>
          <h1 className={styles.header}>LOCKDOWN GAMES</h1>
          <div className={styles.inputContainer}>
            <div className={styles.inputs}>
              <h1 className={styles.inputHeader}>LETS GO!</h1>
              <TextField
                error={nicknameError}
                helperText={errorMsg}
                className={classes.textField}
                InputProps={{
                  className: `${classes.input}`,
                }}
                FormHelperTextProps={{
                  className: `${classes.helperText}`,
                }}
                inputProps={{ maxLength: 10 }}
                variant="outlined"
                placeholder="Enter Nickname"
                onChange={(e) => validateNickname(e.target.value)}
              />
              <TextField
                error={notValid}
                helperText={errorMsgText}
                className={classes.textField}
                InputProps={{
                  className: classes.input,
                }}
                FormHelperTextProps={{
                  className: `${classes.helperText}`,
                }}
                inputProps={{ maxLength: 6 }}
                variant="outlined"
                placeholder="Enter Lobby Code"
                value={lobbyCode}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <Button
                type="button"
                className={`${classes.button}`}
                variant="contained"
                disabled={nicknameError || !nickname}
                onClick={handleBtnClick}
              >
                {lobbyCode ? `Join Lobby` : `Create Lobby`}
              </Button>
            </div>
          </div>
        </Col>
        <Col xs={3} className={`flexCol ${styles.rightCol}`}>
          <Illustration2 />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
