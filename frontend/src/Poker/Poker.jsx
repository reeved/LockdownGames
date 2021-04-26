import { useContext, React } from 'react';
import { Redirect } from 'react-router-dom';
import { PokerContext, LobbyContext } from '../Context';

// import socket from '../Socket';
import InitialisePlayerBoxes from './InitialisePlayerBoxes';
// import StartGameButton from './StartGameButton';

function Poker({ loggedIn }) {
  const { state: pokerState } = useContext(PokerContext);
  const { state: lobbyState } = useContext(LobbyContext);

  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      {lobbyState.players}
      {pokerState.gameState ? <div>{InitialisePlayerBoxes(pokerState.gameState)}</div> : null}
    </div>
  );
}

export default Poker;
