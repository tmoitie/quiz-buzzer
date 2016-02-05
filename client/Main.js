import React, { Component, PropTypes } from 'react';
import update from 'react-addons-update';
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
      chosenTeamName: null,
      registerErrors: []
    };
    this.updateTeamName = this.updateTeamName.bind(this);
    this.buzz = this.buzz.bind(this);
    this.addRegisterError = this.addRegisterError.bind(this);
    this.resetTeamName = this.resetTeamName.bind(this);
  }

  getChildContext() {
    return {
      socket: this.socket
    };
  }

  componentWillMount() {
    this.socket = SocketIO.connect(socketUrl);

    this.socket.on('connected', ({frozen, chosen, chosenTeamName}) => this.setState({frozen, chosen, chosenTeamName}));

    this.socket.on('registered', ({id}) => this.setState({id}));
    this.socket.on('freeze', ({chosenId, chosenTeamName}) => this.setState({
      frozen: true, chosen: chosenId === this.state.id, chosenTeamName: chosenTeamName
    }));
    this.socket.on('lock_or_reset', ({lockedPlayers}) => this.setState({
      locked: lockedPlayers.indexOf(this.state.id) !== -1, frozen: false, chosen: false
    }));
    this.socket.on('resetted', () => this.setState({frozen: false, locked: false, chosen: false}));
    this.socket.on('register_error', (error) => this.addRegisterError(error));
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

  addRegisterError(message) {
    this.setState({
      registerErrors: update(this.state.registerErrors, {
        $push: [message]
      })
    });
  }

  resetTeamName() {
    this.setState({teamName: null});
  }

  render() {
    const {teamName, frozen, locked, chosen, chosenTeamName, registerErrors} = this.state;
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-xs-12'>
            <h3>Mads Quiz Buzzer</h3>
            {teamName === null ? (
              <Register onSubmit={this.updateTeamName} errors={registerErrors} addError={this.addRegisterError} />
            ) : (
              <Buzzer buzz={this.buzz} frozen={frozen} locked={locked} chosen={chosen}
                chosenTeamName={chosenTeamName} teamName={teamName} changeTeamName={this.resetTeamName} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
