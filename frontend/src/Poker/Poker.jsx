/* eslint-disable no-unused-vars */
import { useContext, React } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { PokerContext, LobbyContext } from '../Context';
import styles from './Poker.module.css';
import socket from '../Socket';
import Opponent from './Opponent';
import Player from './Player';

function Poker({ loggedIn }) {
  const { state: pokerState } = useContext(PokerContext);
  const { state: lobbyState } = useContext(LobbyContext);
  const { nickname } = lobbyState;

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  function handleAction(type, amount) {
    console.log(type, amount);
    socket.emit('poker-action', type, amount);
  }

  // if (pokerState.pokerRound) pokerState.pokerRound.board = ['AH', 'AH', 'AH', 'AH', 'AH'];
  // if (pokerState.pokerRound) pokerState.pokerRound.pot = 100;

  function setUpOpponents() {
    const opponents = [];
    const playerStateShifted = pokerState.gameState.playerState.slice();
    while (playerStateShifted[0].playerName !== nickname) {
      const endPlayer = playerStateShifted.pop();
      playerStateShifted.unshift(endPlayer);
    }
    playerStateShifted.forEach((element) => {
      if (element.playerName === nickname) return; // isMe
      let { stack } = element;
      let currentBet = null;
      let isOnAction = false;
      let isDealer = false;
      let isIn = false;
      if (pokerState.pokerRound) {
        pokerState.pokerRound.pokerActivePlayers.forEach((activePlayer, index) => {
          if (element.playerName === activePlayer.playerName && index === 0) isDealer = true;
          if (element.playerName === activePlayer.playerName) stack = activePlayer.stack;
          if (element.playerName === activePlayer.playerName) isIn = true;
          if (element.playerName === activePlayer.playerName) currentBet = activePlayer.currentBet;
          if (element.playerName === activePlayer.playerName && activePlayer.currentAction === 'onAction') isOnAction = true;
        });
        pokerState.pokerRound.foldedPlayers.forEach((foldedPlayer) => {
          if (element.playerName === foldedPlayer.playerName) stack = foldedPlayer.stack;
        });
        pokerState.pokerRound.allInPlayers.forEach((allInPlayer) => {
          if (element.playerName === allInPlayer.playerName) isIn = true;
          if (element.playerName === allInPlayer.playerName) stack = allInPlayer.stack;
          if (element.playerName === allInPlayer.playerName) currentBet = allInPlayer.currentBet;
        });
      }
      opponents.push(
        <Col className={`flexCol ${styles.opponent}`}>
          <Opponent playerName={element.playerName} stack={stack} currentBet={currentBet} isOnAction={isOnAction} isDealer={isDealer} isIn={isIn} />
        </Col>
      );
    });
    return <>{opponents}</>;
  }

  return (
    <>
      {!pokerState.gameState ? (
        <>
          <h1>Game is loading...</h1>
          <CircularProgress />
        </>
      ) : (
        <Container className={styles.pokerContainer}>
          <Row className={styles.topRow}>{setUpOpponents()}</Row>

          <Row className={styles.midRow}>
            {pokerState.pokerRound ? (
              <>
                <Col xs={4}>{pokerState.pokerRound.pot !== 0 ? <div className={styles.pot}>{pokerState.pokerRound.pot}</div> : null}</Col>
                <Col className={styles.board}>
                  {pokerState.pokerRound.board.length !== 0 ? (
                    <>
                      {pokerState.pokerRound.board.map((card, index) => (
                        <img key={index} className={styles.cardImage} src={`PokerImages/Images/${card}.png`} alt={`Card ${index + 1}`} />
                      ))}
                    </>
                  ) : null}
                </Col>
              </>
            ) : null}
          </Row>

          <Row className={styles.bottomRow}>
            <Col>
              <Player handleAction={handleAction} />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Poker;
