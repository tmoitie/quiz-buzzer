import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import './buzzer.scss';

export default class Buzzer extends Component {
  static propTypes = {
    frozen: PropTypes.bool,
    chosen: PropTypes.bool,
    locked: PropTypes.bool,
    buzz: PropTypes.func,
    chosenTeamName:PropTypes.string
  };

  static defaultProps = {
    frozen: false, chosen: false, locked: false, buzz: () => {}
  };

  render() {
    const {frozen, chosen, locked, buzz, chosenTeamName} = this.props;

    return (
      <div>
        <div className={classnames({
          buzzer: true, frozen: frozen, chosen: chosen, locked: locked
        })} onMouseDown={buzz} onTouchStart={buzz}>
          {locked ? <span className='glyphicon glyphicon-lock' /> : null}
        </div>

        {frozen ? <div className='chosen-team'>
          “{chosenTeamName}” has buzzed
        </div> : null}
      </div>
    );
  }
}
