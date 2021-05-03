/* eslint-disable no-unused-vars */
import { React, useContext } from 'react';
import styles from './Player.module.css';
import { LobbyContext } from '../Context';

// eslint-disable-next-line arrow-body-style
const Opponent = ({ props, isTurn }) => {
  const { name, handSize, isPlaying } = props;

  const cards = [];

  for (let i = 0; i < handSize; i += 1) {
    cards.push(<img key={i} className={`${styles.cardImage} ${styles.opponentCard}`} src="PokerImages/Images/blue_back.png" alt={`Card ${i + 1}`} />);
  }
  return (
    <>
      <div className={`${styles.mainInfo}`}>
        <h6>{name}</h6>
        <span className={`${isTurn && styles.isTurn}`} />
        <div className={styles.playerCards}>{cards}</div>
        <p>{handSize} cards left</p>
      </div>
    </>
  );
};

export default Opponent;
