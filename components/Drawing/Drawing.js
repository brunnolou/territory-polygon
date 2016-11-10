import { encode as encodePoly, decode as decodePoly } from 'polyline';
import { stringify } from 'qs';
import React, { Component } from 'react';
import DrawingGoogleMap from './DrawingGoogleMap';
import InputButton from './InputButton';
import DeleteMenu from './DeleteMenu';
import MiniMap from './MiniMap';
import * as markerIcon from '../../core/MarkerIcon';

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
const style = 'style=feature:landscape|element:geometry.fill|visibility:on|lightness:100&style=feature:poi|element:all|lightness:18|saturation:-55&style=feature:poi.business|element:all|visibility:off&style=feature:road|element:geometry.fill|lightness:-25|gamma:1.00&style=feature:road|element:labels.text.fill|lightness:-100&style=feature:road.arterial|element:geometry.fill|lightness:-5&style=feature:water|element:all|lightness:23';

export default class Drawing extends Component {
  baseUrl = `https://maps.googleapis.com/maps/api/staticmap?${style}&`;

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

  polygons = [];

  constructor(props) {
    super(props);

    this.handlePolygonComplete = this.handlePolygonComplete.bind(this);
    this.handleMarkerComplete = this.handleMarkerComplete.bind(this);
    this.addPoly = this.addPoly.bind(this);
    this.rotate = this.rotate.bind(this);
    this.getStaticMapUrl = this.getStaticMapUrl.bind(this);

    this.state = {
      markers: [],
      poly: {},
      polygon: {},
      staticMapUrl: this.getStaticMapUrl(),
    };

    this.setStaticMap = () => this.setState({ staticMapUrl: this.getStaticMapUrl() });
  }

  rotate() {
    this.urlParams = {
      ...this.urlParams,
      size: this.urlParams.size === mapSizeHorizontal ? mapSizeVertical : mapSizeHorizontal,
    };

    this.setStaticMap();
  }

  getMarkerIconPath(marker) {
    let icon = encodeURI(encodeURI(marker.icon))
      .replace('&', '%26');

    icon += `|${marker.getPosition().lat()},${marker.getPosition().lng()}`;

    return {
      scale: 2,
      icon,
    };
  }

  getStaticMapUrl() {
    const markers = this.state ? this.state.markers : []
      .map(marker => this.objectToPipes(this.getMarkerIconPath(marker)))
      .join('&markers=');

    const url = {
      ...this.urlParams,
      path: this.objectToPipes(this.urlParams.path),
      markers,
    };

    return this.baseUrl + stringify(url, { encode: false });
  }

  setPolyline(polyline) {
    this.urlParams.path.enc = polyline;

    this.setState({
      staticMapUrl: this.getStaticMapUrl(),
    });
  }

  objectToPipes(path) {
    return Object
      .keys(path)
      .map(key => `${key}:${path[key]}`)
      .join('|');
  }

  handlePolygonComplete(polygon) {
    if (typeof polygon !== 'object') {
      return;
    }

    google.maps.event.addListener(polygon, 'click', () => {
      this.updatePolygon(polygon);
    });

    const deleteMenu = new DeleteMenu();

    google.maps.event.addListener(polygon, 'rightclick', event => {
      if (event.vertex === undefined) {
        return;
      }

      deleteMenu.open(polygon.getMap(), polygon.getPath(), event.vertex);
    });
  }

  removeMarker(marker) {
    let markers = this.state.markers;

    // Remove marker from the map.
    marker.setMap(null);

    // Delete map index.
    markers.splice(marker.key, 1);

    // Apdate index key from all following markers.
    markers = markers.map(item => {
      if (item.key > marker.key) {
        item.key--;
      }

      return item;
    });

    this.setState({ markers });
  }

  handleMarkerComplete(completMarker) {
    if (typeof completMarker !== 'object') {
      return;
    }

    const marker = completMarker;

    marker.key = this.state.markers.length;

    google.maps.event.addListener(marker, 'click', () => {
      const label = window.prompt();

      if (!label) {
        return;
      }

      marker.setIcon(markerIcon.getUrl(label))

      this.updateMarker(marker);
    });

    google.maps.event.addListener(marker, 'dragend', () => {
      this.updateMarker(marker);
    });

    google.maps.event.addListener(marker, 'rightclick', () => {
      this.removeMarker(marker);
    });

    this.setState({
      markers: [
        ...this.state.markers,
        marker,
      ],
    });
  }

  updateMarker(marker) {
    const markers = this.state.markers;

    markers[marker.key] = marker;

    this.setState({ markers });
  }

  updatePolygon(polygon) {
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
          onMarkerComplete={this.handleMarkerComplete}
          polygon={this.state.poly}
          containerElement={
            <div style={{ height: 'calc(100vh - 80px)' }} />
          }
          mapElement={
            <div style={{ height: 'calc(100vh - 80px)' }} />
          }
        />

        <MiniMap
          rotate={this.rotate}
          staticMapUrl={this.state.staticMapUrl}
        />
      </div>
    );
  }
}
