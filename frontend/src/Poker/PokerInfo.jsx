import { React, useContext } from 'react';
import { PokerContext } from '../Context';
import GeneralModal from '../Components/GeneralModal';
import LineChart from '../Components/LineChart';

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
        {pokerState.gameState ? (
          <GeneralModal buttonText="Open Stack Track" child={<LineChart stackTrack={pokerState.gameState.serializedStackTrack} />} />
        ) : null}
      </div>
    </>
  );
};

export default PokerInfo;
