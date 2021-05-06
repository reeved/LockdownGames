/* eslint-disable no-unused-vars */
import { useState, useContext, React } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { LastCardContext, LobbyContext } from '../Context';
import styles from './LastCard.module.css';

import socket from '../Socket';
import Opponent from './Opponent';
import Player from './Player';

function LastCard({ loggedIn }) {
  const { state, dispatch } = useContext(LastCardContext);
  const { state: lobbyState } = useContext(LobbyContext);

  const { playersState, lastPlayed, currentTurn, totalPickUp, selectedCards } = state;
  const { nickname } = lobbyState;

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  const handleCardClick = (card, acePlayed) => {
    let cards = selectedCards;
    const exists = selectedCards.includes(card);
    if (exists) {
      cards = cards.filter((c) => c !== card);
      cards = cards.filter((c) => c.value !== card.value);
    } else {
      cards = card.slice(0, -1) === 'A' && acePlayed ? [card] : [...cards, card];
    }

    dispatch({
      type: 'set-selected',
      cards,
    });
  };

  function setUpOpponents() {
    if (playersState.length) {
      while (playersState[0].name !== nickname) {
        const endPlayer = playersState.pop();
        playersState.unshift(endPlayer);
      }
    }
    console.log(playersState);
  }
  const drawPile = [];

  for (let i = 0; i < 10; i += 1) {
    drawPile.push(
      <img
        key={i}
        style={{ transform: `rotate(${i}deg)` }}
        className={`${styles.cardImage} ${styles.drawPile}`}
        src="CardImages/blue_back.webp"
        alt="Draw Pile"
      />
    );
  }

  return (
    <Container className={styles.lastcardContainer}>
      <Row className={styles.topRow}>
        {setUpOpponents()}
        {playersState.map(
          (p, index) =>
            nickname !== p.name && (
              <Col key={index} className={`flexCol ${styles.opponent}`}>
                <Opponent props={p} isTurn={currentTurn === p.name} />
              </Col>
            )
        )}
      </Row>
      <Row className={styles.midRow}>
        <Col className={styles.lastPlayed}>+{totalPickUp}</Col>
        <Col className={styles.lastPlayed}>
          <img className={styles.cardImage} src={`CardImages/${lastPlayed}.webp`} alt="Last Played Card" />
        </Col>
        <Col className={styles.board}>{drawPile}</Col>
      </Row>
      <Row className={styles.bottomRow}>
        <Col className={`flexCol ${currentTurn !== nickname && 'disabled'}`}>
          <Player setSelected={handleCardClick} selectedCards={selectedCards} />
        </Col>
      </Row>
    </Container>
  );
}

export default LastCard;
