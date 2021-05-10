import { useReducer, useEffect, useContext } from 'react';
import socket from '../Socket';
import { LobbyContext } from '../Context';

const initialState = {
  nickname: 'Anon',
  team: 'blue',
  redTeam: [],
  blueTeam: [],
  isSpyMaster: false,
  currentTurn: 'Red',
  redScore: 9,
  blueScore: 8,
  isGameOver: false,
  words: null,
  selectedItems: [],
  sessionWin: 0,
  sessionLoss: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
      };
    }

    case 'update-nickname': {
      return {
        ...state,
        nickname: action.nickname,
      };
    }

    case 'new-codenames': {
      return {
        ...initialState,
        words: action.words,
        redTeam: action.redTeam,
        blueTeam: action.blueTeam,
        team: action.redTeam.includes(state.nickname) ? 'Red' : 'Blue',
        nickname: state.nickname,
        sessionWin: state.sessionWin,
        sessionLoss: state.sessionLoss,
      };
    }

    case 'updated-selected': {
      return {
        ...state,
        selectedItems: [...state.selectedItems, action.itemID],
      };
    }

    case 'decrement-score': {
      return {
        ...state,
        redScore: action.team === 'Red' ? state.redScore - 1 : state.redScore,
        blueScore: action.team === 'Blue' ? state.blueScore - 1 : state.blueScore,
      };
    }

    case 'change-turn': {
      return {
        ...state,
        currentTurn: action.team,
      };
    }

    case 'toggle-spymaster': {
      return {
        ...state,
        isSpyMaster: !state.isSpyMaster,
      };
    }

    case 'game-over': {
      return {
        ...state,
        isGameOver: true,
        sessionWin: action.winningTeam === state.team ? state.sessionWin + 1 : state.sessionWin,
        sessionLoss: action.winningTeam !== state.team ? state.sessionLoss + 1 : state.sessionLoss,
      };
    }

    default:
      throw new Error(`Invalid Game State reducer action: ${action.type}`);
  }
};

export default function useCodenamesState() {
  const { state: lobbyState } = useContext(LobbyContext);
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
    function joinLobby(status, nickname, chosenGame) {
      dispatch({
        type: 'update-nickname',
        status,
        nickname,
        chosenGame,
      });
    }

    function newCodenamesGame(boardWords, redTeam, blueTeam) {
      dispatch({
        type: 'new-codenames',
        words: boardWords,
        selectedWords: [],
        redTeam,
        blueTeam,
        nickname: lobbyState.nickname,
      });
    }

    function updateSelected(id) {
      dispatch({
        type: 'updated-selected',
        itemID: id,
      });
    }

    function decrementScore(team) {
      dispatch({
        type: 'decrement-score',
        team,
      });
    }

    function changeTurn(team) {
      dispatch({
        type: 'change-turn',
        team,
      });
    }

    function setGameOver(winningTeam) {
      dispatch({
        type: 'game-over',
        winningTeam,
      });
    }

    socket.on('join-lobby', joinLobby);
    socket.on('codenames-new-codenames', newCodenamesGame);
    socket.on('codenames-update-selected', updateSelected);
    socket.on('codenames-decrement-score', decrementScore);
    socket.on('codenames-game-over', setGameOver);
    socket.on('codenames-change-turn', changeTurn);

    return () => {
      socket.removeListener('join-lobby', joinLobby);
      socket.removeListener('codenames-new-codenames', newCodenamesGame);
      socket.removeListener('codenames-update-selected', updateSelected);
      socket.removeListener('codenames-decrement-score', decrementScore);
      socket.removeListener('codenames-game-over', setGameOver);
      socket.removeListener('codenames-change-turn', changeTurn);
    };
  }, [state]);

  return { state, dispatch };
}
