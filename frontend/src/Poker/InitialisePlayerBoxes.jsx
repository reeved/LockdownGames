// import '../css/benT.css';

import React from 'react';
import styles from './Poker.module.css';

function InitialisePlayerBoxes({ playerState }, cardMap) {
  const playerBoxes = playerState.map((player) => {
    const cards = cardMap.has(player.playerName) ? cardMap.get(player.playerName) : null;
    return <PlayerBox key={player.playerName} player={player} cards={cards} />;
  });

  return <div>{playerBoxes}</div>;
}

function PlayerBox({ player, cards }) {
  let cardImage1 = 'blue_back';
  let cardImage2 = 'blue_back';
  if (cards) {
    cardImage1 = cards.card1;
    cardImage2 = cards.card2;
  }
  return (
    <div className="playerBox">
      {player.playerName}
      {player.stack}
      <img className={styles.cardImage} src={`PokerImages/Images/${cardImage1}.png`} alt="Card 1" />
      <img className={styles.cardImage} src={`PokerImages/Images/${cardImage2}.png`} alt="Card 2" />
    </div>
  );
}

export default InitialisePlayerBoxes;
