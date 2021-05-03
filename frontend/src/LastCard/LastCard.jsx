/* eslint-disable no-unused-vars */
import { useState, useContext, React } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { LastCardContext } from '../Context';
import styles from './LastCard.module.css';

import socket from '../Socket';
import Opponent from './Opponent';
import Player from './Player';

function LastCard({ loggedIn }) {
  const { state, dispatch } = useContext(LastCardContext);

  const { playersState, ownCards, lastPlayed, currentTurn, totalPickUp, selectedCards } = state;

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  const handleCardClick = (card) => {
    let cards = selectedCards;
    const exists = selectedCards.includes(card);
    if (exists) {
      cards = cards.filter((c) => c !== card);
    } else {
      cards = [...cards, card];
    }

    dispatch({
      type: 'set-selected',
      cards,
    });
  };

  function handleAction(type, amount) {
    console.log(type, amount);
    socket.emit('poker-action', type, amount);
  }

  const drawPile = [];

  for (let i = 0; i < 10; i += 1) {
    drawPile.push(
      <img
        style={{ transform: `rotate(${i}deg)` }}
        className={`${styles.cardImage} ${styles.drawPile}`}
        src="PokerImages/Images/blue_back.png"
        alt="Draw Pile"
      />
    );
  }

  const cards = ['AH', 'AH', 'AH', 'blue_back', 'blue_back'];

  return (
    <Container className={styles.lastcardContainer}>
      <Row className={styles.topRow}>
        {playersState.map((p, index) => (
          <Col key={index} className={`flexCol ${styles.opponent}`}>
            <Opponent props={p} isTurn={currentTurn === p.name} />
          </Col>
        ))}
      </Row>
      <Row className={styles.midRow}>
        <Col className={styles.lastPlayed}>+{totalPickUp}</Col>
        <Col className={styles.lastPlayed}>
          <img className={styles.cardImage} src={`PokerImages/Images/${lastPlayed}.png`} alt="Last Played Card" />
        </Col>
        <Col className={styles.board}>{drawPile}</Col>
      </Row>
      <Row className={styles.bottomRow}>
        <Col className="flexCol">
          <Player cards={ownCards} currentCard={lastPlayed} setSelected={handleCardClick} selectedCards={selectedCards} />
        </Col>
      </Row>
    </Container>
  );
}

export default LastCard;
