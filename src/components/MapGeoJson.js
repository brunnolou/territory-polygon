import Map from './Map';
import React, { Component } from 'react';
import * as mapStyles from '../config/mapStyles';

const geoJSON = {
  "type": "geojson",
  "data": {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-77.03238901390978, 38.913188059745586]
      },
      "properties": {
        "title": "Mapbox DC",
        "icon": "monument"
      }
    }, {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.414, 37.776]
      },
      "properties": {
        "title": "Mapbox SF",
        "icon": "harbor"
      }
    }]
  }
};

export default class MapGeoJson extends Component {
  draw = null;

  state = {
    preview: false,
  }

  markerSelected = false;

  constructor(props) {
    super(props);

    this.download = this.download.bind(this);
    this.handleOnDrawCreate = this.handleOnDrawCreate.bind(this);
    this.handleOnDrawSelectionchange = this.handleOnDrawSelectionchange.bind(this);
    this.handleOnDrawUpdate = this.handleOnDrawUpdate.bind(this);
    this.handleOnMapDblClick = this.handleOnMapDblClick.bind(this);
    this.handleOnMapLoad = this.handleOnMapLoad.bind(this);
    this.preview = this.preview.bind(this);

    this.geoJSON = props.geoJSON || geoJSON;
  }

  setGeoJSONData(data) {
    this.geoJSON = { ...geoJSON, data };
  }

  preview() {
    this.setState({ preview: !this.state.preview });

    // Remove all before add.
    this.draw.deleteAll();

    // Remove style layer.
    if (this.map.getLayer('markers')) {
      this.map.removeSource(mapStyles.marker.source);
      this.map.removeLayer(mapStyles.marker.id);
      this.map.removeLayer(mapStyles.polygon.id);
      this.map.removeLayer(mapStyles.lineLayer.id);
    }

    if (!this.state.preview) {
      this.map.addSource('geoJSON', this.geoJSON);
      this.map.addLayer(mapStyles.marker);
      this.map.addLayer(mapStyles.polygon);
      this.map.addLayer(mapStyles.lineLayer);

      return;
    }

    this.draw.add(this.geoJSON.data);
  }

  download() {
    const data = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.geoJSON, null, '    '));

    window.open(data);
  }

  handleOnDrawCreate({ features: [feature] }) {
    switch (feature.geometry.type) {
      case 'Point':
        this.updateMaker(feature);

        break;
      default:
        console.info(feature);
        this.setGeoJSONData(this.draw.getAll());
    }
  }

  updateMaker(feature) {
    if (feature.geometry.type !== 'Point') return;

    const title = window.prompt('Edit me', feature.properties.title);

    this.draw.setFeatureProperty(feature.id, 'title', title);
    this.draw.setFeatureProperty(feature.id, 'icon', 'marker');

    this.setGeoJSONData(this.draw.getAll());
  }

  handleOnDrawUpdate() {
    this.setGeoJSONData(this.draw.getAll());
  }

  handleOnMapLoad(map, draw) {
    draw.add(this.geoJSON.data);

    this.draw = draw;
    this.map = map;
  }

  handleOnDrawSelectionchange({ features: [feature] }) {
    this.markerSelected = false;

    if (!feature) return;

    this.markerSelected = feature;
  }

  handleOnMapDblClick(...args) {
    if (!this.markerSelected) return;

    this.updateMaker(this.markerSelected);
  }

  render() {
    const buttonStyle = {
      position: 'absolute',
      top: '2em',
      left: '2em',
      zIndex: '999',
      padding: '1em',
      backgroundColor: 'white'
    };

    return (
      <Map
        onMapLoad={this.handleOnMapLoad}
        onMapDblClick={this.handleOnMapDblClick}
        onDrawSelectionchange={this.handleOnDrawSelectionchange}
        onDrawCreate={this.handleOnDrawCreate}
        onDrawUpdate={this.handleOnDrawUpdate}
        drawOptions={{
          displayControlsDefault: false,
          controls: {
            polygon: true,
            point: true,
            trash: true
          }
        }}
      >
        <a onClick={this.preview} style={{ ...buttonStyle, left: '10em' }}>
          {this.state.preview ? 'Previewing' : 'Editing'}
        </a>

        <a onClick={this.download} style={buttonStyle}>Dowload</a>
      </Map>
    );
  }
}
