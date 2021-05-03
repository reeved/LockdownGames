import { useReducer, useEffect } from 'react';
import socket from '../Socket';

const initialState = {
  playersState: [
    {
      name: 'Reeve',
      handSize: 3,
      isPlaying: true,
    },
    {
      name: 'Callum',
      handSize: 5,
      isPlaying: true,
    },
    {
      name: 'Ben',
      handSize: 1,
      isPlaying: true,
    },
    {
      name: 'Daniel',
      handSize: 3,
      isPlaying: true,
    },
  ],
  ownCards: ['AH', 'QD', '4S', '7C', '2D'],
  lastPlayed: '4C',
  currentTurn: 'Callum',
  totalPickUp: 2,
  selectedCards: [],
};

const reducer = (state, action) => {
  function removeCard(card) {
    for (let i = 0; i < state.ownCards.length; i += 1) {
      if (state.ownCards[i] === card) {
        state.ownCards.splice(i, 1);
        break;
      }
    }
  }

  switch (action.type) {
    case 'init': {
      return {
        ...state,
      };
    }

    case 'new-lastCard': {
      console.log('Received new game from server.');
      return {
        ...initialState,
        playersState: action.allPlayers,
      };
    }

    case 'updated-hand': {
      return {
        ...state,
        ownCards: state.ownCards.push(action.hand),
      };
    }

    case 'card-played': {
      return {
        ...state,
        lastPlayed: action.lastPlayed,
        currentTurn: state.currentTurn + 1,
        ownCards: removeCard(action.card),
      };
    }

    case 'player-finished': {
      return {
        ...state,
      };
    }

    case 'set-selected': {
      console.log('Got dispatched. ', action.cards);
      return {
        ...state,
        selectedCards: action.cards,
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
    function newLastCardGame(allPlayers) {
      dispatch({
        type: 'new-lastCard',
        allPlayers,
      });
    }

    function updateHand(hand) {
      dispatch({
        type: 'updated-hand',
        hand,
      });
    }

    function cardPlayed(card, player) {
      dispatch({
        type: 'card-played',
        card,
        player,
      });
    }

    function setPlayerFinished(player) {
      dispatch({
        type: 'player-finished',
        player,
      });
    }

    socket.on('lastCard-new-game', newLastCardGame);
    socket.on('lastCard-update-hand', updateHand);
    socket.on('lastCard-cardPlayed', cardPlayed);
    socket.on('lastCard-player-finished', setPlayerFinished);

    return () => {
      socket.removeListener('lastCard-new-game', newLastCardGame);
      socket.removeListener('lastCard-update-hand', updateHand);
      socket.removeListener('lastCard-cardPlayed', cardPlayed);
      socket.removeListener('lastCard-player-finished', setPlayerFinished);
    };
  }, [state]);

  return { state, dispatch };
}
