import { React } from 'react';
import styles from './Player.module.css';

const Opponent = ({ playerName, stack, currentBet, isOnAction, isDealer, isIn }) => {
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
        </div>
        <div className={styles.betContainer}>
          {isDealer ? <img className={styles.dealerButton} src="CardImages/dealer.png" alt="dealer" /> : null}
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
