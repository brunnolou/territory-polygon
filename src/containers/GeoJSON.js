import React, { Component, PropTypes } from 'react'
import Dropzone from 'react-dropzone';
import MapGeoJson from '../components/MapGeoJson';

const style = {
  height: '100vh',
  width: '100%'
};

class GeoJSON extends Component {
  render () {
    return (
      <Dropzone
        disableClick
        onDrop={this.onDrop}
        style={style}
      >
        <MapGeoJson geoJSON={this.state.geoJSON} />
      </Dropzone>
    )
  }
}

export default GeoJSON;
