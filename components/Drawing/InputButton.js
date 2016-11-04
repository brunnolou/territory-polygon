import React, { Component, PropTypes } from 'react';

const inputStyle = {
  width: '100%',
};

export class InputButton extends Component {
  static propTypes = {
    label: PropTypes.string,
    onSubmit: PropTypes.function,
    placeholder: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target: { value } }) {
    this.setState({ value });
  }

  render() {
    return (
      <div {...this.props}>
        <input
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          type="text"
          value={this.state.value}
          style={inputStyle}
        />
        <button onClick={() => this.props.onSubmit(this.state.value)}>
          {this.props.label || 'Submit'}
        </button>
      </div>
    );
  }
}

export default InputButton;
