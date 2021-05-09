import { React, useContext } from 'react';
import { PokerContext } from '../Context';
import ModalGraph from './ModalGraph';

const PokerInfo = ({ styles }) => {
  // eslint-disable-next-line no-unused-vars
  const { state: pokerState } = useContext(PokerContext);

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
        {pokerState.gameState ? <ModalGraph stackTrack={pokerState.gameState.serializedStackTrack} /> : null}
      </div>
    </>
  );
};

export default PokerInfo;
