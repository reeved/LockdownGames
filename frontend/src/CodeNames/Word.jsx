import { useContext, React } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';
import styles from './Word.module.css';
import socket from '../Socket';
import { CodenamesContext } from '../Context';

const useStyles = makeStyles({
  UnsafeWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'rgba(222,184,135,0.5)' : 'rgba(222,184,135)'),
  },

  BombWord: {
    backgroundColor: 'rgba(79, 79, 79)',
    color: 'white',
  },

  RedWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'rgba(178, 34, 34,0.5)' : 'rgba(178, 34, 34)'),
    color: 'white !important',
  },

  BlueWord: {
    backgroundColor: ({ isGameOver, isSelected }) => (isGameOver && !isSelected ? 'rgba(65,105,225,0.5)' : 'rgba(65,105,225)'),
    color: 'white !important',
  },
  UnselectedWord: {
    backgroundColor: 'white',
    color: 'black',
  },
});

const Word = ({ item }) => {
  const { state: gameState } = useContext(CodenamesContext);
  const { isGameOver, isSpyMaster } = gameState;
  const isSelected = gameState.selectedItems.includes(item.id);
  const revealWord = isSelected || isGameOver || isSpyMaster;
  const currentTeam = gameState.currentTurn;
  const classes = useStyles({ isGameOver, isSelected });

  const wordStyle = classNames({
    [styles.Word]: true,
    [styles.NoHover]: revealWord,
    [classes.RedWord]: item.status === `Red` && revealWord,
    [classes.BlueWord]: item.status === `Blue` && revealWord,
    [classes.BombWord]: item.status === `bomb` && revealWord,
    [classes.UnsafeWord]: item.status === `unsafe` && revealWord,
    [classes.UnselectedWord]: !revealWord,
  });

  const handleWordClick = (el) => {
    socket.emit('codenames-update-selected', el.id);
    if (el.status === 'bomb') {
      socket.emit('codenames-game-over');
    } else if (el.status === 'unsafe' || el.status !== currentTeam) {
      if (el.status !== currentTeam) {
        socket.emit('codenames-decrement-score', el.status);
      }
      socket.emit('codenames-change-turn', currentTeam);
    } else if (el.status === 'Red' || el.status === 'Blue') {
      if ((el.status === 'Red' && gameState.redScore === 1) || (el.status === 'Blue' && gameState.blueScore === 1)) {
        socket.emit('codenames-game-over', el.status);
      }
      socket.emit('codenames-decrement-score', el.status);
    }
  };

  return (
    <div className={wordStyle} role="button" tabIndex={0} onKeyDown={() => handleWordClick(item)} onClick={() => handleWordClick(item)}>
      {`${item.word}`}
    </div>
  );
};

export default Word;
