import { useReducer, useEffect } from 'react';
import socket from '../Socket';

const initialState = {
  cardMap: new Map(),
  pokerRound: null,
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

    case 'poker-game-state': {
      state.cardMap.clear();
      return {
        ...state,
        gameState: action.gameState,
        pokerRound: null,
      };
    }

    case 'poker-hole-cards': {
      const newCardMap = new Map(state.cardMap);
      newCardMap.set(action.playerName, action.holeCards);
      return {
        ...state,
        cardMap: newCardMap,
      };
    }

    case 'poker-round': {
      return {
        ...state,
        pokerRound: action.pokerRound,
      };
    }

    default:
      throw new Error(`Invalid Poker State reducer action: ${action.type}`);
  }
};

export default function usePokerState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    function setGameState(gameState) {
      dispatch({
        type: 'poker-game-state',
        gameState,
      });
    }

    function setHoleCards({ playerName, holeCards }) {
      dispatch({
        type: 'poker-hole-cards',
        playerName,
        holeCards,
      });
    }

    function setPokerRound(pokerRound) {
      dispatch({
        type: 'poker-round',
        pokerRound,
      });
    }

    socket.on('poker-game-state', setGameState);
    socket.on('poker-hole-cards', setHoleCards);
    socket.on('poker-round', setPokerRound);

    return () => {
      socket.removeListener('poker-game-state', setGameState);
      socket.removeListener('poker-hole-cards', setHoleCards);
      socket.removeListener('poker-round', setPokerRound);
    };
  }, [state]);

  return { state, dispatch };
}
