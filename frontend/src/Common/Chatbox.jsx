import { React, useState, useEffect, useContext } from 'react';
import { TextField, Button, makeStyles } from '@material-ui/core';
import styles from './Chatbox.module.css';
import { LobbyContext } from '../Context';
import socket from '../Socket';

const Chatbox = () => {
  const { state: lobbyState } = useContext(LobbyContext);
  const [msg, setMsg] = useState('');

  const playerNickname = lobbyState.nickname;

  const useStyles = makeStyles({
    textField: {
      width: '100%',
    },
    input: {
      fontSize: 'calc(5px + 1vmin)',
      backgroundColor: 'white',
      flexGrow: '3',
    },
    button: {
      width: '30%',
      fontSize: 'calc(5px + 1vmin)',
      color: 'white',
      backgroundColor: '#6930C3',
      '&:hover': {
        backgroundColor: '#7A41D4',
      },
      flexGrow: '1',
    },
  });

  const classes = useStyles();

  const sendChatMessage = () => {
    // eslint-disable-next-line no-unused-expressions
    msg && socket.emit('chat-message', { msg, playerNickname });
    setMsg('');
  };

  useEffect(() => {
    console.log('New chat message rendered');
    const element = document.getElementById('chatBox');
    element.scrollTop = element.scrollHeight;
  }, [lobbyState.chatMessages]); // Only re-run the effect if chat messages changes

  return (
    <>
      <div className={`${styles.chat}`}>
        <div id="chatBox" className={styles.chatBox}>
          {lobbyState.chatMessages.map((el, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p className={styles.chatMessages} key={index}>
              <b>{el.sender}</b> {el.msg}
            </p>
          ))}
        </div>
        <div className={styles.chatInputs}>
          <TextField
            variant="outlined"
            className={classes.textField}
            InputProps={{
              className: `${classes.input}`,
            }}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <Button variant="contained" className={classes.button} onClick={() => sendChatMessage()}>
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default Chatbox;
