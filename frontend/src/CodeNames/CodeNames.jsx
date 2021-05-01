import { useContext, React } from 'react';
import { Redirect } from 'react-router-dom';
import { CircularProgress, Button, makeStyles } from '@material-ui/core';
import styles from './WordBoard.module.css';
import { CodenamesContext } from '../Context';
import socket from '../Socket';
import Word from './Word';

const CodeNames = ({ loggedIn }) => {
  const { state: gameState, dispatch } = useContext(CodenamesContext);

  const currentTeam = gameState.currentTurn;
  const redAmount = gameState.redScore;
  const blueAmount = gameState.blueScore;
  const { isGameOver } = gameState;
  const wordList = gameState.words;

  const handleSpyMasterBtn = () => {
    dispatch({ type: 'toggle-spymaster' });
  };

  const useStyles = makeStyles({
    endButton: {
      height: '2.5em',
      fontSize: 'calc(5px + 1vmin)',
      color: 'white',
      backgroundColor: currentTeam === 'Red' ? 'firebrick' : 'royalblue',
      '&:hover': {
        backgroundColor: currentTeam === 'Red' ? '#c96464' : '#7a96ea',
      },
    },
    spyMasterButton: {
      marginTop: '1em',
    },
    newGameButton: {
      color: 'white',
      backgroundColor: '#F72585',
      '&:hover': {
        backgroundColor: '#f966a8',
      },
    },
  });

  const classes = useStyles();

  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <>
      {!wordList ? (
        <>
          <h1>Game is loading...</h1>
          <CircularProgress />
        </>
      ) : (
        <>
          <div className={styles.WordBoardContainer}>
            <div className={styles.currentScoreIndicator} style={{ fontWeight: 'bold' }}>
              <span style={{ color: 'firebrick' }}>{redAmount}</span>
              <span> - </span>
              <span style={{ color: 'royalblue' }}>{blueAmount}</span>
            </div>
            <p
              className={styles.currentTurnIndicator}
              style={{ color: currentTeam === 'Red' ? 'firebrick' : 'royalblue' }}
            >{`${currentTeam}'s turn`}</p>
            <Button
              className={`${styles.endTurnButton} ${classes.endButton}`}
              disabled={isGameOver}
              variant="contained"
              onClick={() => socket.emit('codenames-change-turn', currentTeam)}
            >
              End Turn
            </Button>

            {wordList.map((item) => (
              <Word item={item} key={item.id} />
            ))}

            <div className={styles.gameOverInfo} style={{ visibility: isGameOver ? 'visible' : 'hidden' }}>
              {/* eslint-disable-next-line no-nested-ternary */}
              <h3>{redAmount === 0 ? `Red Won!` : blueAmount === 0 ? `Blue Won!` : `${currentTeam} hit the bomb!`}</h3>
              <Button className={classes.newGameButton} variant="contained" onClick={() => socket.emit('codenames-new-game')}>
                New Game
              </Button>
            </div>
            <Button
              className={`${styles.spyMasterBtn} ${classes.spyMasterButton}`}
              variant="contained"
              disabled={isGameOver}
              onClick={() => handleSpyMasterBtn()}
            >
              Spymaster
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default CodeNames;
