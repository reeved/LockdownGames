import { useReducer, useEffect } from 'react';
import socket from '../Socket';

const initialState = {
  playerName: null,
  cardMap: new Map(),
  playState: null,
  gameState: null,
  result: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
      };
    }

    case 'setPlayerName': {
      console.log(`setting playerName ${action.playerName}`);
      return {
        ...state,
        playerName: action.playerName,
      };
    }

    case 'setGameState': {
      console.log('Setting gameState');
      return {
        ...state,
        gameState: action.gameState,
      };
    }

    case 'setHoleCards': {
      const newCardMap = new Map(state.cardMap);
      newCardMap.set(state.playerName, action.holeCards);
      return {
        ...state,
        cardMap: newCardMap,
      };
    }

    default:
      throw new Error(`Invalid Game State reducer action: ${action.type}`);
  }
};

export default function usePokerState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    function setPlayerName(playerName) {
      dispatch({
        type: 'setPlayerName',
        playerName,
      });
    }

    function setGameState(gameState) {
      dispatch({
        type: 'setGameState',
        gameState,
      });
    }

    function setHoleCards(holeCards) {
      dispatch({
        type: 'setHoleCards',
        holeCards,
      });
    }

    socket.on('setPlayerName', setPlayerName);
    socket.on('setGameState', setGameState);
    socket.on('setHoleCards', setHoleCards);

    return () => {
      socket.removeListener('setPlayerName', setPlayerName);
      socket.removeListener('setGameState', setGameState);
      socket.removeListener('setHoleCards', setHoleCards);
    };
  }, [state]);

  return { state, dispatch };
}
