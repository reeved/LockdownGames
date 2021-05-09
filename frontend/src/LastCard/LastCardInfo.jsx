import { React, useContext } from 'react';
import { LastCardContext } from '../Context';

const LastCardInfo = ({ styles }) => {
  // eslint-disable-next-line no-unused-vars
  const { state } = useContext(LastCardContext);

  return (
    <>
      <div>
        <h5 className={styles.subHeading}>Session Win/Loss:</h5>
        <p>
          <strong>Wins:</strong>
        </p>
        <p>
          <strong>Losses:</strong>
        </p>
        {/* {pokerState.gameState ? <ModalGraph stackTrack={pokerState.gameState.serializedStackTrack} /> : null} */}
      </div>
    </>
  );
};

export default LastCardInfo;
