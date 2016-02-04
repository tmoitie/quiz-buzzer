import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import './buzzer.scss';

export default class Buzzer extends Component {
  static propTypes = {
    frozen: PropTypes.bool, chosen: PropTypes.bool, locked: PropTypes.bool, buzz: PropTypes.func
  };

  static defaultProps = {
    frozen: false, chosen: false, locked: false, buzz: () => {}
  };

  render() {
    const {frozen, chosen, locked, buzz} = this.props;

    return (
      <div className={classnames({
        buzzer: true, frozen: frozen, chosen: chosen, locked: locked
      })} onClick={buzz}>

      </div>
    );
  }
}
