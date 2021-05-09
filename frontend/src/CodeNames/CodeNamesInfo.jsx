import { React, useContext } from 'react';
import { CodenamesContext } from '../Context';

const CodeNamesInfo = ({ styles }) => {
  const { state } = useContext(CodenamesContext);

  const team = state.team === 'Blue' ? state.blueTeam : state.redTeam;
  return (
    <>
      <div>
        <h5 className={styles.subHeading}>Your Team ({state.team}):</h5>
        <p>{team.join(', ')}</p>
      </div>
      <div>
        <h5 className={styles.subHeading}>Session Win/Loss:</h5>
        <p>
          <strong>Wins:</strong> {state.sessionWin}
        </p>
        <p>
          <strong>Losses:</strong> {state.sessionLoss}
        </p>
        {/* {pokerState.gameState ? <ModalGraph stackTrack={pokerState.gameState.serializedStackTrack} /> : null} */}
      </div>
    </>
  );
};

export default CodeNamesInfo;
