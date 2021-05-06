/* eslint-disable no-unused-vars */
import { React, useContext, useState } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import styles from './Player.module.css';
import socket from '../Socket';
import { LastCardContext, LobbyContext } from '../Context';

// eslint-disable-next-line arrow-body-style

const Player = ({ setSelected }) => {
  const { state, dispatch } = useContext(LastCardContext);
  const { state: lobbyState } = useContext(LobbyContext);
  const { nickname } = lobbyState;

  const { ownCards, lastPlayed, selectedCards, currentTurn, totalPickUp } = state;

  const [acePlayed, setAce] = useState(false);
  const [originalAce, setOriginalAce] = useState(null);
  const [tempCards, setTempCards] = useState(['AC', 'AD', 'AH', 'AS']);

  const currentValue = lastPlayed.slice(0, -1);
  const currentSuit = lastPlayed.slice(-1);

  const mustPlay5 = currentValue === '5' && totalPickUp !== 0;
  const mustPlay2 = currentValue === '2' && totalPickUp !== 0;

  const useStyles = makeStyles({
    button: {
      borderRadius: '50%',
      height: '0',
      width: '0',
      padding: '6vmin',
      fontSize: 'calc(5px + 1vmin)',
    },
    confirm: {
      color: 'white',
      backgroundColor: '#40916c',
      '&:hover': {
        backgroundColor: '#66a789',
      },
      marginRight: '3em',
    },
    draw: {
      color: 'white',
      backgroundColor: '#d00000',
      '&:hover': {
        backgroundColor: '#d93333',
      },
    },
  });

  const classes = useStyles();

  const confirmHandler = () => {
    if (selectedCards[0].slice(0, -1) === 'A') {
      setOriginalAce(selectedCards[0]);
      setTempCards(ownCards);
      if (acePlayed) {
        dispatch({ type: 'ace-played', hand: tempCards });
        socket.emit('lastcard-card-played', selectedCards, ownCards.length - selectedCards === 0, totalPickUp, originalAce);
      } else {
        console.log('Setting Cards');
        dispatch({ type: 'ace-played', hand: ['AC', 'AD', 'AH', 'AS'] });
      }
      setAce(!acePlayed);
    } else {
      socket.emit('lastcard-card-played', selectedCards, ownCards.length - selectedCards === 0, totalPickUp);
    }
  };

  const cancelHandler = () => {
    console.log('tempCards:', tempCards);
    console.log('Ace Played:', acePlayed);
    if (acePlayed) {
      dispatch({ type: 'ace-played', hand: tempCards });
      setTempCards(['AC', 'AD', 'AH', 'AS']);
      setAce(false);
    } else {
      socket.emit('lastcard-update-hand', totalPickUp || 1);
    }
  };

  return (
    <>
      <div className={styles.playerContainer}>
        <div className={styles.playerCards}>
          {ownCards.map((card, index) => {
            const cardValue = card.slice(0, -1);
            const cardSuit = card.slice(-1);
            const currentSelectedCard = selectedCards[0];
            let isActive;
            if (currentSelectedCard) {
              isActive = cardValue === currentSelectedCard.slice(0, -1);
            } else {
              isActive = cardValue === 'A' || cardValue === currentValue || cardSuit === currentSuit;
            }

            const isSelected = selectedCards.includes(card);

            return (
              <img
                key={index}
                className={`${styles.ownCardImage} ${!isActive ? styles.disabledCard : ''} ${isSelected ? styles.selectedCard : ''} ${
                  acePlayed ? styles.aceCard : ''
                }`}
                src={`CardImages/${card}.webp`}
                label="Card"
                alt=""
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
                onKeyDown={() => setSelected(card, acePlayed)}
                onClick={() => setSelected(card, acePlayed)}
              />
            );
          })}
        </div>
        <div className={`${styles.buttonContainer}`}>
          {acePlayed ? (
            <>
              <Button
                className={`${classes.button} ${classes.confirm}`}
                variant="contained"
                disableRipple
                disabled={
                  currentTurn !== nickname ||
                  selectedCards.length === 0 ||
                  (mustPlay5 && selectedCards[0].slice(0, -1) !== '5') ||
                  (mustPlay2 && selectedCards[0].slice(0, -1) !== '2')
                }
                onClick={() => confirmHandler()}
              >
                CONFIRM COLOUR
              </Button>
              <Button
                className={`${classes.button} ${classes.draw}`}
                disabled={currentTurn !== nickname}
                variant="contained"
                disableRipple
                onClick={() => cancelHandler()}
              >
                CANCEL
              </Button>
            </>
          ) : (
            <>
              <Button
                className={`${classes.button} ${classes.confirm}`}
                variant="contained"
                disableRipple
                disabled={
                  currentTurn !== nickname ||
                  selectedCards.length === 0 ||
                  (mustPlay5 && selectedCards[0].slice(0, -1) !== '5') ||
                  (mustPlay2 && selectedCards[0].slice(0, -1) !== '2')
                }
                onClick={() => confirmHandler()}
              >
                Confirm
              </Button>
              <Button
                className={`${classes.button} ${classes.draw}`}
                disabled={currentTurn !== nickname}
                variant="contained"
                disableRipple
                onClick={() => cancelHandler()}
              >
                Draw/Skip
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Player;
