import * as mapStyles from '../config/mapStyles';
import { ControlButton, ControlGroup, ControlPosition } from '../components/CustomControl/';
import { readBlobUrl, saveAs } from '../utils/';
import Dropzone from 'react-dropzone';
import Map from '../components/Map';
import React, { Component } from 'react';
import downloadjs from 'downloadjs';

/**
 * Export `MapGeoJson` Component.
 */

export default class MapGeoJson extends Component {
  draw = null;

  state = {
    geoJSON: {},
    preview: false,
  }

  geoJSON = {
    features: [],
    type: 'FeatureCollection',
  };

  markerSelected = false;

  /**
   * Constructor.
   */

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

  /**
   * Fit geo jSONBounds.
   */

  fitGeoJSONBounds() {
    if (!this.geoJSON.bbox) return;

    this.map.fitBounds(this.geoJSON.bbox, { padding: 20 });
  }

  /**
   * Set geo jSONData.
   */

  setGeoJSONData(data) {
    this.geoJSON = { ...this.props.geoJSON, ...data };

    this.setState({ geoJSON: this.geoJSON });
  }

  /**
   * Preview.
   */

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
      this.map.addSource('geoJSON', { data: this.geoJSON, type: 'geojson' });
      this.map.addLayer(mapStyles.polygon, 'poi_label_4');
      this.map.addLayer(mapStyles.lineLayer, 'poi_label_4');
      this.map.addLayer(mapStyles.marker);

      return;
    }

    this.draw.add(this.geoJSON);
  }

  /**
   * Download.
   */

  download() {
    this.geoJSON.bbox = [].concat(...this.map.getBounds().toArray());

    const data = encodeURIComponent(JSON.stringify(this.geoJSON, null, '    '));

    saveAs(data, 'map.geojson');
  }

  /**
   * Download image.
   */

  downloadImage() {
    const data = this.map.getCanvas().toDataURL();

    downloadjs(data, 'map.png');
  }

  /**
   * Handle on draw create.
   */

  handleOnDrawCreate({ features: [feature] }) {
    switch (feature.geometry.type) {
      case 'Point':
        this.updateMaker(feature);

        break;
      default:
        this.setGeoJSONData(this.draw.getAll());
    }
  }

  /**
   * Update maker.
   */

  updateMaker(feature) {
    if (feature.geometry.type !== 'Point') return;

    // eslint-disable-next-line
    const title = window.prompt('Edit me', feature.properties.title);

    this.draw.setFeatureProperty(feature.id, 'title', title);
    this.draw.setFeatureProperty(feature.id, 'icon', 'marker');

    this.setGeoJSONData(this.draw.getAll());
  }

  /**
   * Handle on draw update.
   */

  handleOnDrawUpdate() {
    this.setGeoJSONData(this.draw.getAll());
  }

  /**
   * Handle on map load.
   */

  handleOnMapLoad(map, draw, mapNode) {
    draw.add(this.geoJSON);

    this.draw = draw;
    this.map = map;
    this.mapNode = mapNode;
  }

  /**
   * Handle on draw selectionchange.
   */

  handleOnDrawSelectionchange({ features: [feature] }) {
    this.markerSelected = false;

    if (!feature) return;

    this.markerSelected = feature;
  }

  /**
   * Handle on map dbl click.
   */

  handleOnMapDblClick(...args) {
    if (!this.markerSelected) return;

    this.updateMaker(this.markerSelected);
  }

  /**
   * Handle on drop.
   */

  handleOnDrop(acceptedFiles, rejectedFiles) {
    if (!acceptedFiles.length) return;

    const [{ preview }] = acceptedFiles;

    readBlobUrl(preview, geoJSON => {
      this.setGeoJSONData(geoJSON);

      this.draw.add(this.geoJSON);

      this.fitGeoJSONBounds();
    });
  }

  /**
   * Render.
   */

  render() {
    const style = {
      height: '100vh',
      width: '100%',
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
          onDrawDelete={this.handleOnDrawUpdate}
          onMapDblClick={this.handleOnMapDblClick}
          onMapLoad={this.handleOnMapLoad}
          print={preview}
        >
          <ControlPosition>
            <ControlGroup>
              {this.geoJSON.bbox && <ControlButton className="geolocate" onClick={() => this.fitGeoJSONBounds()} />}

              <ControlButton onClick={() => this.preview()} style={{ background: preview ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 255, 0.21)' }}>
                <small>
                  {this.state.preview ? 'View' : 'Edit' } <br /> Mode
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
