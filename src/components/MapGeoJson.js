import React, { Component } from 'react';
import Map from './Map';
import Popup from './Popup';

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

const layerOptions = {
  id: 'markers',
  type: 'symbol',
  source: 'points',
  layout: {
    'icon-image': '{icon}-15',
    'text-field': '{title}',
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-offset': [0, -0.6],
    'text-anchor': 'bottom'
  }
};

export default class MapGeoJson extends Component {
  draw = null;

  state = {
    preview: false,
  }

  constructor() {
    super();

    this.download = this.download.bind(this);
    this.preview = this.preview.bind(this);
    this.handleOnDrawCreate = this.handleOnDrawCreate.bind(this);
    this.handleOnMapLoad = this.handleOnMapLoad.bind(this);
  }

  getGeoJSON() {
    return {
      ...geoJSON,
      data: this.draw.getAll()
    };
  }

  componentDidMount() {
  }

  preview() {
    const geoJSON = this.getGeoJSON();

    this.setState({ preview: !this.state.preview });

    // Remove all before add.
    if (!this.data) {
      this.data = this.draw.getAll();
    }

    console.log(this.data);
    this.draw.deleteAll();

    if (this.map.getLayer('markers')) {
      this.map.removeSource('points');
      this.map.removeLayer('markers');
    }

    if (!this.state.preview) {
      this.map.addSource('points', geoJSON);

      this.map.addLayer(layerOptions);

      return;
    }

    this.draw.add(this.data);
  }

  download() {
    const data = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.getGeoJSON(), null, '    '));

    window.open(data);
  }

  handleOnDrawCreate() {
    this.draw.getAll();
  }

  handleOnMapLoad(map, draw) {
    draw.add(geoJSON.data);

    this.draw = draw;
    this.map = map;
    this.map.on('draw.create', () => { console.log('cum que?'); })
  }

  render() {
    const buttonStyle = {
      position: 'absolute',
      top: '2em',
      right: '2em',
      zIndex: '999',
      padding: '1em',
      backgroundColor: 'white'
    };

    return (
      <Map
        onMapLoad={this.handleOnMapLoad}
        onDrawCreate={this.handleOnDrawCreate}
        drawOptions={{
          displayControlsDefault: false,
          controls: {
            polygon: true,
            point: true,
            trash: true
          }
        }}
      >
        <a onClick={this.preview} style={{ ...buttonStyle, right: '10em' }}>Preview {this.state.preview ? '√' : 'x'}</a>
        <a onClick={this.download} style={buttonStyle}>Dowload</a>

        {
          this.state.popup && (
            <Popup coordinates={this.state.popup.coordinates} closeButton={true}>
              <div>
                <input type="text" />
              </div>
            </Popup>
          )
        }

      </Map>
    );
  }
}
