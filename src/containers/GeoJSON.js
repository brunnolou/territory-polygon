import React, { Component, PropTypes } from 'react'

class GeoJSON extends Component {
  render () {
    const { children } = this.props;

    return (
      <div>
        { children }
      </div>
    )
  }
}

export default GeoJSON;
