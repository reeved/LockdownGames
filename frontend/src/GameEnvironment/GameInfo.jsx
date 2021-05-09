/* eslint-disable no-unused-vars */
import { React, useContext } from 'react';
import styles from './GameInfo.module.css';
import { LobbyContext } from '../Context';
import CodeNamesInfo from '../CodeNames/CodeNamesInfo';
import PokerInfo from '../Poker/PokerInfo';
import LastCardInfo from '../LastCard/LastCardInfo';

// eslint-disable-next-line arrow-body-style
const GameInfo = ({ gameName }) => {
  const { state: lobbyState } = useContext(LobbyContext);
  // const { state: pokerState } = useContext(PokerContext);
  let calledComponent;

  if (gameName === 'Codenames') {
    calledComponent = <CodeNamesInfo styles={styles} />;
  } else if (gameName === 'Poker') {
    calledComponent = <PokerInfo styles={styles} />;
  } else if (gameName === 'Last Card') {
    calledComponent = <LastCardInfo styles={styles} />;
  }

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
      <>{calledComponent}</>
    </div>
  );
};

export default GameInfo;
