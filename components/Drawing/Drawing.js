import { encode as encodePoly, decode as decodePoly } from 'polyline';
import { stringify } from 'qs';
import React, { Component } from 'react';
import DrawingGoogleMap from './DrawingGoogleMap';
import InputButton from './InputButton';

const miniMapStyle = {
  maxWidth: '250px',
  maxHeight: '250px',
  position: 'fixed',
  boxShadow: '0 10px 50px -5px #000',
  right: 0,
  top: 80,
  opacity: 0.9,
};

const mapSize = {
  width: 640,
  height: 295,
};

const mapSizeHorizontal = `${mapSize.width}x${mapSize.height}`;
const mapSizeVertical = `${mapSize.height}x${mapSize.width}`;

export default class Drawing extends Component {
  baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?style=feature:landscape|element:geometry.fill|visibility:on|lightness:100&style=feature:poi|element:all|lightness:18|saturation:-55&style=feature:poi.business|element:all|visibility:off&style=feature:road|element:geometry.fill|lightness:-25|gamma:1.00&style=feature:road|element:labels.text.fill|lightness:-100&style=feature:road.arterial|element:geometry.fill|lightness:-5&style=feature:water|element:all|lightness:23&';

  urlParams = {
    key: 'AIzaSyDQKMtvWVC1OGr6BEdLAwSZiyMt3I6oeG4',
    path: {
      weight: 4,
      color: 'red',
      enc: 'qzq|Fz_nr@jj@?KitAqi@QKxtA',
    },
    scale: '2',
    size: mapSizeHorizontal,
  };

  rotate = () => {
    this.urlParams = {
      ...this.urlParams,
      size: this.urlParams.size === mapSizeHorizontal ? mapSizeVertical : mapSizeHorizontal,
    };

    this.setStaticMap();
  };

  polygons = [];

  constructor(props) {
    super(props);

    this.handlePolygonComplete = this.handlePolygonComplete.bind(this);
    this.addPoly = this.addPoly.bind(this);

    this.setStaticMap = () => this.setState({ staticMapUrl: this.getStaticMapUrl() });

    this.state = {
      staticMapUrl: this.getStaticMapUrl(),
      polygon: {},
      poly: {},
    };
  }

  getStaticMapUrl() {
    const url = {
      ...this.urlParams,
      path: this.parsePath(this.urlParams.path),
    };

    return this.baseUrl + stringify(url);
  }

  setPolyline(polyline) {
    this.urlParams.path.enc = polyline;

    this.setState({
      staticMapUrl: this.getStaticMapUrl(),
    });
  }

  parsePath(path) {
    return Object
      .keys(path)
      .map(key => `${key}:${path[key]}`)
      .join('|');
  }

  handlePolygonComplete(polygon) {
    console.log(polygon);
    if (typeof polygon !== 'object') {
      return;
    }

    google.maps.event.addListener(polygon, 'click', () => {
      this.handlePolygonComplete(polygon);
    });

    const vertices = polygon.getPath();
    const points = [];

    // Iterate over the vertices.
    for (let i = 0; i < vertices.getLength(); i++) {
      const cord = vertices.getAt(i);

      points.push([cord.lat(), cord.lng()]);
    }

    points.push(points[0]);

    const encodePoints = encodePoly(points);

    this.setPolyline(encodePoints);

    this.setState({
      polygon: {
        ...polygon,
        encodePoints,
      },
    });
  }

  addPoly(value) {
    const poly = decodePoly(value || '')
      .map((latLng) => new google.maps.LatLng(...latLng));

    this.setState({ poly });
  }

  render() {
    return (
      <div>
        <button
          onClick={this.rotate}
          style={{
            ...miniMapStyle,
            zIndex: 2,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 486.805 486.805">
            <path
              d="M261.397 17.983c-88.91 0-167.372 51.302-203.91 129.073L32.073 94.282 0 109.73l52.783 109.565 109.565-52.786-15.45-32.07-57.078 27.49c30.833-65.31 96.818-108.35 171.577-108.35 104.668 0 189.818 85.15 189.818 189.82s-85.15 189.82-189.818 189.82c-61.63 0-119.663-30.11-155.228-80.54l-29.1 20.52c42.24 59.87 111.14 95.612 184.32 95.612 124.284 0 225.41-101.12 225.41-225.42S385.68 17.984 261.39 17.984z"
              fill="#006DF0"
            />
          </svg>
        </button>

        <span
          style={{
            position: 'fixed',
            display: 'inline-block',
            top: 'auto',
            bottom: 20,
            left: 10,
            zIndex: 2,
            maxWidth: '100%',
            padding: '2px 10px',
            fontSize: 10,
            background: '#fff',
            boxShadow: '0 10px 50px -5px #000',
          }}
        >
          {this.state.polygon.encodePoints}
        </span>

        <InputButton
          style={{
            ...miniMapStyle,
            display: 'inline-block',
            bottom: 80,
            left: 10,
            opacity: 1,
            right: 'auto',
            top: 'auto',
            width: '100%',
            whiteSpace: 'nowrap',
            zIndex: 2,
          }}
          value={this.state.polygon.encodePoints}
          onSubmit={this.addPoly}
          label="Add to map"
          placeholder="Insert a encoded polygon code"
        />

        <DrawingGoogleMap
          onPolygonComplete={this.handlePolygonComplete}
          polygon={this.state.poly}
          containerElement={
            <div style={{ height: 'calc(100vh - 80px)' }} />
          }
          mapElement={
            <div style={{ height: 'calc(100vh - 80px)' }} />
          }
        />

        <a href={this.state.staticMapUrl} target="_blank">
          <img
            alt="Static map"
            style={{ ...miniMapStyle, border: '3px solid #fff' }}
            src={this.state.staticMapUrl}
          />
        </a>
      </div>
    );
  }
}
