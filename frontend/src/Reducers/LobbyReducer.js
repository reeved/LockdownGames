import { useReducer, useEffect } from 'react';
import socket from '../Socket';

const initialState = {
  nickname: 'Anon',
  lobbyID: false,
  isHost: false,
  lobbyReady: false,
  players: [''],
  gameStarted: null,
  chosenGame: null,
  chatMessages: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
      };
    }

    case 'join-lobby': {
      console.log(action.status, action.nickname, action.chosenGame);
      return {
        ...state,
        lobbyID: action.status,
        nickname: action.nickname,
        chosenGame: action.chosenGame,
      };
    }

    case 'update-players': {
      console.log('REDUCER IS HOST:', action.isHost);
      return {
        ...state,
        players: action.playerList,
        isHost: action.isHost ? action.isHost : state.isHost,
      };
    }

    case 'new-chat-message': {
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.msg],
      };
    }

    case 'set-game': {
      return {
        ...state,
        gameStarted: action.hasStarted,
        chosenGame: action.gameName,
      };
    }

    default:
      throw new Error(`Invalid Game State reducer action: ${action.type}`);
  }
};

export default function useLobbyState() {
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
        type: 'join-lobby',
        status,
        nickname,
        chosenGame,
      });
    }

    function updatePlayers(playerList, isHost) {
      console.log('IS HOST AT FUNCTION: ', isHost);
      dispatch({
        type: 'update-players',
        playerList,
        isHost,
      });
    }

    function newChatMessage(msg) {
      dispatch({
        type: 'new-chat-message',
        msg,
      });
    }

    function setGame(hasStarted, gameName) {
      dispatch({
        type: 'set-game',
        hasStarted,
        gameName,
      });
    }

    socket.on('join-lobby', joinLobby);
    socket.on('chat-message', newChatMessage);
    socket.on('update-players', updatePlayers);
    socket.on('selected-game', setGame);

    return () => {
      socket.removeListener('join-lobby', joinLobby);
      socket.removeListener('chat-message', newChatMessage);
      socket.removeListener('update-players', updatePlayers);
      socket.removeListener('selected-game', setGame);
    };
  }, [state]);

  return { state, dispatch };
}
