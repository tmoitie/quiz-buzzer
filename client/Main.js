import React, { Component, PropTypes } from 'react';
import SocketIO from 'socket.io-client';

import Register from './components/Register';
import Buzzer from './components/Buzzer';

import {socketUrl} from '../config';

import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';

export default class Main extends Component {
  static childContextTypes = {
    socket: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      teamName: null,
      frozen: false,
      chosen: false,
      locked: false,
      chosenTeamName: null
    };
    this.updateTeamName = this.updateTeamName.bind(this);
    this.buzz = this.buzz.bind(this);
  }

  getChildContext() {
    return {
      socket: this.socket
    };
  }

  componentWillMount() {
    this.socket = SocketIO.connect(socketUrl);

    this.socket.on('connected', ({frozen}) => this.setState({frozen}));

    this.socket.on('registered', ({id}) => this.setState({id}));
    this.socket.on('freeze', ({chosenId, chosenTeamName}) => this.setState({
      frozen: true, chosen: chosenId === this.state.id, chosenTeamName: chosenTeamName
    }));
    this.socket.on('lock_or_reset', ({lockedPlayers}) => this.setState({
      locked: lockedPlayers.indexOf(this.state.id) !== -1, frozen: false, chosen: false
    }));
    this.socket.on('resetted', () => this.setState({frozen: false, locked: false, chosen: false}));
  }

  componentDidMount() {
    /* eslint react/no-did-mount-set-state: 0 */
    const stored = window.localStorage.getItem('buzzers');

    if (stored) {
      const settings = JSON.parse(stored);
      if (settings.id) {
        this.socket.emit('remember', {oldId: settings.id, name: settings.teamName});
      }
      this.setState(settings);
    }
  }

  componentDidUpdate() {
    const { id, teamName } = this.state;

    window.localStorage.setItem('buzzers', JSON.stringify({ id, teamName }));
  }

  updateTeamName(name) {
    this.setState({teamName: name});
    this.socket.emit('register', {name: name});
  }

  buzz() {
    this.socket.emit('buzz', {id: this.state.id});
  }

  render() {
    const {teamName, frozen, locked, chosen, chosenTeamName} = this.state;
    return (
      <div className='container-fluid'>
        {teamName === null ? (
          <Register onSubmit={this.updateTeamName} />
        ) : (
          <Buzzer buzz={this.buzz} frozen={frozen} locked={locked} chosen={chosen}
            chosenTeamName={chosenTeamName} />
        )}
        {frozen ? <div className='chosen team'>
          {chosenTeamName} has buzzed
        </div> : null}
      </div>
    );
  }
}
