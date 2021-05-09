import { Button } from '@material-ui/core';
import React from 'react';
import GeneralModal from '../Components/GeneralModal';
import LineChart from '../Components/LineChart';

export default function PokerStats({ pokerStats }) {
  const gameArray = [];
  pokerStats.forEach((element) => {
    gameArray.push(
      <div key={element.date}>
        <Button>
          {element.gameName} - {element.winnerName} - {element.date}
        </Button>
        <GeneralModal buttonText="Stack-Track" child={<LineChart stackTrack={element.stackTrack} />} />
      </div>
    );
  });
  return <div style={{ maxHeight: 600, overflow: 'auto' }}>{gameArray}</div>;
}
