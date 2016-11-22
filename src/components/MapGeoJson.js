import Dropzone from 'react-dropzone';
import Map from './Map';
import React, { Component } from 'react';
import * as mapStyles from '../config/mapStyles';

export default class MapGeoJson extends Component {
  draw = null;

  state = {
    preview: false,
  }

  geoJSON = { 'type': 'FeatureCollection', 'features': [] };

  markerSelected = false;

  constructor() {
    super();

    this.download = this.download.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
    this.handleOnDrawCreate = this.handleOnDrawCreate.bind(this);
    this.handleOnDrawSelectionchange = this.handleOnDrawSelectionchange.bind(this);
    this.handleOnDrawUpdate = this.handleOnDrawUpdate.bind(this);
    this.handleOnMapDblClick = this.handleOnMapDblClick.bind(this);
    this.handleOnMapLoad = this.handleOnMapLoad.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.preview = this.preview.bind(this);
  }

  setGeoJSONData(data) {
    this.geoJSON = { ...this.props.geoJSON, ...data };
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
      this.map.addSource('geoJSON', { 'type': 'geojson', 'data': this.geoJSON });
      this.map.addLayer(mapStyles.polygon);
      this.map.addLayer(mapStyles.lineLayer);
      this.map.addLayer(mapStyles.marker);

      return;
    }

    this.draw.add(this.geoJSON);
  }

  download() {
    this.geoJSON.bbox = [].concat(...this.map.getBounds().toArray());;

    const data = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.geoJSON, null, '    '));

    window.open(data);
  }

  downloadImage() {
    const data = this.map.getCanvas().toDataURL();

    window.open(data);
  }

  handleOnDrawCreate({ features: [feature] }) {
    switch (feature.geometry.type) {
      case 'Point':
        this.updateMaker(feature);

        break;
      default:
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

  handleOnMapLoad(map, draw, mapNode) {
    draw.add(this.geoJSON);

    this.draw = draw;
    this.map = map;
    this.mapNode = mapNode;
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

  handleOnDrop(acceptedFiles, rejectedFiles) {
    if (!acceptedFiles.length) return;

    const [{ preview }] = acceptedFiles;

    const fileReader = new FileReader();

    fileReader.onload = event => {
      const geoJSON = JSON.parse(event.target.result);

      this.setGeoJSONData(geoJSON);

      this.draw.add(this.geoJSON);

      if (geoJSON.bbox) {
        this.map.fitBounds(geoJSON.bbox, { padding: 20 });
      }
    }

    const xhr = new XMLHttpRequest();

    xhr.open('GET', preview, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (this.status !== 200) return;

      fileReader.readAsText(this.response);
    };

    xhr.send();
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

    const style = {
      height: '100vh',
      width: '100%'
    };

    const { preview } = this.state;

    return (
      <Dropzone
        disableClick
        onDrop={this.handleOnDrop}
        style={style}
      >
        <Map
          className={preview ? 'previewing' : ''}
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
          print={preview}
        >
          <div className="no-print">
            <a onClick={this.preview} style={{ ...buttonStyle, left: '20em' }}>
              {preview ? 'Previewing' : 'Editing'}
            </a>

            <a onClick={this.download} style={buttonStyle}>geoJSON</a>
            <a onClick={this.downloadImage} style={{ ...buttonStyle, left: '10em' }}>Image</a>
          </div>
        </Map>
      </Dropzone>
    );
  }
}
