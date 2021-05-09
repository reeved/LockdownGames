/* eslint-disable no-unused-vars */
import { React, useContext } from 'react';
import styles from './GameInfo.module.css';
import { LobbyContext } from '../Context';
import CodeNamesInfo from '../CodeNames/CodeNamesInfo';

// eslint-disable-next-line arrow-body-style
const GameInfo = () => {
  const { state: lobbyState } = useContext(LobbyContext);
  // const { state: pokerState } = useContext(PokerContext);

  const { nickname, players } = lobbyState;

  return (
    <div className={styles.infoContainer}>
      <div>
        <h5 className={styles.subHeading}>Your Name:</h5>
        <p>{nickname}</p>
      </div>

      <div>
        <h5 className={styles.subHeading}>Players in Game:</h5>
        <p>{players.join(', ')}</p>
      </div>
      <CodeNamesInfo styles={styles} />
      {/* {pokerState.gameState ? <ModalGraph stackTrack={pokerState.gameState.serializedStackTrack} /> : null} */}
    </div>
  );
};

export default GameInfo;
