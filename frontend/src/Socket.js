import io from 'socket.io-client';

const socket = io('http://localhost:6001');
// const socket = io('https://reeved-codenames-backend.herokuapp.com/');

export default socket;
