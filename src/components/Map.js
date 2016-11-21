import React, { Component, PropTypes } from 'react'
import config from "../config/config.json";
import mapboxgl from '../core/mapbox-gl-helper';
// eslint-disable-next-line
import 'mapbox-gl/plugins/src/mapbox-gl-draw/v0.12.0/mapbox-gl-draw.js';

mapboxgl.accessToken = config.accessToken;

const style = {
  height: '100vh',
  width: '100%'
};

const defaultDrawOptions = {
  drawing: true,
  displayControlsDefault: false,
  controls: {
    polygon: true,
    point: true,
    trash: true
  }
}

class Map extends Component {
  static childContextTypes = {
    map: PropTypes.object,
  };

  state = {};

  getChildContext = () => ({
    map: this.state.map,
  });

  componentDidMount() {
    const { style, center, zoom } = config;
    const map = new mapboxgl.Map({
      container: this.mapNode,
      style,
      center,
      zoom
    });

    const draw = mapboxgl.Draw({
      ...defaultDrawOptions,
      ...this.props.drawOptions
    });

    const { onMapLoad, onDrawCreate } = this.props;

    map.addControl(draw);
    map.on('style.load', (...args) => {
      if (onMapLoad) {
        onMapLoad(map, draw, ...args);
      }

      this.setState({ map });
    });

    map.on('draw.create', () => onDrawCreate(map, draw));
  }

  render () {
    const { children } = this.props;

    return (
      <div
        ref={(map) => this.mapNode = map}
        style={style}
      >
        {children}
      </div>
    )
  }
}

export default Map;
