import { useReducer, useEffect } from 'react';
import socket from '../Socket';

const initialState = {
  playersState: [],
  ownCards: [],
  lastPlayed: '4c',
  currentTurn: null,
  totalPickUp: 0,
  selectedCards: [],
  gameOver: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
      };
    }

    case 'new-lastcard': {
      console.log('Received new lastcard game from server.');
      return {
        ...state,
        playersState: action.allPlayers,
        lastPlayed: action.startingCard,
        currentTurn: action.allPlayers[0].name,
        gameOver: false,
      };
    }

    case 'updated-hand': {
      return {
        ...state,
        ownCards: [...state.ownCards, ...action.hand],
        selectedCards: [],
      };
    }

    case 'play-card': {
      console.log('PLAY CARD PLEASE');

      return {
        ...state,
        lastPlayed: action.card.slice(-1).toString(),
        currentTurn: action.nextPlayer,
        ownCards: action.originalAce
          ? state.ownCards.filter((c) => c !== action.originalAce)
          : state.ownCards.filter((c) => !action.card.includes(c)),
        playersState: action.updatedState,
        selectedCards: [],
        totalPickUp: action.totalPickUp,
      };
    }

    case 'game-over': {
      console.log('Game OVER');
      return {
        ...state,
        playersState: action.playersState,
        gameOver: action.isGameOver,
        ownCards: [],
      };
    }

    case 'set-selected': {
      console.log('Got dispatched. ', action.cards);
      return {
        ...state,
        selectedCards: action.cards,
      };
    }

    case 'ace-played': {
      return {
        ...state,
        ownCards: [...action.hand],
        selectedCards: [],
      };
    }

    case 'change-turn': {
      console.log(state.totalPickUp);
      return {
        ...state,
        currentTurn: action.nextPlayer,
        playersState: action.updatedState,
        totalPickUp: 0,
        selectedCards: [],
      };
    }

    default:
      throw new Error(`Invalid Game State reducer action: ${action.type}`);
  }
};

export default function useCodenamesState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * This effect will run on first render to initialise the alive players.
   * We may need to lie about the dependency so that players dont just 'leave'
   */
  useEffect(() => {
    dispatch({
      type: 'init',
    });
  }, []);

  useEffect(() => {
    function newLastCardGame(allPlayers, startingCard) {
      console.log('New game has started', allPlayers, startingCard);
      dispatch({
        type: 'new-lastcard',
        allPlayers,
        startingCard,
      });
    }

    function drawCard(hand) {
      console.log('Hand updated draw card', hand);
      dispatch({
        type: 'updated-hand',
        hand,
      });
    }

    function playCard(card, isDone, nextPlayer, currentPlayer, updatedState, totalPickUp, originalAce) {
      dispatch({
        type: 'play-card',
        card,
        isDone,
        nextPlayer,
        currentPlayer,
        updatedState,
        totalPickUp,
        originalAce,
      });
    }

    function gameOver(isGameOver, playersState) {
      dispatch({
        type: 'game-over',
        isGameOver,
        playersState,
      });
    }

    function changeTurn(nextPlayer, updatedState) {
      dispatch({
        type: 'change-turn',
        nextPlayer,
        updatedState,
      });
    }

    socket.on('lastcard-new-game', newLastCardGame);
    socket.on('lastcard-update-hand', drawCard);
    socket.on('lastcard-card-played', playCard);
    socket.on('lastcard-change-turn', changeTurn);
    socket.on('lastcard-game-over', gameOver);

    return () => {
      socket.removeListener('lastcard-new-game', newLastCardGame);
      socket.removeListener('lastcard-update-hand', drawCard);
      socket.removeListener('lastcard-card-played', playCard);
      socket.removeListener('lastcard-change-turn', changeTurn);
      socket.removeListener('lasrcard-game-over', gameOver);
    };
  }, [state]);

  return { state, dispatch };
}
