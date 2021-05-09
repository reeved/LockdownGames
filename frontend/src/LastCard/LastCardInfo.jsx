/* eslint-disable prefer-destructuring */
import { React, useContext } from 'react';
import { LastCardContext } from '../Context';

const LastCardInfo = ({ styles }) => {
  // eslint-disable-next-line no-unused-vars
  const { state } = useContext(LastCardContext);

  const { playersState } = state;

  let leader;
  let loser;

  if (playersState.length) {
    leader = playersState[0];
    loser = playersState[0];

    for (let i = 0; i < playersState.length; i += 1) {
      if (playersState[i].handSize < leader.handSize) {
        leader = playersState[i];
      }

      if (playersState[i].handSize > loser.handSize) {
        loser = playersState[i];
      }
    }
  }

  const max = playersState.filter((p) => p.handSize === leader.handSize);
  const min = playersState.filter((p) => p.handSize === loser.handSize);

  if (max.length > 1) {
    leader = false;
  }

  if (min.length > 1) {
    loser = false;
  }

  return (
    <>
      <div>
        <h5 className={styles.subHeading}>Leader/Loser</h5>
        <p>
          <strong>Leader: </strong>
          {leader ? leader.name : 'No Clear Leader'}
        </p>
        <p>
          <strong>Loser: </strong>
          {loser ? loser.name : 'No Clear Loser'}
        </p>
        {/* {pokerState.gameState ? <ModalGraph stackTrack={pokerState.gameState.serializedStackTrack} /> : null} */}
      </div>
    </>
  );
};

export default LastCardInfo;
