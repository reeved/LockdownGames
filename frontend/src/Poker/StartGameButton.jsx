import React from 'react';

function StartGameButton({ handleClick }) {
  return (
    <button type="button" onClick={() => handleClick()}>
      Start Game
    </button>
  );
}

export default StartGameButton;
