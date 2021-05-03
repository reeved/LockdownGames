/* eslint-disable no-unused-vars */
import { React, useContext, useState } from 'react';
import styles from './Player.module.css';
import { LobbyContext, PokerContext } from '../Context';
import ActionButtons from './ActionButtons';
import InputSlider from './InputSlider';

const Player = ({ handleAction }) => {
  const BIG_BLIND_VALUE = 20;
  const { state: pokerState } = useContext(PokerContext);
  const { state: lobbyState } = useContext(LobbyContext);

  const { nickname } = lobbyState;

  const [isRaise, setIsRaise] = useState(false);
  const handleBackButton = () => {
    setIsRaise(false);
  };

  const handleFakeRaiseButton = () => {
    setIsRaise(true);
  };
  let isDealer = false;
  let player = null;
  let stack = 0;
  let currentBet = null;
  pokerState.gameState.playerState.forEach((element) => {
    if (element.playerName === nickname) player = element;
    if (element.playerName === nickname) stack = player.stack;
  });
  if (pokerState.pokerRound) {
    pokerState.pokerRound.pokerActivePlayers.forEach((element, index) => {
      if (element.playerName === nickname) player = element;
      if (element.playerName === nickname) stack = element.stack;
      if (element.playerName === nickname) currentBet = element.currentBet;
      if (element.playerName === nickname && index === 0) isDealer = true;
    });
    pokerState.pokerRound.foldedPlayers.forEach((element) => {
      if (element.playerName === nickname) stack = element.stack;
    });
    pokerState.pokerRound.allInPlayers.forEach((element) => {
      if (element.playerName === nickname) stack = element.stack;
      if (element.playerName === nickname) currentBet = element.currentBet;
    });
  }
  const cards = pokerState.cardMap.get(nickname);
  const isOnAction = pokerState.pokerRound ? player.currentAction === 'onAction' : false;
  const minRaise = pokerState.pokerRound ? pokerState.pokerRound.currentRaise + BIG_BLIND_VALUE : 0;

  const handleRaiseButton = (amount) => {
    const amountRaised = amount - currentBet;
    handleAction('raise', amountRaised);
    setIsRaise(false);
  };

  return (
    <div className={styles.playerRow}>
      <div className={styles.playerContainer}>
        <div className={styles.betContainer}>
          {isDealer ? <img className={styles.dealerButton} src="PokerImages/Images/dealer.png" alt="dealer" /> : null}
          {currentBet && currentBet !== 0 ? (
            <div className={styles.bet}>
              <p>{currentBet}</p>
            </div>
          ) : null}
        </div>
        <div className={`${styles.mainInfo} ${isOnAction ? styles.isOnAction : null}`}>
          <span>{nickname}</span>
          <span>{stack}</span>
          <div className={styles.playerCards}>
            {cards ? (
              <img key={1} className={`${styles.cardImage} ${styles.ownCardImage}`} src={`PokerImages/Images/${cards.card1}.png`} alt="Card1" />
            ) : null}
            {cards ? (
              <img key={2} className={`${styles.cardImage} ${styles.ownCardImage}`} src={`PokerImages/Images/${cards.card2}.png`} alt="Card2" />
            ) : null}
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        {isRaise ? (
          <InputSlider minRaise={minRaise} maxRaise={stack + currentBet} handleBackButton={handleBackButton} handleRaiseButton={handleRaiseButton} />
        ) : (
          <ActionButtons
            handleAction={handleAction}
            isOnAction={isOnAction}
            pokerRound={pokerState.pokerRound}
            currentBet={currentBet}
            handleRaise={handleFakeRaiseButton}
            stack={stack}
          />
        )}
      </div>
    </div>
  );
};

export default Player;
