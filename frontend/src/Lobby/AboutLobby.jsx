/* eslint-disable no-unused-vars */
import { React, useContext } from 'react';
import styles from './AboutLobby.module.css';
import { LobbyContext } from '../Context';

// eslint-disable-next-line arrow-body-style
const AboutLobby = () => {
  const { state: lobbyState } = useContext(LobbyContext);

  const { nickname, lobbyID } = lobbyState;

  return (
    <div className={styles.infoContainer}>
      <div>
        <h5 className={styles.subHeading}>Your Name:</h5>
        <p>{nickname}</p>
      </div>

      <div>
        <h5 className={styles.subHeading}>Lobby ID:</h5>
        <p>{lobbyID}</p>
      </div>
      <div>
        <h5 className={styles.subHeading}>Game Size:</h5>
        <p>2-6 Players</p>
      </div>
    </div>
  );
};

export default AboutLobby;
