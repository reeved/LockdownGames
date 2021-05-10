import { useReducer, useEffect } from 'react';
import socket from '../Socket';

const initialState = {
  pokerStats: null,
  codenameStats: null,
  lastCardStats: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
      };
    }

    case 'poker-stats': {
      return {
        ...state,
        pokerStats: action.pokerStats,
      };
    }

    case 'codename-stats': {
      return {
        ...state,
        codenameStats: action.codenameStats,
      };
    }

    case 'last-card-stats': {
      return {
        ...state,
        lastCardStats: action.lastCardStats,
      };
    }

    default:
      throw new Error(`Invalid Mongo reducer action: ${action.type}`);
  }
};

export default function useMongoState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'init',
    });
  }, []);
  useEffect(() => {
    function setPokerState(pokerStats) {
      dispatch({
        type: 'poker-stats',
        pokerStats,
      });
    }

    function setCodenameStats(codenameStats) {
      dispatch({
        type: 'codename-stats',
        codenameStats,
      });
    }

    function setLastCardStats(lastCardStats) {
      dispatch({
        type: 'last-card-stats',
        lastCardStats,
      });
    }

    socket.on('poker-stats', setPokerState);
    socket.on('codename-stats', setCodenameStats);
    socket.on('last-card-stats', setLastCardStats);

    return () => {
      socket.removeListener('poker-stats', setPokerState);
      socket.removeListener('codename-stats', setCodenameStats);
      socket.removeListener('last-card-stats', setLastCardStats);
    };
  }, [state]);

  return { state, dispatch };
}
