import { ControlGroup, ControlPosition, ControlButton } from './CustomControl/';
import Dropzone from 'react-dropzone';
import Map from './Map';
import React, { Component } from 'react';
import * as mapStyles from '../config/mapStyles';
import downloadjs from 'downloadjs';

export default class MapGeoJson extends Component {
  draw = null;

  state = {
    geoJSON: {},
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
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.handleOnMapDblClick = this.handleOnMapDblClick.bind(this);
    this.handleOnMapLoad = this.handleOnMapLoad.bind(this);
    this.preview = this.preview.bind(this);
  }

  fitGeoJSONBounds() {
    if (!this.geoJSON.bbox) return;

    this.map.fitBounds(this.geoJSON.bbox, { padding: 20 });
  }

  setGeoJSONData(data) {
    this.geoJSON = { ...this.props.geoJSON, ...data };

    this.setState({ geoJSON: this.geoJSON });
  }

  preview(preview = this.state.preview) {
    this.setState({ preview: !this.state.preview });

    // Remove all before add.
    this.draw.changeMode('simple_select', { featureIds: [] });
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
    this.geoJSON.bbox = [].concat(...this.map.getBounds().toArray());

    downloadjs(
      JSON.stringify(this.geoJSON, null, '    '),
      'map.geojson',
      'application/vnd.geo+json'
    );
  }

  downloadImage() {
    const data = this.map.getCanvas().toDataURL();

    downloadjs(data, 'map.png');
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

    fileReader.onload = ({ target }) => {
      const geoJSON = JSON.parse(target.result);

      this.setGeoJSONData(geoJSON);

      this.draw.add(this.geoJSON);

      this.fitGeoJSONBounds();
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
    const style = {
      height: '100vh',
      width: '100%'
    };

    const { preview } = this.state;

    return (
      <Dropzone
        multiple={false}
        disableClick
        onDrop={this.handleOnDrop}
        style={style}
      >
        <Map
          className={preview ? 'previewing' : ''}
          onDrawCreate={this.handleOnDrawCreate}
          onDrawSelectionchange={this.handleOnDrawSelectionchange}
          onDrawUpdate={this.handleOnDrawUpdate}
          onMapDblClick={this.handleOnMapDblClick}
          onMapLoad={this.handleOnMapLoad}
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
          <ControlPosition>
            <ControlGroup>
              {this.geoJSON.bbox &&
                <ControlButton className="geolocate" onClick={() => this.fitGeoJSONBounds()} />
              }
              <ControlButton onClick={() => this.preview()} style={{ background: preview ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 255, 0.21)' }}>
                <small>
                  {this.state.preview ? 'View': 'Edit' } <br />
                  Mode
                </small>
              </ControlButton>
            </ControlGroup>

            <ControlGroup>
              <ControlButton onClick={() => this.download()}>
                <small>geo<br />JSON</small>
              </ControlButton>

              <ControlButton onClick={() => this.downloadImage()}>
                <small>Image</small>
              </ControlButton>
            </ControlGroup>
          </ControlPosition>
        </Map>
      </Dropzone>
    );
  }
}
