/* eslint-disable no-unused-vars */
import { React, useContext } from 'react';
import styles from './Player.module.css';
import { LobbyContext } from '../Context';

// eslint-disable-next-line arrow-body-style
const Opponent = ({ playerName, stack, currentBet, isOnAction, isDealer, isIn }) => {
  const { state: lobbyState } = useContext(LobbyContext);

  const { nickname, players } = lobbyState;

  const cards = ['AH', 'QS'];
  return (
    <>
      <div className={styles.opponentContainer}>
        <div className={`${styles.mainInfo} ${isOnAction ? styles.isOnAction : null}`}>
          <span>{playerName}</span>
          <span>{stack}</span>
          <div className={styles.opponentCards}>
            {isIn
              ? cards.map((card, index) => <img key={index} className={styles.cardImage} src="CardImages/blue_back.webp" alt={`Card ${index + 1}`} />)
              : null}
          </div>
          {/* {isIn ? (
            <div className={styles.opponentCards}>
              {cards.map((card, index) => (
                <img key={index} className={styles.cardImage} src="CardImages/blue_back.webp" alt={`Card ${index + 1}`} />
              ))}
            </div>
          ) : null} */}
        </div>
        <div className={styles.betContainer}>
          {isDealer ? <img className={styles.dealerButton} src="CardImages/dealer.webp" alt="dealer" /> : null}
          {currentBet && currentBet !== 0 ? (
            <div className={styles.bet}>
              <p>{currentBet}</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Opponent;
