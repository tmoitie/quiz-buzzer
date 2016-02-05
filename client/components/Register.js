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
      <form onSubmit={this.submit}>
        <div className='form-group'>
          <label htmlFor='teamName'>Enter a team name:</label>
          <input type='text' ref='teamName' id='teamName' className='form-control' />
        </div>
        <button className='btn btn-primary btn-lg' type='submit'>Submit</button>
      </form>
    );
  }
}
