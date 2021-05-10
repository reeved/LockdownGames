import { React } from 'react';
import styles from './Player.module.css';

const Opponent = ({ playerName, stack, currentBet, isOnAction, isDealer, isIn }) => {
  const cards = ['AH', 'QS'];
  return (
    <>
      <div className={styles.opponentContainer}>
        <div className={`${styles.mainInfo} ${isOnAction ? styles.isOnAction : null}`}>
          <div className={styles.playerInfo}>
            <span className={styles.playerName}>{playerName}</span>
            <span style={{ color: '#00bc00' }}>{stack}</span>
          </div>
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
