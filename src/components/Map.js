import React, { Component, PropTypes } from 'react'
import config from "../config/config.json";
import mapboxgl from '../core/mapbox-gl-helper';
// eslint-disable-next-line
import MapboxglDraw from 'mapbox-gl-draw/dist/mapbox-gl-draw';

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

    const draw = new MapboxglDraw({
      ...defaultDrawOptions,
      ...this.props.drawOptions
    });

    const {
      onDrawCreate,
      onDrawSelectionchange,
      onDrawUpdate,
      onMapDblClick,
      onMapLoad,
    } = this.props;

    map.addControl(draw);
    map.on('style.load', (...args) => {
      if (onMapLoad) {
        onMapLoad(map, draw, ...args);
      }

      this.setState({ map });
    });

    map.on('dblclick', (...args) => onMapDblClick(...args));
    map.on('draw.create', (...args) => onDrawCreate(...args));
    map.on('draw.selectionchange', (...args) => onDrawSelectionchange(...args));
    map.on('draw.update', (...args) => onDrawUpdate(...args));
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
