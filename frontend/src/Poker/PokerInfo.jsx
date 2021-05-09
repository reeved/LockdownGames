import { React, useContext } from 'react';
import { PokerContext } from '../Context';
import GeneralModal from '../Components/GeneralModal';
import LineChart from '../Components/LineChart';

const PokerInfo = () => {
  const { state: pokerState } = useContext(PokerContext);

  return (
    <>
      <div>
        {pokerState.gameState ? (
          <GeneralModal buttonText="Open Stack Track" child={<LineChart stackTrack={pokerState.gameState.serializedStackTrack} />} />
        ) : null}
      </div>
    </>
  );
};

export default PokerInfo;
