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
      chosenId: null
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
    const {frozen, chosenTeamName} = this.state;
    return (
      <div className='container-fluid'>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='form-group'>
            <label htmlFor='password'>Password: </label>
            <input id='password' className='form-control' type='password' onChange={this.updatePassword} />
          </div>
          {frozen ? <p>Team: {chosenTeamName}</p> : null}
          <p><button onClick={this.reset} className='btn btn-primary btn-lg'>Reset</button></p>
          {frozen ? <p><button onClick={this.lock} className='btn btn-danger btn-lg'>Lock</button></p> : null}
        </form>
      </div>
    );
  }
}
