import React, { Component } from 'react';
import SocketIO from 'socket.io-client';

import {socketUrl} from '../config';

import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';

export default class AdminMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      frozen: false,
      chosenTeamName: null,
      chosenId: null,
      connectedPlayers: []
    };
    this.updatePassword = this.updatePassword.bind(this);
    this.reset = this.reset.bind(this);
    this.lock = this.lock.bind(this);
  }

  componentWillMount() {
    this.socket = SocketIO.connect(socketUrl);
    this.socket.on('connected', ({frozen, chosenTeamName}) => this.setState({frozen, chosenTeamName}));
    this.socket.on('freeze', ({chosenId, chosenTeamName}) => this.setState({
      frozen: true,
      chosenId,
      chosenTeamName
    }));
    this.socket.on('lock_or_reset', () => this.setState({frozen: false}));
    this.socket.on('resetted', () => this.setState({frozen: false}));
    this.socket.on('connected_players', (players) => this.setState({connectedPlayers: players}));
    this.socket.on('forbidden', () => console.log('Forbidden'));
  }

  componentDidMount() {
    setInterval(() => {
      this.socket.emit('get_connected', {password: this.state.password});
    }, 800);
  }

  updatePassword(e) {
    this.setState({password: e.target.value});
  }

  reset() {
    this.socket.emit('reset', {password: this.state.password});
  }

  lock() {
    this.socket.emit('lock', {password: this.state.password});
  }

  render() {
    const {frozen, chosenTeamName, connectedPlayers} = this.state;
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-xs-12'>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className='form-group'>
                <label htmlFor='password'>Password: </label>
                <input id='password' className='form-control' type='password' onChange={this.updatePassword} />
              </div>
              <p><button onClick={this.reset} className='btn btn-primary btn-lg'>Reset</button></p>
              {frozen ? <p><button onClick={this.lock} className='btn btn-danger btn-lg'>Lock</button></p> : null}
            </form>
            {frozen ? <h2>Buzzed: "{chosenTeamName}"</h2> : null}
            <h4>Connected Players ({connectedPlayers.length})</h4>
            <ul>
              {connectedPlayers.map(player => <li key={player.name}>{player.name}</li>)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
