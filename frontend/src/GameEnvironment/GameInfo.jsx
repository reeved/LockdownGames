/* eslint-disable no-unused-vars */
import { React, useContext } from 'react';
import styles from './GameInfo.module.css';
import { LobbyContext, PokerContext } from '../Context';
import ChartContainer from '../Components/ChartContainer';
import ModalGraph from '../Poker/ModalGraph';

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
      <div>
        <h5 className={styles.subHeading}>Your Team:</h5>
        <p>{players.join(', ')}</p>
      </div>
      <div>
        <h5 className={styles.subHeading}>Session Win/Loss:</h5>
        <p>
          <strong>Wins:</strong> 4
        </p>
        <p>
          <strong>Losses:</strong> 4
        </p>
        {/* {pokerState.gameState ? <ModalGraph stackTrack={pokerState.gameState.serializedStackTrack} /> : null} */}
      </div>
    </div>
  );
};

export default GameInfo;
