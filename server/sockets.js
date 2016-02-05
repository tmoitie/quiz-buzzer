import SocketIO from 'socket.io';
import {password as adminPassword} from '../config';
import {map} from 'lodash';

const io = SocketIO(8888);

const players = {};
let nextPlayerId = 1;
let currentBuzz = null;
const lockedPlayers = [];

const getPlayerNames = () => {
  return map(players, (player) => player.name)
};

/**
 * Stay alive to all clients every 28s
 */

io.sockets.on('connection', (socket) => {
  let id = nextPlayerId++;

  socket.emit('connected', {
    frozen: currentBuzz !== null,
    chosenTeamName: currentBuzz ? players[currentBuzz].name : null
  });

  setTimeout(() => {
    io.emit('stay-alive');
  }, 28);

  /**
   * Register a user name to the system
   *
   * Replies with playerId
   */
  socket.on('remember', ({oldId, name}) => {
    if (players[oldId] && players[oldId].name === name) {
      id = oldId;
      return;
    }

    players[parseInt(id, 10)] = {name};
    socket.emit('registered', {id});
  });

  /**
   * Register a user name to the system
   *
   * Replies with playerId
   */
  socket.on('register', ({name}) => {
    if (getPlayerNames().indexOf(name) !== -1) {
      socket.emit('register_error', 'That name is already taken. Are you already registered?');
      return;
    }
    players[id] = {name};
    socket.emit('registered', {id});
  });

  /**
   * A user has buzzed. If they are the first, send a freeze event to everyone
   */
  socket.on('buzz', () => {
    if (currentBuzz !== null || lockedPlayers.indexOf(id) !== -1) {
      return socket.emit('missed');
    }
    currentBuzz = id;
    io.emit('freeze', { chosenId: id, chosenTeamName: players[id].name });
  });

  /**
   * Admin event - on reset, set currentBuzz to zero and emit a 'reset' to everyone.
   */
  socket.on('lock', ({password}) => {
    if (password !== adminPassword) {
      return socket.emit('forbidden');
    }
    lockedPlayers.push(currentBuzz);
    io.emit('lock_or_reset', {lockedPlayers});
    currentBuzz = null;
  });

  /**
   * Admin event - on reset, set currentBuzz to zero and emit a 'reset' to everyone.
   */
  socket.on('reset', ({password}) => {
    if (password !== adminPassword) {
      return socket.emit('forbidden');
    }
    currentBuzz = null;
    lockedPlayers.splice(0, lockedPlayers.length);
    io.emit('resetted');
  });
});

process.on('exit', () => io.emit('exiting'));
