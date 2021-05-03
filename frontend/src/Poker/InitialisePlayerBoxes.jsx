// /* eslint-disable no-unused-vars */
// import Container from 'react-bootstrap/Container';
// import { Button } from '@material-ui/core';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import { useContext, React } from 'react';
// import { PokerContext } from '../Context';

// // const { state: pokerState } = useContext(PokerContext);

// function InitialisePlayerBoxes(nickname, { playerState }, pokerRound, cardMap, handleAction) {
//   const playerBoxes = [];
//   playerState.forEach((element, index) => {
//     let pokerActivePlayer = null;
//     pokerRound.pokerActivePlayers.forEach((activePlayer) => {
//       if (activePlayer.playerName === element.playerName) pokerActivePlayer = activePlayer;
//     });
//     const { playerName } = element;
//     const cards = cardMap.has(element.playerName) ? cardMap.get(element.playerName) : null;
//     const stack = pokerActivePlayer ? pokerActivePlayer.stack : 0;
//     const currentBet = pokerActivePlayer ? pokerActivePlayer.currentBet : null;
//     const currentAction = pokerActivePlayer.currentAction === 'onAction' ? 'onAction' : null;
//     const board = pokerRound.board.length > 0 ? pokerRound.board : null;
//     const isDealer = index === pokerRound.dealerIndex;
//     playerBoxes.push(
//       <Col>
//         <PlayerBox
//           playerName={playerName}
//           cards={cards}
//           stack={stack}
//           currentBet={currentBet}
//           currentAction={currentAction}
//           currentRaise={pokerRound.currentRaise}
//           pot={pokerRound.pot}
//           board={board}
//           isDealer={isDealer}
//           nickname={nickname}
//           handleAction={handleAction}
//         />
//       </Col>
//     );
//   });

//   // return <div>{playerBoxes}</div>;
//   return (
//     <Container>
//       <Row>{playerBoxes}</Row>
//     </Container>
//   );
// }

// function PlayerBox({ playerName, cards, stack, currentBet, currentAction, currentRaise, pot, board, isDealer, nickname, handleAction }) {
//   let cardImage1 = 'blue_back';
//   let cardImage2 = 'blue_back';
//   if (cards) {
//     cardImage1 = cards.card1;
//     cardImage2 = cards.card2;
//   }
//   return (
//     <div className="playerBox">
//       {playerName}
//       {stack}
//       {currentBet}
//       {isDealer ? 'isDealer' : null}
//       <img className={styles.cardImage} src={`PokerImages/Images/${cardImage1}.png`} alt="Card 1" />
//       <img className={styles.cardImage} src={`PokerImages/Images/${cardImage2}.png`} alt="Card 2" />
//       {playerName === nickname && currentAction === 'onAction' ? (
//         <GameButtons currentBet={currentBet} currentRaise={currentRaise} handleAction={handleAction} />
//       ) : null}
//     </div>
//   );
// }

// function GameButtons({ currentBet, currentRaise, handleAction }) {
//   console.log(currentBet, currentRaise);
//   return (
//     <div>
//       {currentBet < currentRaise ? <Button onClick={() => handleAction('fold')}> Fold </Button> : null}
//       {currentRaise === currentBet ? <Button onClick={() => handleAction('check')}> Check </Button> : null}
//       {currentBet < currentRaise ? <Button onClick={() => handleAction('call', currentRaise - currentBet)}> Call </Button> : null}
//       <Button> Raise</Button>
//     </div>
//   );
// }

// export default InitialisePlayerBoxes;
