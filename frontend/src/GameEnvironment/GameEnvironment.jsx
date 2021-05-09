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
  if (component === 'Codenames') {
    calledComponent = <CodeNames loggedIn={loggedIn} />;
  } else if (component === 'Poker') {
    calledComponent = <Poker loggedIn={loggedIn} />;
  } else if (component === 'Last Card') {
    calledComponent = <LastCard loggedIn={loggedIn} />;
  }

  return (
    <>
      <Container fluid style={{ maxWidth: '90vw', height: '80vh' }}>
        <Row style={{ height: '100%' }}>
          <Col className={`${styles.Chat} flexCol`}>
            <h3>{component}</h3>
            <GameInfo gameName={component} />
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
