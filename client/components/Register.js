import React, { Component, PropTypes } from 'react';

export default class Register extends Component {
  static propTypes = {
    onSubmit: PropTypes.func
  };

  static defaultProps = {
    onSubmit: () => {}
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit() {
    this.props.onSubmit(this.refs.teamName.value);
  }

  render() {
    return (
      <div>
        Enter a team name:
        <input type='text' ref='teamName' />
        <button onClick={this.submit}>Submit</button>
      </div>
    );
  }
}
