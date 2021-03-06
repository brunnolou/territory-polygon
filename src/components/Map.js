import { connect } from 'react-redux';
import React, { Component } from 'react';
import config from '../config/config.json';
import mapboxgl, { MapboxglDraw } from '../core/mapbox-gl-helper';
import styled from 'styled-components';

const defaultDrawOptions = {
  controls: {
    point: true,
    polygon: true,
    trash: true,
  },
  displayControlsDefault: false,
  drawing: true,
};

const Div = styled.div`
  position: absolute;
  overflow: hidden;
`;

const printStyle = {
  height: 591,
  width: 1280,
};

const style = {
  height: '100%',
  width: '100%',
};

/**
 * Export `Map` Component.
 */

export class Map extends Component {

  /**
   * Should component update.
   */

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.className !== nextProps.className) {
      return true;
    }

    return false;
  }

  /**
   * Component did mount.
   */

  componentDidMount() {
    const { accessToken, style } = config;
    const {
      center,
      drawOptions,
      onDrawCreate,
      onDrawDelete,
      onDrawSelectionchange,
      onDrawUpdate,
      onMapDblClick,
      onMapLoad,
      onMapMoveEnd,
      zoom,
    } = this.props;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      center,
      container: this.mapNode,
      preserveDrawingBuffer: true,
      style,
      zoom,
    });

    const draw = new MapboxglDraw({
      ...defaultDrawOptions,
      ...drawOptions,
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
    map.on('moveend', (...args) => onMapMoveEnd(...args));
    map.on('draw.create', (...args) => onDrawCreate(...args));
    map.on('draw.delete', (...args) => onDrawDelete(...args));
    map.on('draw.selectionchange', (...args) => onDrawSelectionchange(...args));
    map.on('draw.update', (...args) => onDrawUpdate(...args));
  }

  /**
   * Component did update.
   */

  componentDidUpdate() {
    window.dispatchEvent(new Event('resize'));
  }

  /**
   * Render.
   */

  render() {
    const { className, print, children } = this.props;

    return (
      <div
        style={print ? printStyle : style}
        className={className}
      >
        <Div
          innerRef={map => { this.mapNode = map; }}
          print={print}
          style={print ? printStyle : style}
        >
          {children}
        </Div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    center: state.location.LngLat,
    zoom: state.location.zoom,
  };
}

export default connect(mapStateToProps, null)(Map);
