import React, { Component, PropTypes } from 'react'
import config from "../config/config.json";
import mapboxgl, { MapboxglDraw } from '../core/mapbox-gl-helper';
import styled from 'styled-components';

const defaultDrawOptions = {
  drawing: true,
  displayControlsDefault: false,
  controls: {
    polygon: true,
    point: true,
    trash: true
  }
}

const Div = styled.div`
  position: absolute;
  overflow: hidden;
`;

const printStyle = {
  width: 1280,
  height: 591,
}

const style = {
  height: '100%',
  width: '100%'
};

class Map extends Component {
  static childContextTypes = {
    map: PropTypes.object,
  };

  state = {};

  getChildContext = () => ({
    map: this.state.map,
  });

  componentDidMount() {
    const { accessToken, style, center, zoom } = config;
    const {
      drawOptions,
      onDrawCreate,
      onDrawSelectionchange,
      onDrawUpdate,
      onMapDblClick,
      onMapLoad,
    } = this.props;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      center,
      container: this.mapNode,
      preserveDrawingBuffer: true,
      style,
      zoom
    });

    const draw = new MapboxglDraw({
      ...defaultDrawOptions,
      ...drawOptions
    });

    map.addControl(draw);
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.addControl(new mapboxgl.GeolocateControl(), 'bottom-right');

    map.on('style.load', (...args) => {
      if (!onMapLoad) return;

      onMapLoad(map, draw, this.mapNode, ...args);

      this.setState({ map });
    });

    map.on('dblclick', (...args) => onMapDblClick(...args));
    map.on('draw.create', (...args) => onDrawCreate(...args));
    map.on('draw.selectionchange', (...args) => onDrawSelectionchange(...args));
    map.on('draw.update', (...args) => onDrawUpdate(...args));
  }

  componentDidUpdate() {
    window.dispatchEvent(new Event('resize'));
  }

  render () {
    const { className, print, children } = this.props;

    return (
      <div
        style={print ? printStyle : style}
        className={className}
      >
        <Div
          innerRef={(map) => this.mapNode = map}
          print={print}
          style={print ? printStyle : style}
        >
          {children}
        </Div>
      </div>
    )
  }
}

export default Map;
