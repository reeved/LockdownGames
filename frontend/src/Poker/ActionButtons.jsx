import { React } from 'react';
import { Button, makeStyles } from '@material-ui/core';
// import styles from './Player.module.css';

function ActionButtons({ handleAction, isOnAction, pokerRound, currentBet, handleRaise, stack }) {
  const useStyles = makeStyles({
    button: {
      color: 'white',
      borderRadius: '50%',
      height: '0',
      width: '0',
      padding: '5vmin',
      fontSize: 'calc(5px + 1vmin)',
      // marginRight: '1em',
    },
    fold: {
      backgroundColor: '#d00000',
      '&:hover': {
        backgroundColor: '#d93333',
      },
    },
    check: {
      backgroundColor: '#40916c',
      '&:hover': {
        backgroundColor: '#66a789',
      },
    },
    call: {
      backgroundColor: '#7209B7',
      '&:hover': {
        backgroundColor: '#9c53cd',
      },
    },
    raise: {
      backgroundColor: '#F72585',
      '&:hover': {
        backgroundColor: '#f966aa',
      },
    },
  });
  const classes = useStyles();
  return (
    <>
      <Button
        className={`${classes.button} ${classes.fold}`}
        variant="contained"
        disabled={!isOnAction || (pokerRound && pokerRound.currentRaise === 0)}
        onClick={() => handleAction('fold', 0)}
      >
        Fold
      </Button>
      <Button
        className={`${classes.button} ${classes.check}`}
        variant="contained"
        disabled={!isOnAction || (pokerRound && pokerRound.currentRaise !== currentBet)}
        onClick={() => handleAction('check', 0)}
      >
        Check
      </Button>
      <Button
        className={`${classes.button} ${classes.call}`}
        variant="contained"
        disabled={!isOnAction || (pokerRound && currentBet >= pokerRound.currentRaise)}
        onClick={() => handleAction('call', Math.min(stack, pokerRound.currentRaise - currentBet))}
      >
        Call
      </Button>
      <Button className={`${classes.button} ${classes.raise}`} variant="contained" disabled={!isOnAction} onClick={() => handleRaise()}>
        {pokerRound && pokerRound.currentRaise === 0 ? 'Bet' : 'Raise'}
      </Button>
    </>
  );
}

export default ActionButtons;
