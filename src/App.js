import './App.css';
import MapGeoJson from './containers/MapGeoJson';
import React, { Component } from 'react';

/**
 * Export `App` Component.
 */

export default class App extends Component {
  render() {
    return (
      <MapGeoJson />
    );
  }
}
