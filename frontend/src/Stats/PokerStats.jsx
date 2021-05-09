import React from 'react';
import GeneralModal from '../Components/GeneralModal';
import LineChart from '../Components/LineChart';
import styles from './Stats.module.css';

export default function PokerStats({ pokerStats }) {
  const gameArray = [];
  pokerStats.forEach((element) => {
    const date = new Date(element.date);
    gameArray.push(
      <>
        <div className={styles.infoContainer}>
          <div className={styles.infoText}>
            <p>Winner: {element.winnerName}</p>
            <p>Date: {date.toLocaleString()}</p>
          </div>
          <div className={styles.infoButton}>
            <GeneralModal buttonText="Stack-Track" child={<LineChart stackTrack={element.stackTrack} />} />
          </div>
        </div>
        <hr />
      </>
    );
  });
  return <div style={{ maxHeight: 600, overflow: 'auto' }}>{gameArray}</div>;
}
