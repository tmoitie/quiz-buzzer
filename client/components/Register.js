import React, { Component, PropTypes } from 'react';

export default class Register extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    errors: PropTypes.array,
    addError: PropTypes.func
  };

  static defaultProps = {
    onSubmit: () => {},
    errors: [],
    addError: () => {}
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.refs.teamName.focus();
  }

  submit(e) {
    const { onSubmit, addError } = this.props;
    if (this.refs.teamName.value.length < 3) {
      e.preventDefault();
      return addError('Team name must be more than 3 characters!');
    }
    onSubmit(this.refs.teamName.value);
  }

  render() {
    const {errors} = this.props
    return (
      <form onSubmit={this.submit}>
        {errors.length > 0 ? (
          <div className='alert alert-danger'>
            <ul>
              {errors.map((error, index) => <li key={index}>{error}</li>)}
            </ul>
          </div>
        ) : null}
        <div className='form-group'>
          <label htmlFor='teamName'>Enter a team name:</label>
          <input type='text' ref='teamName' id='teamName' className='form-control' />
        </div>
        <button className='btn btn-primary btn-lg' type='submit'>Submit</button>
      </form>
    );
  }
}
