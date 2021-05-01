import { React } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GameInfo from './GameInfo';
import Chatbox from '../Common/Chatbox';
import CodeNames from '../CodeNames/CodeNames';
import Poker from '../Poker/Poker';
import styles from './GameEnvironment.module.css';
import LastCard from '../LastCard/LastCard';
// import { LobbyContext } from '../Context';

// eslint-disable-next-line arrow-body-style
const GameEnv = ({ loggedIn, component }) => {
  // const { state: lobbyState } = useContext(LobbyContext);

  let calledComponent;
  if (component === 'codenames') {
    calledComponent = <CodeNames loggedIn={loggedIn} />;
  } else if (component === 'poker') {
    calledComponent = <Poker loggedIn={loggedIn} />;
  } else if (component === 'lastcard') {
    calledComponent = <LastCard loggedIn={loggedIn} />;
  }

  return (
    <>
      <Container fluid style={{ maxWidth: '90vw' }}>
        <h1>{component.toUpperCase()}</h1>
        <Row style={{ height: '60vh' }}>
          <Col className={`${styles.Chat} flexCol`}>
            <h3>GAME INFO</h3>
            <GameInfo />
          </Col>
          <Col xs={7}>{calledComponent}</Col>
          <Col className={`${styles.Chat} flexCol`}>
            <h3>GAME CHAT</h3>
            <Chatbox />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GameEnv;
