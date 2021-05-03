/* eslint-disable no-unused-vars */
import { React } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import styles from './Player.module.css';

// eslint-disable-next-line arrow-body-style
const Player = ({ cards, currentCard, setSelected, selectedCards }) => {
  const currentValue = currentCard.charAt(0);
  const currentSuit = currentCard.charAt(1);

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

  return (
    <>
      <div className={styles.playerContainer}>
        <div className={styles.playerCards}>
          {cards.map((card, index) => {
            const cardValue = card.charAt(0);
            const cardSuit = card.charAt(1);
            const currentSelectedCard = selectedCards[0];
            let isDisabled;
            if (currentSelectedCard) {
              isDisabled = (card !== currentSelectedCard && cardValue !== currentValue) || cardValue !== currentSelectedCard.charAt(0);
            } else {
              isDisabled = cardValue !== currentValue && cardSuit !== currentSuit;
            }

            const isSelected = selectedCards.includes(card);

            return (
              <img
                key={index}
                className={`${styles.ownCardImage} ${isDisabled && styles.disabledCard} ${isSelected && styles.selectedCard}`}
                src={`CardImages/${card}.webp`}
                alt={`Card ${index + 1}`}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0}
                onKeyDown={() => setSelected(card)}
                onClick={() => setSelected(card)}
              />
            );
          })}
        </div>
        <div className={styles.buttonContainer}>
          <Button className={`${classes.button} ${classes.confirm}`} variant="contained" disableRipple>
            Confirm
          </Button>
          <Button className={`${classes.button} ${classes.draw}`} variant="contained" disableRipple>
            Draw/Skip
          </Button>
        </div>
      </div>
    </>
  );
};

export default Player;
