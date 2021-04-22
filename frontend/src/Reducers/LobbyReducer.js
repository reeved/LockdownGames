import { useReducer, useEffect } from 'react';
import socket from '../Socket';

const initialState = {
  nickname: 'Anon',
  lobbyID: false,
  isHost: false,
  lobbyReady: false,
  players: [''],
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
      console.log(action.status, action.nickname);
      return {
        ...state,
        lobbyID: action.status,
        nickname: action.nickname,
      };
    }

    case 'update-players': {
      console.log(action.playerList);
      return {
        ...state,
        players: action.playerList,
      };
    }

    case 'new-chat-message': {
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.msg],
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
    function joinLobby(status, nickname) {
      dispatch({
        type: 'join-lobby',
        status,
        nickname,
      });
    }

    function updatePlayers(playerList) {
      dispatch({
        type: 'update-players',
        playerList,
      });
    }

    function newChatMessage(msg) {
      dispatch({
        type: 'new-chat-message',
        msg,
      });
    }

    socket.on('join-lobby', joinLobby);
    socket.on('chat message', newChatMessage);
    socket.on('update-players', updatePlayers);

    return () => {
      socket.removeListener('join-lobby', joinLobby);
      socket.removeListener('chat message', newChatMessage);
      socket.removeListener('update-players', updatePlayers);
    };
  }, [state]);

  return { state, dispatch };
}
