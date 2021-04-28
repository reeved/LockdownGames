import { useContext, React } from 'react';
import { Redirect } from 'react-router-dom';
import { CircularProgress, Button } from '@material-ui/core';
import styles from './WordBoard.module.css';
import { LobbyContext, CodenamesContext } from '../Context';
import socket from '../Socket';
import Word from './Word';

const CodeNames = ({ loggedIn }) => {
  const { state: gameState, dispatch } = useContext(CodenamesContext);
  const { state: lobbyState } = useContext(LobbyContext);

  const { nickname } = lobbyState;
  const currentTeam = gameState.currentTurn;
  const redAmount = gameState.redScore;
  const blueAmount = gameState.blueScore;
  const { isGameOver } = gameState;
  const wordList = gameState.words;

  const handleSpyMasterBtn = () => {
    dispatch({ type: 'toggle-spymaster' });
  };

  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      {!wordList ? (
        <>
          <h1>Game is loading...</h1>
          <CircularProgress />
        </>
      ) : (
        <>
          <h1>CODENAMES</h1>
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
              className={styles.endTurnButton}
              disabled={isGameOver}
              variant="contained"
              onClick={() => socket.emit('codenames-change-turn', currentTeam)}
            >
              End Turn
            </Button>

            {wordList.map((item) => (
              <Word item={item} key={item.id} />
            ))}
            <p>
              Your name: <span style={{ fontWeight: 'bold' }}>{nickname}</span>
            </p>
            <div className={styles.gameOverInfo} style={{ visibility: isGameOver ? 'visible' : 'hidden' }}>
              {/* eslint-disable-next-line no-nested-ternary */}
              <h3>{redAmount === 0 ? `Red Won!` : blueAmount === 0 ? `Blue Won!` : `${currentTeam} hit the bomb!`}</h3>
              <Button variant="contained" onClick={() => socket.emit('codenames-new-game')}>
                New Game
              </Button>
            </div>
            <Button className={styles.spyMasterBtn} variant="contained" disabled={isGameOver} onClick={() => handleSpyMasterBtn()}>
              Spymaster
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CodeNames;
